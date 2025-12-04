import React, { useState, useEffect } from 'react';
import RideService from '../services/ride.service';

interface DriverRide {
  _id: string;
  pickup: {
    address: string;
  };
  destination: {
    address: string;
  };
  date: string;
  time: string;
  pricePerSeat: number;
  seatsAvailable: number;
  riders: {
    user: {
      _id: string;
      name: string;
    };
    status: 'Requested' | 'Accepted' | 'Rejected' | 'Paid' | 'Pending Payment';
  }[];
}

const DriverWallet: React.FC = () => {
  const [rides, setRides] = useState<DriverRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDriverRides();
  }, []);

  const loadDriverRides = async () => {
    try {
      setLoading(true);
      const response = await RideService.getMyRides();
      setRides(response.asDriver);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  // Calculate earnings statistics
  const totalSeatsListed = rides.reduce((sum, ride) => sum + ride.seatsAvailable, 0);
  
  const totalSeatsFilled = rides.reduce((sum, ride) => {
    return sum + ride.riders.filter(rider => 
      rider.status === 'Accepted' || rider.status === 'Paid' || rider.status === 'Pending Payment'
    ).length;
  }, 0);
  
  const totalEarningsExpected = rides.reduce((sum, ride) => {
    const filledSeats = ride.riders.filter(rider => 
      rider.status === 'Accepted' || rider.status === 'Paid' || rider.status === 'Pending Payment'
    ).length;
    return sum + (filledSeats * ride.pricePerSeat);
  }, 0);
  
  const totalEarningsReceived = rides.reduce((sum, ride) => {
    const paidRiders = ride.riders.filter(rider => rider.status === 'Paid').length;
    return sum + (paidRiders * ride.pricePerSeat);
  }, 0);
  
  const totalEarningsPending = totalEarningsExpected - totalEarningsReceived;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
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
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Driver Wallet</h2>
      </div>
      
      <div className="p-6">
        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-sm font-medium text-indigo-700">Total Seats Listed</p>
            <p className="mt-2 text-3xl font-bold text-indigo-900">{totalSeatsListed}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-700">Seats Filled</p>
            <p className="mt-2 text-3xl font-bold text-green-900">{totalSeatsFilled}</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-700">Amount Expected</p>
            <p className="mt-2 text-3xl font-bold text-blue-900">₹{totalEarningsExpected}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-700">Amount Received</p>
            <p className="mt-2 text-3xl font-bold text-purple-900">₹{totalEarningsReceived}</p>
          </div>
        </div>
        
        {/* Pending Amount */}
        <div className="mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Pending Amount:</span> ₹{totalEarningsPending}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rides List */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Your Rides</h3>
          
          {rides.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No rides yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first ride listing to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ride
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rides.map((ride) => {
                    const filledSeats = ride.riders.filter(rider => 
                      rider.status === 'Accepted' || rider.status === 'Paid' || rider.status === 'Pending Payment'
                    ).length;
                    
                    const paidRiders = ride.riders.filter(rider => rider.status === 'Paid').length;
                    const earnings = paidRiders * ride.pricePerSeat;
                    
                    return (
                      <tr key={ride._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ride.pickup.address.split(',')[0]} → {ride.destination.address.split(',')[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(ride.date).toLocaleDateString()} at {ride.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {filledSeats}/{ride.seatsAvailable}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₹{ride.pricePerSeat}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{earnings}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverWallet;