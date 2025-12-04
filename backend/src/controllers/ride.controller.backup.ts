import { Request, Response } from 'express';
import Ride from '../models/Ride.model';
import User from '../models/User.model';
import Group from '../models/Group.model';
import { v4 as uuidv4 } from 'uuid';
import PaymentService, { UPIPaymentDetails } from '../services/payment.service';

// @desc    Create a new ride listing
// @route   POST /api/rides/create
// @access  Private
export const createRide = async (req: any, res: Response): Promise<void> => {
  try {
    const { 
      pickup, 
      destination, 
      date, 
      time, 
      seatsAvailable, 
      pricePerSeat, 
      carModel, 
      rules 
    } = req.body;

    // Validate required fields
    if (!pickup || !destination || !date || !time || !seatsAvailable || pricePerSeat === undefined) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
      return;
    }

    // Generate unique chat room ID
    const chatRoomId = uuidv4();

    // Create ride in database
    const ride = await Ride.create({
      driver: req.user.id,
      pickup,
      destination,
      date: new Date(date),
      time,
      seatsAvailable,
      pricePerSeat,
      carModel,
      rules,
      chatRoomId,
      status: 'Open'
    });

    // Create a group for ride participants
    const groupChatRoomId = uuidv4();
    const groupName = `Ride: ${pickup.address.split(',')[0]} to ${destination.address.split(',')[0]}`;
    
    const group = await Group.create({
      groupName,
      members: [{
        user: req.user.id,
        role: 'admin',
        joinedAt: new Date()
      }],
      route: {
        pickup,
        drop: destination
      },
      dateTime: new Date(date),
      seatCount: seatsAvailable,
      chatRoomId: groupChatRoomId,
      description: `Group chat for ride from ${pickup.address} to ${destination.address} on ${new Date(date).toLocaleDateString()} at ${time}`,
      status: 'Locked' // Pre-lock the group for ride participants only
    });

    // Update ride with group chat room ID
    ride.chatRoomId = groupChatRoomId;
    await ride.save();

    res.status(201).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    console.error('Error creating ride:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Get all rides
// @route   GET /api/rides
// @access  Private
export const getAllRides = async (req: any, res: Response): Promise<void> => {
  try {
    // Get all open rides
    const rides = await Ride.find({ status: 'Open' })
      .populate('driver', 'name email phone')
      .sort({ date: 1, time: 1 }); // Sort by date and time
    
    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Get ride details by ID
// @route   GET /api/rides/:id
// @access  Private
export const getRide = async (req: any, res: Response): Promise<void> => {
  try {
    console.log('DEBUG: Get ride request received');
    console.log('DEBUG: Ride ID:', req.params.id);
    
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name email phone')
      .populate('riders.user', 'name email phone');
    
    if (!ride) {
      console.log('DEBUG: Ride not found');
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    console.log('DEBUG: Ride found with QR code URL:', ride.qrCodeUrl);
    
    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    console.error('DEBUG: Error getting ride:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};// @desc    Get current user's rides (as driver or rider)
// @route   GET /api/rides/my-rides
// @access  Private
export const getMyRides = async (req: any, res: Response): Promise<void> => {
  try {
    // Find rides where user is the driver
    const asDriver = await Ride.find({ driver: req.user.id })
      .populate('driver', 'name email phone')
      .populate('riders.user', 'name email phone')
      .sort({ date: -1, time: -1 }); // Sort by newest first
    
    // Find rides where user is a rider
    const asRider = await Ride.find({ 'riders.user': req.user.id })
      .populate('driver', 'name email phone')
      .populate('riders.user', 'name email phone')
      .sort({ date: -1, time: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      data: {
        asDriver,
        asRider
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Request a seat in a ride
// @route   POST /api/rides/:id/request-seat
// @access  Private
export const requestSeat = async (req: any, res: Response): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Check if ride is open
    if (ride.status !== 'Open') {
      res.status(400).json({
        success: false,
        message: 'Ride is not open for new requests'
      });
      return;
    }
    
    // Check if user is already a rider
    const existingRider = ride.riders.find(rider => 
      rider.user.toString() === req.user.id.toString()
    );
    
    if (existingRider) {
      res.status(400).json({
        success: false,
        message: 'You have already requested a seat in this ride'
      });
      return;
    }
    
    // Check if there are available seats
    const acceptedRiders = ride.riders.filter(rider => rider.status === 'Accepted');
    if (acceptedRiders.length >= ride.seatsAvailable) {
      res.status(400).json({
        success: false,
        message: 'No seats available in this ride'
      });
      return;
    }
    
    // Add user to riders with 'Requested' status
    ride.riders.push({
      user: req.user.id,
      status: 'Requested',
      requestedAt: new Date()
    });
    
    await ride.save();
    
    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Accept or reject a seat request
// @route   PATCH /api/rides/:id/rider/:riderId
// @access  Private (Driver only)
export const updateRiderStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    
    if (!['Accepted', 'Rejected'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Accepted or Rejected'
      });
      return;
    }
    
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the driver can update rider status'
      });
      return;
    }
    
    // Find the rider
    const riderIndex = ride.riders.findIndex(rider => 
      rider.user.toString() === req.params.riderId
    );
    
    if (riderIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Rider not found in this ride'
      });
      return;
    }
    
    // Update rider status
    ride.riders[riderIndex].status = status;
    if (status === 'Accepted') {
      ride.riders[riderIndex].acceptedAt = new Date();
      
      // Add accepted rider to the group if it exists
      try {
        const group = await Group.findOne({ chatRoomId: ride.chatRoomId });
        if (group) {
          // Check if rider is already in the group
          const isMember = group.members.some(member => 
            member.user.toString() === req.params.riderId
          );
          
          if (!isMember) {
            // Add rider to group as member
            group.members.push({
              user: req.params.riderId,
              role: 'member',
              joinedAt: new Date()
            });
            await group.save();
          }
        }
      } catch (groupError) {
        console.error('Error adding rider to group:', groupError);
        // Don't fail the ride update if group addition fails
      }
    }
    
    await ride.save();
    
    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Mark rider payment status
// @route   PATCH /api/rides/:id/rider/:riderId/payment
// @access  Private (Driver only)
export const updatePaymentStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { status } = req.body; // 'Paid' or 'Pending Payment'
    
    if (!['Paid', 'Pending Payment'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Paid or Pending Payment'
      });
      return;
    }
    
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the driver can update payment status'
      });
      return;
    }
    
    // Find the rider
    const riderIndex = ride.riders.findIndex(rider => 
      rider.user.toString() === req.params.riderId
    );
    
    if (riderIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Rider not found in this ride'
      });
      return;
    }
    
    // Update rider payment status
    ride.riders[riderIndex].status = status;
    
    await ride.save();
    
    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Rider marks self as paid and requests payment verification
// @route   PATCH /api/rides/:id/mark-paid
// @access  Private (Rider only)
export const riderMarkPaid = async (req: any, res: Response): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Find the rider
    const riderIndex = ride.riders.findIndex(rider => 
      rider.user.toString() === req.user.id.toString()
    );
    
    if (riderIndex === -1) {
      res.status(403).json({
        success: false,
        message: 'You are not a rider in this ride'
      });
      return;
    }
    
    // Update rider payment status to 'Payment Verification Pending'
    (ride.riders[riderIndex] as any).status = 'Payment Verification Pending';
    (ride.riders[riderIndex] as any).paymentVerificationRequested = true;
    
    await ride.save();
    
    // Send notification to driver with more detailed information
    const { createNotification } = await import('./notification.controller');
    await createNotification({
      recipient: ride.driver.toString(),
      sender: req.user.id,
      type: 'system',
      title: 'Payment Verification Request',
      content: `${req.user.name} has marked their payment as completed for the ride from ${ride.pickup.address} to ${ride.destination.address} on ${new Date(ride.date).toLocaleDateString()} at ${ride.time}. Please verify the payment in the Admin Payment Dashboard.`,
      relatedId: ride._id.toString()
    });
    
    // Also emit socket event for real-time notification
    const { io } = await import('../server');
    io.to(`user_${ride.driver.toString()}`).emit('payment_verification_requested', {
      rideId: ride._id.toString(),
      riderName: req.user.name,
      riderId: req.user.id,
      message: `${req.user.name} has marked their payment as completed. Please verify the payment.`
    });
    
    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Verify rider payment
// @route   PATCH /api/rides/:id/rider/:riderId/verify-payment
// @access  Private (Driver only)
export const verifyRiderPayment = async (req: any, res: Response): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the driver can verify payments'
      });
      return;
    }
    
    // Find the rider
    const riderIndex = ride.riders.findIndex(rider => 
      rider.user.toString() === req.params.riderId
    );
    
    if (riderIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Rider not found in this ride'
      });
      return;
    }
    
    // Get rider details before updating
    const riderDetails = ride.riders[riderIndex];
    
    // Verify payment and update status to 'Paid'
    (ride.riders[riderIndex] as any).status = 'Paid';
    (ride.riders[riderIndex] as any).paymentVerificationRequested = false;
    
    await ride.save();
    
    // Add rider to the ride group if it exists
    try {
      const group = await Group.findOne({ chatRoomId: ride.chatRoomId });
      if (group) {
        // Check if rider is already in the group
        const isMember = group.members.some(member => 
          member.user.toString() === req.params.riderId
        );
        
        if (!isMember) {
          // Add rider to group as member
          group.members.push({
            user: req.params.riderId,
            role: 'member',
            joinedAt: new Date()
          });
          await group.save();
        }
      }
    } catch (groupError) {
      console.error('Error adding rider to ride group:', groupError);
      // Don't fail the payment verification if group addition fails
    }
    
    // Add rider to Student's Own Car Pool group
    try {
      const { addUserToStudentPoolGroup } = await import('../services/studentPool.service');
      await addUserToStudentPoolGroup(req.params.riderId);
    } catch (error) {
      console.error('Error adding user to Student\'s Own Car Pool group:', error);
      // Don't fail the payment verification if group addition fails
    }
    
    // Send notification to rider with more detailed information
    const { createNotification } = await import('./notification.controller');
    await createNotification({
      recipient: req.params.riderId,
      sender: req.user.id,
      type: 'system',
      title: 'Payment Verified Successfully!',
      content: `Great news! Your payment of ₹${ride.pricePerSeat} for the ride from ${ride.pickup.address} to ${ride.destination.address} on ${new Date(ride.date).toLocaleDateString()} has been verified by ${req.user.name}. You've been added to the Student's Own Car Pool group and can now chat with other verified riders.`,
      relatedId: ride._id.toString()
    });
    
    // Emit socket event for real-time update
    const { io } = await import('../server');
    io.to(`user_${req.params.riderId}`).emit('payment_verified', {
      rideId: ride._id.toString(),
      message: `Your payment has been verified by ${req.user.name}. You can now access the group chat.`
    });
    
    // Emit event to update ride for all participants
    io.emit('ride_updated', {
      rideId: ride._id.toString(),
      updatedRide: ride
    });
    
    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Reject rider payment
