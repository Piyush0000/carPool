import React, { useState } from 'react';
import type { Ride } from '../services/ride.service';
import RideService from '../services/ride.service';

interface DriverPaymentPanelProps {
  ride: Ride;
  onRideUpdate: () => void;
}

const DriverPaymentPanel: React.FC<DriverPaymentPanelProps> = ({ ride, onRideUpdate }) => {
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [uploadingQR, setUploadingQR] = useState(false);

  const handleUploadQRCode = async () => {
    if (!qrCodeFile) return;
    
    try {
      setUploadingQR(true);
      await RideService.uploadRideQRCode(ride._id, qrCodeFile);
      setUploadingQR(false);
      setQrCodeFile(null);
      onRideUpdate();
    } catch (error) {
      alert('Failed to upload QR code');
      setUploadingQR(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
      case 'Payment Verification Pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Verification Pending</span>;
      case 'Pending Payment':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Pending</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Calculate payment statistics
  const totalExpected = ride.pricePerSeat * ride.riders.filter(r => r.status === 'Accepted' || r.status === 'Paid' || r.status === 'Payment Verification Pending').length;
  const totalReceived = ride.pricePerSeat * ride.riders.filter(r => r.status === 'Paid').length;
  const pendingAmount = totalExpected - totalReceived;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Management</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage payments for this ride</p>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Payment Statistics */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Payment Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Expected:</span>
                <span className="text-sm font-medium">₹{totalExpected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Received:</span>
                <span className="text-sm font-medium text-green-600">₹{totalReceived}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending Amount:</span>
                <span className="text-sm font-medium text-yellow-600">₹{pendingAmount}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Completion:</span>
                  <span className="text-sm font-medium">
                    {totalExpected > 0 ? Math.round((totalReceived / totalExpected) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* UPI QR Code Management */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">UPI Payment Setup</h4>
            <div className="space-y-4">
              {/* QR Code Display/Upload */}
              {ride.qrCodeUrl ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={ride.qrCodeUrl} 
                    alt="UPI QR Code" 
                    className="w-32 h-32 object-contain mb-2"
                  />
                  <span className="text-sm text-green-600">QR Code uploaded</span>
                  <button
                    onClick={() => {
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = 'image/*';
                      fileInput.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files[0]) {
                          setQrCodeFile(files[0]);
                          // Auto-upload when file is selected
                          setTimeout(handleUploadQRCode, 100);
                        }
                      };
                      fileInput.click();
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-900 mt-1"
                  >
                    Change QR Code
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload QR Code</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setQrCodeFile(e.target.files[0]);
                              // Auto-upload when file is selected
                              setTimeout(handleUploadQRCode, 100);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              )}
              
              {/* Payment Instructions for Driver */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <h5 className="text-sm font-medium text-yellow-800 mb-1">Driver Instructions</h5>
                <ul className="text-xs text-yellow-700 list-disc pl-5 space-y-1">
                  <li>Upload a clear QR code image for UPI payments</li>
                  <li>Verify all payments in the table below</li>
                  <li>Respond to payment requests within 24 hours</li>
                  <li>Contact riders directly for payment issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rider Payment Status Table */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-900">Rider Payment Status</h4>
            <span className="text-sm text-gray-500">
              {ride.riders.filter(rider => rider.status === 'Accepted' || rider.status === 'Paid' || rider.status === 'Payment Verification Pending').length} riders
            </span>
          </div>
          <div className="overflow-x-auto">
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
                    Payment Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ride.riders.filter(rider => rider.status === 'Accepted' || rider.status === 'Paid' || rider.status === 'Payment Verification Pending').map((rider) => (
                  <tr key={rider.user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rider.user.name}</div>
                      <div className="text-sm text-gray-500">{rider.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{ride.pricePerSeat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(rider.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {rider.status === 'Payment Verification Pending' && (
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
                            Mark Paid
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
                            Mark Pending
                          </button>
                        </div>
                      )}
                      {rider.status === 'Paid' && (
                        <button
                          onClick={async () => {
                            try {
                              await RideService.rejectRiderPayment(ride._id, rider.user._id);
                              onRideUpdate();
                            } catch (error) {
                              alert('Failed to revert payment status');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Revert
                        </button>
                      )}
                      {rider.status === 'Accepted' && (
                        <span className="text-gray-500 text-sm">Waiting for payment</span>
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
  );
};

export default DriverPaymentPanel;