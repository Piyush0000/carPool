import React from 'react';
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
  const handleRequestSeat = async (rideId: string) => {
    if (!onRequestSeat) return;
    
    try {
      await onRequestSeat(rideId);
    } catch (err: any) {
      // Error handling would typically be done at the parent component level
      console.error('Failed to request seat:', err);
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
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Request Seat
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
    </div>
  );
};

export default RideList;