// @route   PATCH /api/rides/:id/rider/:riderId/reject-payment
// @access  Private (Driver only)
export const rejectRiderPayment = async (req: any, res: Response): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the driver can reject payments'
      });
      return;
    }
    
    // Find the rider
    const riderIndex = ride.riders.findIndex(rider => 
      rider.user.toString() === req.params.riderId
    );
    
    if (riderIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Rider not found in this ride'
      });
      return;
    }
    
    // Get rider details before updating
    const riderDetails = ride.riders[riderIndex];
    
    // Reject payment and update status back to 'Accepted'
    (ride.riders[riderIndex] as any).status = 'Accepted';
    (ride.riders[riderIndex] as any).paymentVerificationRequested = false;
    
    await ride.save();
    
    // Send notification to rider with more detailed information
    const { createNotification } = await import('./notification.controller');
    await createNotification({
      recipient: req.params.riderId,
      sender: req.user.id,
      type: 'system',
      title: 'Payment Verification Failed',
      content: `Unfortunately, your payment for the ride from ${ride.pickup.address} to ${ride.destination.address} on ${new Date(ride.date).toLocaleDateString()} has been rejected by the driver (${req.user.name}). Please contact the driver directly to resolve this issue or make another payment attempt.`,
      relatedId: ride._id.toString()
    });
    
    // Emit socket event for real-time update
    const { io } = await import('../server');
    io.to(`user_${req.params.riderId}`).emit('payment_rejected', {
      rideId: ride._id.toString(),
      message: `Your payment has been rejected by ${req.user.name}. Please contact the driver directly to resolve this issue.`
    });
    
    // Emit event to update ride for all participants
    io.emit('ride_updated', {
      rideId: ride._id.toString(),
      updatedRide: ride
    });
    
    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Get UPI payment details for a ride
// @route   GET /api/rides/:id/payment-details
// @access  Private
export const getPaymentDetails = async (req: any, res: Response): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name');
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Check if user is a rider in this ride
    const rider = ride.riders.find(r => 
      r.user.toString() === req.user.id.toString()
    );
    
    if (!rider) {
      res.status(403).json({
        success: false,
        message: 'You are not a rider in this ride'
      });
      return;
    }
    
    // In a real implementation, the driver would have a UPI ID stored in their profile
    // For this demo, we'll use a placeholder
    const driverUPIId = 'driver@upi'; // This would come from driver.profile.upiId
    
    const paymentDetails: UPIPaymentDetails = {
      upiId: driverUPIId,
      amount: ride.pricePerSeat,
      recipientName: (ride.driver as any).name,
      note: `Ride payment for ${ride.pickup.address} to ${ride.destination.address}`
    };
    
    const upiLink = PaymentService.generateUPIPaymentLink(paymentDetails);
    const qrCode = PaymentService.generateUPIQRCode(paymentDetails);
    
    res.status(200).json({
      success: true,
      data: {
        upiLink,
        qrCode,
        amount: ride.pricePerSeat,
        recipient: (ride.driver as any).name
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Upload UPI QR code for a ride
// @route   POST /api/rides/:id/upload-qr
// @access  Private (Driver only)
export const uploadRideQRCode = async (req: any, res: Response): Promise<void> => {
  try {
    console.log('DEBUG: Upload QR code request received');
    console.log('DEBUG: Ride ID:', req.params.id);
    console.log('DEBUG: User ID:', req.user.id);
    console.log('DEBUG: File received:', req.file);
    
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      console.log('DEBUG: Ride not found');
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    console.log('DEBUG: Ride found:', ride._id);
    console.log('DEBUG: Ride driver:', ride.driver.toString());
    
    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id.toString()) {
      console.log('DEBUG: User is not the driver');
      res.status(403).json({
        success: false,
        message: 'Only the driver can upload QR code'
      });
      return;
    }
    
    // Check if file was uploaded
    if (!req.file) {
      console.log('DEBUG: No file uploaded');
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }
    
    console.log('DEBUG: File details:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    // Save the actual file path
    ride.qrCodeUrl = `/uploads/${req.file.filename}`;
    console.log('DEBUG: Setting QR code URL to:', ride.qrCodeUrl);
    
    await ride.save();
    console.log('DEBUG: Ride saved successfully');
    
    // Populate the updated ride
    const updatedRide = await Ride.findById(ride._id)
      .populate('driver', 'name email phone')
      .populate('riders.user', 'name email phone');
    
    console.log('DEBUG: Updated ride data:', {
      qrCodeUrl: updatedRide?.qrCodeUrl,
      driver: updatedRide?.driver,
      ridersCount: updatedRide?.riders.length
    });
    
    res.status(200).json({
      success: true,
      data: updatedRide
    });
  } catch (err: any) {
    console.error('Error uploading QR code:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Update UPI QR code URL for a ride (Compliant method)
// @route   PATCH /api/rides/:id/qr-url
// @access  Private (Driver only)
export const updateRideQRCodeUrl = async (req: any, res: Response): Promise<void> => {
  try {
    console.log('DEBUG: Update QR code URL request received');
    console.log('DEBUG: Ride ID:', req.params.id);
    console.log('DEBUG: User ID:', req.user.id);
    console.log('DEBUG: QR Code URL:', req.body.qrCodeUrl);
    
    const { qrCodeUrl } = req.body;
    
    // Validate request
    if (!req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Ride ID is required'
      });
      return;
    }
    
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }
    
    // Validate URL format
    if (!qrCodeUrl) {
      res.status(400).json({
        success: false,
        message: 'QR code URL is required'
      });
      return;
    }
    
    try {
      new URL(qrCodeUrl);
    } catch (_) {
      res.status(400).json({
        success: false,
        message: 'Invalid QR code URL format'
      });
      return;
    }
    
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the driver can update QR code URL'
      });
      return;
    }
    
    // Update QR code URL
    ride.qrCodeUrl = qrCodeUrl;
    await ride.save();
    
    // Populate the updated ride
    const updatedRide = await Ride.findById(ride._id)
      .populate('driver', 'name email phone')
      .populate('riders.user', 'name email phone');
    
    res.status(200).json({
      success: true,
      message: 'QR code URL updated successfully',
      data: updatedRide
    });
  } catch (err: any) {
    console.error('Error updating QR code URL:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Update driver UPI ID for a ride// @route   PATCH /api/rides/:id/upi-id
// @access  Private (Driver only)
export const updateDriverUpiId = async (req: any, res: Response): Promise<void> => {
  try {
    res.status(400).json({
      success: false,
      message: 'UPI ID functionality has been removed. Please use QR code only.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Close a ride (when full or completed)
// @route   PATCH /api/rides/:id/close
// @access  Private (Driver only)
export const closeRide = async (req: any, res: Response): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }
    
    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the driver can close the ride'
      });
      return;
    }
    
    // Update ride status to 'Closed'
    ride.status = 'Closed';
    
    await ride.save();
    
    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Update a ride listing
// @route   PUT /api/rides/:id
// @access  Private (Driver only)
export const updateRide = async (req: any, res: Response): Promise<void> => {
  try {
    const { 
      pickup, 
      destination, 
      date, 
      time, 
      seatsAvailable, 
      pricePerSeat, 
      carModel, 
      rules,
      status
    } = req.body;

    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
      return;
    }

    // Check if user is the driver
    if (ride.driver.toString() !== req.user.id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Only the driver can update this ride'
      });
      return;
    }

    // Update ride fields
    if (pickup) ride.pickup = pickup;
    if (destination) ride.destination = destination;
    if (date) ride.date = new Date(date);
    if (time) ride.time = time;
    if (seatsAvailable !== undefined) ride.seatsAvailable = seatsAvailable;
    if (pricePerSeat !== undefined) ride.pricePerSeat = pricePerSeat;
    if (carModel !== undefined) ride.carModel = carModel;
    if (rules !== undefined) ride.rules = rules;
    if (status !== undefined) ride.status = status;

    await ride.save();

    // If the ride group exists, update it as well
    try {
      const group = await Group.findOne({ chatRoomId: ride.chatRoomId });
      if (group) {
        if (pickup) group.route.pickup = pickup;
        if (destination) group.route.drop = destination;
        if (date) group.dateTime = new Date(date);
        if (seatsAvailable !== undefined) group.seatCount = seatsAvailable;
        
        await group.save();
      }
    } catch (groupError) {
      console.error('Error updating ride group:', groupError);
      // Don't fail the ride update if group update fails
    }

    // Populate the updated ride
    const updatedRide = await Ride.findById(ride._id)
      .populate('driver', 'name email phone')
      .populate('riders.user', 'name email phone');

    res.status(200).json({
      success: true,
      data: updatedRide
    });
  } catch (err: any) {
    console.error('Error updating ride:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};
