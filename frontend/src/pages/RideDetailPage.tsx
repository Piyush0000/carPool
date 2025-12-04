import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RideService from '../services/ride.service';
import type { Ride } from '../services/ride.service';
import DriverPaymentPanel from '../components/DriverPaymentPanel';
import RiderPaymentPanel from '../components/RiderPaymentPanel';
import EditRideModal from '../components/EditRideModal';
import { useAuth } from '../contexts/AuthContext';

const RideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRiderId, setUpdatingRiderId] = useState<string | null>(null);
  const [markingPaymentId, setMarkingPaymentId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [requestingSeat, setRequestingSeat] = useState(false);

  useEffect(() => {
    if (id) {
      loadRide();
    }
  }, [id]);

  const loadRide = async () => {
    try {
      setLoading(true);
      const fetchedRide = await RideService.getRideById(id!);
      setRide(fetchedRide);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load ride details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRider = async (riderId: string) => {
    try {
      setUpdatingRiderId(riderId);
      await RideService.updateRiderStatus(id!, riderId, 'Accepted');
      await loadRide(); // Reload to show updated status
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to accept rider');
    } finally {
      setUpdatingRiderId(null);
    }
  };

  const handleRejectRider = async (riderId: string) => {
    try {
      setUpdatingRiderId(riderId);
      await RideService.updateRiderStatus(id!, riderId, 'Rejected');
      await loadRide(); // Reload to show updated status
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reject rider');
    } finally {
      setUpdatingRiderId(null);
    }
  };

  const handleMarkPaid = async (riderId: string) => {
    try {
      setMarkingPaymentId(riderId);
      
      // Check if current user is the driver or the rider
      if (ride?.driver._id === riderId) {
        // Current user is marking themselves as paid
        await RideService.riderMarkPaid(id!);
      } else {
        // Driver is marking rider as paid
        await RideService.updatePaymentStatus(id!, riderId, 'Paid');
      }
      
      await loadRide(); // Reload to show updated status
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update payment status');
    } finally {
      setMarkingPaymentId(null);
    }
  };

  const handleMarkPending = async (riderId: string) => {
    try {
      setMarkingPaymentId(riderId);
      await RideService.updatePaymentStatus(id!, riderId, 'Pending Payment');
      await loadRide(); // Reload to show updated status
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update payment status');
    } finally {
      setMarkingPaymentId(null);
    }
  };

  const handleSendPaymentReminder = async (riderId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    try {
      // In a real implementation, this would send a notification to the rider
      alert(`Payment reminder sent to rider`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send payment reminder');
    }
  };

  const handleCloseRide = async () => {
    try {
      await RideService.closeRide(id!);
      await loadRide(); // Reload to show updated status
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to close ride');
    }
  };

  const handleRequestSeat = async () => {
    try {
      setRequestingSeat(true);
      await RideService.requestSeat(id!);
      await loadRide(); // Reload to show updated status
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to request seat');
    } finally {
      setRequestingSeat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Ride not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The ride you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/rides')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Rides
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const acceptedRiders = ride.riders.filter(rider => rider.status === 'Accepted');
  const requestedRiders = ride.riders.filter(rider => rider.status === 'Requested');
  const paidRiders = ride.riders.filter(rider => rider.status === 'Paid');
  const pendingPaymentRiders = ride.riders.filter(rider => rider.status === 'Pending Payment');
  
  // Calculate available seats (ensure it doesn't go below zero)
  const availableSeats = Math.max(0, ride.seatsAvailable - acceptedRiders.length);
  
  // Check if current user is the driver
  const isDriver = ride.driver._id === user?.id;
  
  // Check if current user is a rider in this ride (any active status)
  const isRider = ride.riders.some(rider => 
    rider.user._id === user?.id && 
    (rider.status === 'Accepted' || rider.status === 'Paid' || rider.status === 'Payment Verification Pending' || rider.status === 'Pending Payment')
  );
  
  // Check if current user is a passenger (either driver or accepted rider)
  const isPassenger = isDriver || isRider;
  
  // Get current user's rider info if they are a rider
  const currentUserRiderInfo = ride.riders.find(rider => rider.user._id === user?.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/rides')}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Rides
          </button>
        </div>

        {/* Edit Ride Modal */}
        {isEditing && ride && (
          <EditRideModal 
            ride={ride} 
            onClose={() => setIsEditing(false)} 
            onUpdate={(updatedRide: Ride) => {
              setRide(updatedRide);
              setIsEditing(false);
            }} 
          />
        )}

        {/* Ride Confirmation Status Banner */}
        {isPassenger && (
          <div className="mb-6">
            <div className={`rounded-lg p-4 ${
              currentUserRiderInfo?.status === 'Paid' 
                ? 'bg-green-50 border border-green-200' 
                : currentUserRiderInfo?.status === 'Payment Verification Pending'
                ? 'bg-yellow-50 border border-yellow-200'
                : currentUserRiderInfo?.status === 'Accepted'
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center">
                {currentUserRiderInfo?.status === 'Paid' && (
                  <>
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Ride Confirmed!</h3>
                      <p className="text-sm text-green-700">Your payment has been verified. You're all set for this ride.</p>
                    </div>
                  </>
                )}
                {currentUserRiderInfo?.status === 'Payment Verification Pending' && (
                  <>
                    <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Payment Verification Pending</h3>
                      <p className="text-sm text-yellow-700">Your payment is awaiting verification by the driver.</p>
                    </div>
                  </>
                )}
                {currentUserRiderInfo?.status === 'Accepted' && (
                  <>
                    <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">Ride Request Accepted</h3>
                      <p className="text-sm text-blue-700">Your ride request has been accepted. Please complete payment to confirm.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {ride.pickup.address.split(',')[0]} → {ride.destination.address.split(',')[0]}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date(ride.date).toLocaleDateString()} at {ride.time}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                  ride.status === 'Open' 
                    ? 'bg-green-100 text-green-800' 
                    : ride.status === 'Closed' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {ride.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="space-y-6">
                  {/* Ride Details */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ride Details</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Pickup</h3>
                          <p className="mt-1 text-sm text-gray-900">{ride.pickup.address}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Destination</h3>
                          <p className="mt-1 text-sm text-gray-900">{ride.destination.address}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(ride.date).toLocaleDateString()} at {ride.time}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Price</h3>
                          <p className="mt-1 text-sm text-gray-900">₹{ride.pricePerSeat} per seat</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Available Seats</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {availableSeats}/{ride.seatsAvailable}
                          </p>
                        </div>
                        {ride.carModel && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Car Model</h3>
                            <p className="mt-1 text-sm text-gray-900">{ride.carModel}</p>
                          </div>
                        )}
                      </div>
                      {ride.rules && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-500">Rules</h3>
                          <p className="mt-1 text-sm text-gray-900">{ride.rules}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Driver Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center">
                            <span className="text-indigo-800 font-bold">
                              {ride.driver.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{ride.driver.name}</h3>
                          <p className="text-sm text-gray-500">{ride.driver.email}</p>
                          <p className="text-sm text-gray-500">{ride.driver.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rider Requests (Driver only) */}
                  {isDriver && requestedRiders.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Rider Requests</h2>
                      <div className="space-y-4">
                        {requestedRiders.map((rider) => (
                          <div key={rider.user._id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                                  <span className="text-gray-700 font-bold">
                                    {rider.user.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-900">{rider.user.name}</h3>
                                <p className="text-sm text-gray-500">Requested on {new Date(rider.requestedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRejectRider(rider.user._id)}
                                disabled={updatingRiderId === rider.user._id}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                              >
                                {updatingRiderId === rider.user._id ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Rejecting...
                                  </>
                                ) : (
                                  'Reject'
                                )}
                              </button>
                              <button
                                onClick={() => handleAcceptRider(rider.user._id)}
                                disabled={updatingRiderId === rider.user._id}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                              >
                                {updatingRiderId === rider.user._id ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Accepting...
                                  </>
                                ) : (
                                  'Accept'
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accepted Riders (Driver only) */}
                  {isDriver && acceptedRiders.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Accepted Riders</h2>
                      <div className="space-y-4">
                        {acceptedRiders.map((rider) => (
                          <div key={rider.user._id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
                                    <span className="text-green-800 font-bold">
                                      {rider.user.name.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-sm font-medium text-gray-900">{rider.user.name}</h3>
                                  <p className="text-sm text-gray-500">{rider.user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {rider.status === 'Accepted' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Awaiting Payment
                                  </span>
                                )}
                                {rider.status === 'Paid' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Paid & Confirmed
                                  </span>
                                )}
                                {rider.status === 'Pending Payment' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Payment Pending
                                  </span>
                                )}
                                {rider.status === 'Payment Verification Pending' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Verification Pending
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                              {rider.status === 'Accepted' && (
                                <>
                                  <button
                                    onClick={() => handleSendPaymentReminder(rider.user._id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    <svg className="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Send Reminder
                                  </button>
                                  <button
                                    onClick={() => handleMarkPaid(rider.user._id)}
                                    disabled={markingPaymentId === rider.user._id}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                  >
                                    {markingPaymentId === rider.user._id ? (
                                      <>
                                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                      </>
                                    ) : (
                                      'Mark as Paid'
                                    )}
                                  </button>
                                </>
                              )}
                              
                              {rider.status === 'Pending Payment' && (
                                <>
                                  <button
                                    onClick={() => handleSendPaymentReminder(rider.user._id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    <svg className="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Send Reminder
                                  </button>
                                  <button
                                    onClick={() => handleMarkPaid(rider.user._id)}
                                    disabled={markingPaymentId === rider.user._id}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                  >
                                    {markingPaymentId === rider.user._id ? (
                                      <>
                                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                      </>
                                    ) : (
                                      'Mark as Paid'
                                    )}
                                  </button>
                                </>
                              )}
                              
                              {rider.status === 'Payment Verification Pending' && (
                                <div className="flex items-center text-sm text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded">
                                  <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Awaiting your verification
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Summary (Driver only) */}
                  {isDriver && (paidRiders.length > 0 || pendingPaymentRiders.length > 0) && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Total Seats</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{ride.seatsAvailable}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Filled Seats</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{acceptedRiders.length}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Amount Expected</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">₹{ride.seatsAvailable * ride.pricePerSeat}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Amount Received</p>
                            <p className="mt-1 text-2xl font-bold text-green-600">₹{paidRiders.length * ride.pricePerSeat}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Rider Payment Status</h3>
                          <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rider
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Seat Price
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Confirmation
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {ride.riders.map((rider) => (
                                  <tr key={rider.user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                                            <span className="text-gray-700 font-bold">
                                              {rider.user.name.charAt(0)}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{rider.user.name}</div>
                                          <div className="text-sm text-gray-500">{rider.user.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      ₹{ride.pricePerSeat}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {rider.status === 'Paid' && (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                          Paid
                                        </span>
                                      )}
                                      {rider.status === 'Pending Payment' && (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                          Pending
                                        </span>
                                      )}
                                      {rider.status === 'Accepted' && (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                          Awaiting Payment
                                        </span>
                                      )}
                                      {rider.status === 'Payment Verification Pending' && (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                          Verification Pending
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {rider.status === 'Paid' && (
                                        <div className="flex items-center">
                                          <svg className="h-4 w-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-green-700">Confirmed</span>
                                        </div>
                                      )}
                                      {rider.status === 'Payment Verification Pending' && (
                                        <div className="flex items-center">
                                          <svg className="h-4 w-4 text-yellow-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 11-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-yellow-700">Pending Verification</span>
                                        </div>
                                      )}
                                      {(rider.status === 'Accepted' || rider.status === 'Pending Payment') && (
                                        <div className="flex items-center">
                                          <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-gray-500">Not Confirmed</span>
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      {rider.status === 'Paid' && (
                                        <button
                                          onClick={() => handleMarkPending(rider.user._id)}
                                          disabled={markingPaymentId === rider.user._id}
                                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                        >
                                          {markingPaymentId === rider.user._id ? 'Processing...' : 'Mark Pending'}
                                        </button>
                                      )}
                                      {rider.status === 'Pending Payment' && (
                                        <button
                                          onClick={() => handleMarkPaid(rider.user._id)}
                                          disabled={markingPaymentId === rider.user._id}
                                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                        >
                                          {markingPaymentId === rider.user._id ? 'Processing...' : 'Mark Paid'}
                                        </button>
                                      )}
                                      {rider.status === 'Accepted' && (
                                        <button
                                          onClick={() => handleMarkPaid(rider.user._id)}
                                          disabled={markingPaymentId === rider.user._id}
                                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                        >
                                          {markingPaymentId === rider.user._id ? 'Processing...' : 'Mark Paid'}
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* Payment Panel - Show different panels based on user role */}
                {isDriver ? (
                  <DriverPaymentPanel ride={ride} onRideUpdate={loadRide} />
                ) : isRider ? (
                  <RiderPaymentPanel 
                    ride={ride} 
                    currentUser={{ id: user?.id || '' }} 
                    onRideUpdate={loadRide} 
                  />
                ) : (
                  /* UPI Payment Section for non-participants */
                  <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Request to Join Ride</h2>
                    {availableSeats > 0 ? (
                      <>
                        <p className="text-sm text-gray-700 mb-4">
                          This ride has {availableSeats} seat{availableSeats !== 1 ? 's' : ''} available. Request to join and the driver will review your request.
                        </p>
                        <button
                          onClick={handleRequestSeat}
                          disabled={requestingSeat}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {requestingSeat ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Requesting...
                            </>
                          ) : (
                            'Request Seat'
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Ride Full</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          This ride is currently full. Please check back later or look for another ride.
                        </p>
                        <button
                          onClick={() => navigate('/rides')}
                          className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Browse Other Rides
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Driver Actions */}
                {isDriver && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                    <div className="space-y-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Ride
                      </button>
                      {ride.status === 'Open' && (
                        <button
                          onClick={handleCloseRide}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Close Ride
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetailPage;