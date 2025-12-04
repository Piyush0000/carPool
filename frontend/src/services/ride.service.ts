import axios from 'axios';

const API_BASE_URL = '/api/rides';

// Define types for our ride data
export interface RideLocation {
  address: string;
  coordinates?: [number, number];
}

export interface RideRider {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  status: 'Requested' | 'Accepted' | 'Rejected' | 'Paid' | 'Pending Payment' | 'Payment Verification Pending';
  requestedAt: string;
  acceptedAt?: string;
  paymentVerificationRequested?: boolean;
  paymentProof?: string;
}

export interface Ride {
  _id: string;
  driver: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  pickup: RideLocation;
  destination: RideLocation;
  date: string;
  time: string;
  seatsAvailable: number;
  pricePerSeat: number;
  carModel?: string;
  rules?: string;
  status: 'Open' | 'Closed' | 'Completed';
  riders: RideRider[];
  chatRoomId: string;
  upiId?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRideData {
  pickup: RideLocation;
  destination: RideLocation;
  date: string;
  time: string;
  seatsAvailable: number;
  pricePerSeat: number;
  carModel?: string;
  rules?: string;
}

export interface PaymentDetails {
  upiLink: string;
  qrCode: string;
  amount: number;
  recipient: string;
}

class RideService {
  /**
   * Create a new ride listing
   * @param rideData - The ride details
   * @returns Promise with the created ride
   */
  static async createRide(rideData: CreateRideData): Promise<Ride> {
    const response = await axios.post(`${API_BASE_URL}/create`, rideData);
    return response.data.data;
  }

  /**
   * Get all available rides
   * @returns Promise with array of rides
   */
  static async getAllRides(): Promise<Ride[]> {
    const response = await axios.get(API_BASE_URL);
    return response.data.data;
  }

  /**
   * Get ride details by ID
   * @param rideId - The ID of the ride
   * @returns Promise with the ride details
   */
  static async getRideById(rideId: string): Promise<Ride> {
    const response = await axios.get(`${API_BASE_URL}/${rideId}`);
    return response.data.data;
  }

  /**
   * Get current user's rides (as driver or rider)
   * @returns Promise with user's rides
   */
  static async getMyRides(): Promise<{ asDriver: Ride[]; asRider: Ride[] }> {
    const response = await axios.get(`${API_BASE_URL}/my-rides`);
    return response.data.data;
  }

  /**
   * Request a seat in a ride
   * @param rideId - The ID of the ride
   * @returns Promise with updated ride
   */
  static async requestSeat(rideId: string): Promise<Ride> {
    const response = await axios.post(`${API_BASE_URL}/${rideId}/request-seat`);
    return response.data.data;
  }

  /**
   * Update a ride listing - Driver only
   * @param rideId - The ID of the ride
   * @param rideData - The updated ride details
   * @returns Promise with the updated ride
   */
  static async updateRide(rideId: string, rideData: Partial<CreateRideData & { status?: 'Open' | 'Closed' | 'Completed' }>): Promise<Ride> {
    const response = await axios.put(`${API_BASE_URL}/${rideId}`, rideData);
    return response.data.data;
  }

  /**
   * Update rider status (accept/reject) - Driver only
   * @param rideId - The ID of the ride
   * @param riderId - The ID of the rider
   * @param status - The new status ('Accepted' or 'Rejected')
   * @returns Promise with updated ride
   */
  static async updateRiderStatus(
    rideId: string,
    riderId: string,
    status: 'Accepted' | 'Rejected'
  ): Promise<Ride> {
    const response = await axios.patch(`${API_BASE_URL}/${rideId}/rider/${riderId}`, { status });
    return response.data.data;
  }

  /**
   * Update payment status - Driver only
   * @param rideId - The ID of the ride
   * @param riderId - The ID of the rider
   * @param status - The new payment status ('Paid' or 'Pending Payment')
   * @returns Promise with updated ride
   */
  static async updatePaymentStatus(
    rideId: string,
    riderId: string,
    status: 'Paid' | 'Pending Payment'
  ): Promise<Ride> {
    const response = await axios.patch(`${API_BASE_URL}/${rideId}/rider/${riderId}/payment`, { status });
    return response.data.data;
  }

  /**
   * Rider marks self as paid
   * @param rideId - The ID of the ride
   * @returns Promise with updated ride
   */
  static async riderMarkPaid(rideId: string): Promise<Ride> {
    const response = await axios.patch(`${API_BASE_URL}/${rideId}/mark-paid`);
    return response.data.data;
  }

  /**
   * Verify rider payment - Driver only
   * @param rideId - The ID of the ride
   * @param riderId - The ID of the rider
   * @returns Promise with updated ride
   */
  static async verifyRiderPayment(rideId: string, riderId: string): Promise<Ride> {
    const response = await axios.patch(`${API_BASE_URL}/${rideId}/rider/${riderId}/verify-payment`);
    return response.data.data;
  }

  /**
   * Reject rider payment - Driver only
   * @param rideId - The ID of the ride
   * @param riderId - The ID of the rider
   * @returns Promise with updated ride
   */
  static async rejectRiderPayment(rideId: string, riderId: string): Promise<Ride> {
    const response = await axios.patch(`${API_BASE_URL}/${rideId}/rider/${riderId}/reject-payment`);
    return response.data.data;
  }

  /**
   * Upload ride QR code - Driver only
   * @param rideId - The ID of the ride
   * @param qrCodeFile - The QR code image file
   * @returns Promise with updated ride
   */
  static async uploadRideQRCode(rideId: string, qrCodeFile: File): Promise<Ride> {
    const formData = new FormData();
    formData.append('qrCode', qrCodeFile);
    
    const response = await axios.post(`${API_BASE_URL}/${rideId}/upload-qr`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }

  /**
   * Update driver UPI ID - Driver only
   * @param rideId - The ID of the ride
   * @param upiId - The UPI ID
   * @returns Promise with updated ride
   */
  static async updateDriverUpiId(rideId: string, upiId: string): Promise<Ride> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    throw new Error('UPI ID functionality has been removed. Please use QR code only.');
  }

  /**
   * Get UPI payment details for a ride
   * @param rideId - The ID of the ride
   * @returns Promise with payment details
   */
  static async getPaymentDetails(rideId: string): Promise<PaymentDetails> {
    const response = await axios.get(`${API_BASE_URL}/${rideId}/payment-details`);
    return response.data.data;
  }

  /**
   * Close a ride (when full or completed) - Driver only
   * @param rideId - The ID of the ride
   * @returns Promise with updated ride
   */
  static async closeRide(rideId: string): Promise<Ride> {
    const response = await axios.patch(`${API_BASE_URL}/${rideId}/close`);
    return response.data.data;
  }
}

export default RideService;