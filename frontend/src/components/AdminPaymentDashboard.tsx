import React, { useState, useEffect } from 'react';
import type { Ride, RideRider } from '../services/ride.service';
import RideService from '../services/ride.service';

interface AdminPaymentDashboardProps {
  rides: Ride[];
  onRideUpdate: () => void;
}

const AdminPaymentDashboard: React.FC<AdminPaymentDashboardProps> = ({ rides, onRideUpdate }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');
  
  // Filter rides based on payment status
  const filteredRides = rides.filter(ride => {
    if (filter === 'all') return true;
    
    const hasPendingPayments = ride.riders.some(rider => 
      rider.status === 'Payment Verification Pending' || 
      rider.status === 'Pending Payment' ||
      rider.status === 'Accepted'
    );
    
    const hasVerifiedPayments = ride.riders.some(rider => rider.status === 'Paid');
    
    if (filter === 'pending') return hasPendingPayments;
    if (filter === 'verified') return hasVerifiedPayments;
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
      case 'Payment Verification Pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Verification Pending</span>;
      case 'Pending Payment':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Pending</span>;
      case 'Accepted':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Accepted</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Get all riders with pending verification
  const getPendingVerificationRiders = () => {
    const pendingRiders: { ride: Ride; rider: RideRider }[] = [];
    
    rides.forEach(ride => {
      ride.riders.forEach(rider => {
        if (rider.status === 'Payment Verification Pending') {
          pendingRiders.push({ ride, rider });
        }
      });
    });
    
    return pendingRiders;
  };

  const pendingVerificationRiders = getPendingVerificationRiders();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Payment Dashboard</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Monitor and manage all ride payments</p>
      </div>
      
      <div className="border-t border-gray-200">
        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-800 font-medium' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Rides
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 font-medium' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Pending Payments
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'verified' 
                  ? 'bg-green-100 text-green-800 font-medium' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Verified Payments
            </button>
          </div>
          
          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredRides.length} of {rides.length} rides
          </div>
        </div>
        
        {/* Pending Verification Section */}
        {pendingVerificationRiders.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3">Pending Payment Verifications</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ride
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rider
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingVerificationRiders.map(({ ride, rider }, index) => (
                    <tr key={`${ride._id}-${rider.user._id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ride.pickup.address} → {ride.destination.address}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(ride.date).toLocaleDateString()} at {ride.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rider.user.name}</div>
                        <div className="text-sm text-gray-500">{rider.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{ride.pricePerSeat}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              try {
                                await RideService.verifyRiderPayment(ride._id, rider.user._id);
                                onRideUpdate();
                              } catch (error) {
                                alert('Failed to verify payment');
                              }
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Verify
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await RideService.rejectRiderPayment(ride._id, rider.user._id);
                                onRideUpdate();
                              } catch (error) {
                                alert('Failed to reject payment');
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* All Rides Section */}
        <div className="px-6 py-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">All Rides</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ride Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Riders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRides.map((ride) => (
                  <tr key={ride._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ride.pickup.address} → {ride.destination.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(ride.date).toLocaleDateString()} at {ride.time}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{ride.pricePerSeat}/seat
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ride.driver.name}</div>
                      <div className="text-sm text-gray-500">{ride.driver.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {ride.riders.filter(r => r.status !== 'Requested' && r.status !== 'Rejected').length} riders
                      </div>
                      <div className="text-sm text-gray-500">
                        {ride.seatsAvailable} seats available
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {ride.riders
                          .filter(rider => rider.status !== 'Requested' && rider.status !== 'Rejected')
                          .map(rider => (
                            <div key={rider.user._id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{rider.user.name}:</span>
                              {getStatusBadge(rider.status)}
                            </div>
                          ))
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredRides.length === 0 && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No rides found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' 
                    ? 'No rides have been created yet.' 
                    : filter === 'pending'
                    ? 'No rides with pending payments.'
                    : 'No rides with verified payments.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentDashboard;