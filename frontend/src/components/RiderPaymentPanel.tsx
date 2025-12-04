import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Ride } from '../services/ride.service';
import RideService from '../services/ride.service';

interface RiderPaymentPanelProps {
  ride: Ride;
  currentUser: any;
  onRideUpdate: () => void;
}

const RiderPaymentPanel: React.FC<RiderPaymentPanelProps> = ({ ride, currentUser, onRideUpdate }) => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Find current rider in the ride
  const currentRider = ride.riders.find(rider => rider.user._id === currentUser.id);

  const handleMarkAsPaid = async () => {
    try {
      await RideService.riderMarkPaid(ride._id);
      setPaymentSuccess(true);
      onRideUpdate();
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 3000);
    } catch (error) {
      alert('Failed to mark payment as paid');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid (Verified)</span>;
      case 'Payment Verification Pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">In Verification</span>;
      case 'Pending Payment':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Payment Pending</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Get payment timeline steps based on current status
  const getPaymentTimelineSteps = (status: string) => {
    const steps = [
      { id: 1, title: 'Request Accepted', description: 'Driver accepts your ride request', status: 'completed' },
      { id: 2, title: 'Payment Required', description: 'Complete payment using UPI QR code', status: 'pending' },
      { id: 3, title: 'Payment Submitted', description: 'Click "I Have Paid" after payment', status: 'pending' },
      { id: 4, title: 'Verification Pending', description: 'Driver verifies your payment', status: 'pending' },
      { id: 5, title: 'Payment Verified', description: 'Access to ride group chat', status: 'pending' }
    ];

    // Update step statuses based on current payment status
    switch (status) {
      case 'Paid':
        steps[1].status = 'completed';
        steps[2].status = 'completed';
        steps[3].status = 'completed';
        steps[4].status = 'completed';
        break;
      case 'Payment Verification Pending':
        steps[1].status = 'completed';
        steps[2].status = 'completed';
        steps[3].status = 'completed';
        steps[4].status = 'current';
        break;
      case 'Pending Payment':
        steps[1].status = 'completed';
        steps[2].status = 'current';
        break;
      default:
        break;
    }

    return steps;
  };

  const getPaymentStatusMessage = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h4 className="text-md font-medium text-green-800">Payment Verified!</h4>
            </div>
            <p className="mt-1 text-sm text-green-700">
              Your payment has been verified by the driver. You are now part of the ride group and can chat with other participants.
            </p>
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <div>
                  <h5 className="text-sm font-medium text-blue-800">Group Chat Access</h5>
                  <p className="mt-1 text-sm text-blue-700">
                    You can now participate in the group chat. Click the button below to join the conversation with other ride participants.
                  </p>
                  <button
                    onClick={() => {
                      // Navigate to the group chat page
                      navigate(`/group-chat/${ride.chatRoomId}`);
                    }}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Join Group Chat
                    <svg className="ml-1 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-purple-50 rounded-md">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <div>
                  <h5 className="text-sm font-medium text-purple-800">Student's Own Car Pool Community</h5>
                  <p className="mt-1 text-sm text-purple-700">
                    You've been automatically added to our community group. Connect with other verified riders and share future rides.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        // Try to navigate to the Student's Own Car Pool group
                        // This would require fetching the group ID first
                        const response = await fetch('/api/group/mygroups');
                        const data = await response.json();
                        const studentPoolGroup = data.data.find((group: any) => group.groupName === "Student's Own Car Pool");
                        if (studentPoolGroup) {
                          navigate(`/group/${studentPoolGroup._id}`);
                        } else {
                          alert("You haven't been added to the Student's Own Car Pool group yet. This happens automatically after payment verification.");
                        }
                      } catch (error) {
                        console.error('Error navigating to community group:', error);
                        alert('Unable to access the community group at this time.');
                      }
                    }}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Visit Community Group
                    <svg className="ml-1 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Payment Verification Pending':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h4 className="text-md font-medium text-yellow-800">Payment Verification Pending</h4>
            </div>
            <p className="mt-1 text-sm text-yellow-700">
              Your payment is awaiting verification by the driver. Please be patient while they confirm your payment.
            </p>
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <h5 className="text-sm font-medium text-gray-800">What happens next?</h5>
              <ul className="mt-1 text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>The driver will verify your payment within 24 hours</li>
                <li>You'll receive a notification when verification is complete</li>
                <li>After verification, you'll gain access to the group chat</li>
              </ul>
            </div>
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <h5 className="text-sm font-medium text-blue-800">Estimated Verification Time</h5>
                  <p className="text-sm text-blue-700">
                    Typically within 24 hours. Drivers usually verify payments during business hours (9 AM - 6 PM).
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Pending Payment':
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h4 className="text-md font-medium text-red-800">Payment Required</h4>
            </div>
            <p className="mt-1 text-sm text-red-700">
              Please complete your payment using the QR code below to join this ride.
            </p>
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <h5 className="text-sm font-medium text-blue-800">Payment Deadline</h5>
                  <p className="text-sm text-blue-700">
                    Please complete your payment at least 2 hours before the ride departure time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-800">Payment Status: {status}</h4>
            <p className="mt-1 text-sm text-gray-700">
              Your payment status is {status.toLowerCase()}.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Complete your payment for this ride</p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Payment Timeline Visualization */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">Payment Progress</h4>
            <div className="flow-root">
              <ul className="relative border-l border-gray-200 ml-3">
                {getPaymentTimelineSteps(currentRider?.status || '').map((step) => (
                  <li key={step.id} className="mb-6 ml-6">
                    <div className={`absolute w-3 h-3 rounded-full -left-1.5 ${
                      step.status === 'completed' ? 'bg-green-500' : 
                      step.status === 'current' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></div>
                    <div className={`p-2 rounded-lg ${
                      step.status === 'completed' ? 'bg-green-50' : 
                      step.status === 'current' ? 'bg-yellow-50' : 'bg-white'
                    }`}>
                      <h5 className={`text-sm font-medium ${
                        step.status === 'completed' ? 'text-green-800' : 
                        step.status === 'current' ? 'text-yellow-800' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </h5>
                      <p className={`text-xs ${
                        step.status === 'completed' ? 'text-green-600' : 
                        step.status === 'current' ? 'text-yellow-600' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                      {step.status === 'current' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                          Current Step
                        </span>
                      )}
                      {step.status === 'completed' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Completed
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Payment Status Message */}
          {currentRider && getPaymentStatusMessage(currentRider.status)}
          
          {/* Other Passengers Confirmation Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-blue-900 mb-3">Ride Participants Status</h4>
            <div className="space-y-3">
              {/* Driver Status */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-indigo-800 font-bold text-xs">
                        {ride.driver.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{ride.driver.name} (Driver)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-700">Confirmed</span>
                </div>
              </div>
              
              {/* Other Riders Status */}
              {ride.riders.filter(rider => rider.status === 'Accepted' || rider.status === 'Paid' || rider.status === 'Payment Verification Pending').map((rider) => (
                rider.user._id !== currentUser.id && (
                  <div key={rider.user._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-gray-700 font-bold text-xs">
                            {rider.user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{rider.user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {rider.status === 'Paid' && (
                        <>
                          <svg className="h-4 w-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-green-700">Confirmed</span>
                        </>
                      )}
                      {rider.status === 'Payment Verification Pending' && (
                        <>
                          <svg className="h-4 w-4 text-yellow-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-yellow-700">Pending</span>
                        </>
                      )}
                      {rider.status === 'Accepted' && (
                        <>
                          <svg className="h-4 w-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-500">Awaiting Payment</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
            <div className="mt-3 p-3 bg-blue-100 rounded-md">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-700">
                  This shows the confirmation status of all participants in this ride. Once everyone's payment is verified, the ride is confirmed for all.
                </p>
              </div>
            </div>
          </div>
          
          {/* Payment Instructions */}
          {currentRider && currentRider.status === 'Pending Payment' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-blue-800 mb-2">Payment Instructions</h4>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-700">
                <li>Scan the QR code below using any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                <li>Enter the exact amount: ₹{ride.pricePerSeat}</li>
                <li>Make sure the recipient name matches the driver's name: {ride.driver.name}</li>
                <li>After completing the payment, click "I Have Paid" button</li>
                <li>Wait for the driver to verify your payment (usually within 24 hours)</li>
              </ol>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Do not click "I Have Paid" until you've actually completed the payment.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Driver and Payment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Payment Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Driver:</span>
                <span className="text-sm font-medium">{ride.driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-medium">₹{ride.pricePerSeat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Your Status:</span>
                <span className="text-sm font-medium">
                  {currentRider ? getStatusBadge(currentRider.status) : 'Not a participant'}
                </span>
              </div>
              {currentRider && currentRider.status === 'Payment Verification Pending' && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated Verification Time:</span>
                    <span className="text-sm font-medium text-yellow-600">Within 24 hours</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* UPI QR Code */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">UPI Payment</h4>
            {ride.qrCodeUrl ? (
              <div className="flex flex-col items-center">
                <img 
                  src={ride.qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-48 h-48 object-contain mb-4"
                />
                <p className="text-sm text-gray-600 text-center mb-4">
                  Scan this QR code with any UPI app to make your payment of ₹{ride.pricePerSeat}
                </p>
                
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={currentRider?.status !== 'Pending Payment'}
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Pay with UPI
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">QR Code Not Available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  The driver hasn't uploaded a UPI QR code yet. Please contact the driver.
                </p>
              </div>
            )}
          </div>
          
          {/* Group Chat Info */}
          {currentRider && currentRider.status === 'Paid' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <h4 className="text-md font-medium text-blue-800">Group Chat Ready!</h4>
              </div>
              <p className="mt-1 text-sm text-blue-700">
                You can now chat with other ride participants in the group chat. Click on the chat icon in the navigation bar to join the conversation.
              </p>
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Chat room ID: {ride.chatRoomId}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Success Message */}
      {paymentSuccess && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
          <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-fade-in-up">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    Payment Request Sent!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Waiting for driver to verify your payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Confirm Payment</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Have you completed the UPI payment of ₹{ride.pricePerSeat} to {ride.driver.name}?
                </p>
                <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                  <div className="flex">
                    <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-yellow-700 text-left">
                      Only click "I Have Paid" after you've actually completed the payment transaction.
                    </p>
                  </div>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleMarkAsPaid}
                  className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  I Have Paid
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="mt-3 px-4 py-2 bg-white text-gray-800 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderPaymentPanel;