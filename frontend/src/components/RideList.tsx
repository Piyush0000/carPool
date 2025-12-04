import React, { useState } from 'react';
import type { Ride } from '../services/ride.service';

interface RideListProps {
  rides: Ride[];
  onRideSelect?: (ride: Ride) => void;
  showRequestButton?: boolean;
  onRequestSeat?: (rideId: string) => void;
}

const RideList: React.FC<RideListProps> = ({ 
  rides, 
  onRideSelect,
  showRequestButton = false,
  onRequestSeat
}) => {
  const [error, setError] = useState<string | null>(null);
  const [requestingRideId, setRequestingRideId] = useState<string | null>(null);

  const handleRequestSeat = async (rideId: string) => {
    if (!onRequestSeat) return;
    
    try {
      setRequestingRideId(rideId);
      await onRequestSeat(rideId);
    } catch (err: any) {
      setError(err.message || 'Failed to request seat');
    } finally {
      setRequestingRideId(null);
    }
  };

  if (rides.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No rides available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Be the first to create a ride listing!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rides.map((ride) => {
        const acceptedRiders = ride.riders.filter(rider => rider.status === 'Accepted');
        const availableSeats = ride.seatsAvailable - acceptedRiders.length;
        
        return (
          <div 
            key={ride._id} 
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {ride.pickup.address.split(',')[0]} → {ride.destination.address.split(',')[0]}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(ride.date).toLocaleDateString()} at {ride.time}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  ride.status === 'Open' 
                    ? 'bg-green-100 text-green-800' 
                    : ride.status === 'Closed' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {ride.status}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{acceptedRiders.length}/{ride.seatsAvailable} seats taken</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>₹{ride.pricePerSeat} per seat</span>
                </div>
                
                {ride.carModel && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{ride.carModel}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => onRideSelect?.(ride)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                >
                  View Details
                </button>
                
                {showRequestButton && ride.status === 'Open' && availableSeats > 0 && (
                  <button
                    onClick={() => handleRequestSeat(ride._id)}
                    disabled={requestingRideId === ride._id}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {requestingRideId === ride._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 108-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Requesting...
                      </>
                    ) : (
                      'Request Seat'
                    )}
                  </button>
                )}
                
                {showRequestButton && ride.status === 'Open' && availableSeats === 0 && (
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    Full
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {error && (
        <div className="col-span-full bg-red-50 border-l-4 border-red-400 p-4">
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
      )}
    </div>
  );
};

export default RideList;