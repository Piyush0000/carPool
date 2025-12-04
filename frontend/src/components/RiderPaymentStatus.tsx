import React, { useState } from 'react';
import RideService from '../services/ride.service';

interface RiderPaymentStatusProps {
  rideId: string;
  riderId: string;
  riderName: string;
  status: 'Requested' | 'Accepted' | 'Rejected' | 'Paid' | 'Pending Payment';
  pricePerSeat: number;
  onPaymentStatusChange?: (riderId: string, newStatus: 'Paid' | 'Pending Payment') => void;
  isDriver?: boolean;
}

const RiderPaymentStatus: React.FC<RiderPaymentStatusProps> = ({ 
  rideId,
  riderId,
  riderName,
  status,
  pricePerSeat,
  onPaymentStatusChange,
  isDriver = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkPaid = async () => {
    if (!isDriver) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // If the current user is the rider themselves
      if (riderId === 'current') {
        await RideService.riderMarkPaid(rideId);
      } else {
        // Driver marking rider as paid
        await RideService.updatePaymentStatus(rideId, riderId, 'Paid');
      }
      
      if (onPaymentStatusChange) {
        onPaymentStatusChange(riderId, 'Paid');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPending = async () => {
    if (!isDriver) return;
    
    try {
      setLoading(true);
      setError(null);
      await RideService.updatePaymentStatus(rideId, riderId, 'Pending Payment');
      
      if (onPaymentStatusChange) {
        onPaymentStatusChange(riderId, 'Pending Payment');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleSendPaymentReminder = () => {
    // In a real implementation, this would send a notification to the rider
    alert(`Payment reminder sent to ${riderName}`);
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Awaiting Payment
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Paid
          </span>
        );
      case 'Pending Payment':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Payment Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-gray-700 font-bold">
                {riderName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">{riderName}</h3>
            <p className="text-sm text-gray-500">₹{pricePerSeat}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {renderStatusBadge()}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
      
      <div className="mt-4 flex flex-wrap gap-2">
        {status === 'Accepted' && (
          <>
            <button
              onClick={handleSendPaymentReminder}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Reminder
            </button>
            
            {isDriver && (
              <button
                onClick={handleMarkPaid}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? (
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
            )}
          </>
        )}
        
        {status === 'Pending Payment' && (
          <>
            <button
              onClick={handleSendPaymentReminder}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Reminder
            </button>
            
            {isDriver && (
              <button
                onClick={handleMarkPaid}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? (
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
            )}
          </>
        )}
        
        {status === 'Paid' && isDriver && (
          <button
            onClick={handleMarkPending}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Mark Pending'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default RiderPaymentStatus;