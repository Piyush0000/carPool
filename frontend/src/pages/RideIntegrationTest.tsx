import React, { useState, useEffect } from 'react';
import RideService from '../services/ride.service';
import RideCreator from '../components/RideCreator';
import RideList from '../components/RideList';
import DriverWallet from '../components/DriverWallet';
import DriverRating from '../components/DriverRating';
import UPIPaymentModal from '../components/UPIPaymentModal';

const RideIntegrationTest: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'create' | 'browse' | 'myRides' | 'wallet'>('create');
  const [rides, setRides] = useState<any[]>([]);
  const [myRides, setMyRides] = useState<{ asDriver: any[]; asRider: any[] }>({ asDriver: [], asRider: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRideForPayment, setSelectedRideForPayment] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all rides for browsing
      const allRides = await RideService.getAllRides();
      setRides(allRides);
      
      // Load user's rides
      const userRides = await RideService.getMyRides();
      setMyRides(userRides);
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRide = async () => {
    await loadData();
    setActiveSection('browse');
  };

  const handleRequestSeat = async (rideId: string) => {
    try {
      await RideService.requestSeat(rideId);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to request seat');
    }
  };

  const handleRideSelect = (ride: any) => {
    // For testing purposes, we'll just show an alert with ride details
    alert(`Selected ride: ${ride.pickup.address} to ${ride.destination.address}`);
  };

  const handlePaymentClick = (ride: any) => {
    setSelectedRideForPayment(ride);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setSelectedRideForPayment(null);
    await loadData(); // Refresh data to show updated payment status
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ride Sharing Integration Test</h1>
          <p className="mt-2 text-gray-600">
            Testing all components of the ultra-simple student ride-share feature
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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

        {/* Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap space-x-8">
              <button
                onClick={() => setActiveSection('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'create'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create Ride
              </button>
              <button
                onClick={() => setActiveSection('browse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'browse'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Browse Rides
              </button>
              <button
                onClick={() => setActiveSection('myRides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'myRides'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Rides
              </button>
              <button
                onClick={() => setActiveSection('wallet')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'wallet'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Driver Wallet
              </button>
            </nav>
          </div>
        </div>

        {/* Sections */}
        {activeSection === 'create' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Ride</h2>
              <p className="mt-1 text-sm text-gray-600">
                Test the ride creation form with simplified inputs
              </p>
            </div>
            
            <RideCreator 
              onCreateRide={handleCreateRide}
              onCancel={() => setActiveSection('browse')}
            />
          </div>
        )}

        {activeSection === 'browse' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Available Rides</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Test browsing and requesting seats in rides
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setActiveSection('create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Ride
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <RideList 
                rides={rides}
                onRideSelect={handleRideSelect}
                showRequestButton={true}
                onRequestSeat={handleRequestSeat}
              />
            )}
          </div>
        )}

        {activeSection === 'myRides' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Rides</h2>
              <p className="mt-1 text-sm text-gray-600">
                Test driver rating and payment functionality
              </p>
            </div>
            
            {/* Driver Rating Section */}
            <div className="mb-8">
              <DriverRating 
                rating={4.5} 
                totalRides={12} 
                isVerified={true} 
              />
            </div>
            
            {/* Payment Test Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  // For demo purposes, use the first ride if available
                  if (myRides.asRider.length > 0) {
                    handlePaymentClick(myRides.asRider[0]);
                  } else if (myRides.asDriver.length > 0) {
                    handlePaymentClick(myRides.asDriver[0]);
                  } else {
                    alert('No rides available for payment testing. Create or join a ride first.');
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test UPI Payment
              </button>
            </div>
            
            {/* As Driver */}
            {myRides.asDriver.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rides I'm Driving</h3>
                <RideList 
                  rides={myRides.asDriver}
                  onRideSelect={handleRideSelect}
                />
              </div>
            )}
            
            {/* As Rider */}
            {myRides.asRider.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rides I'm Riding In</h3>
                <RideList 
                  rides={myRides.asRider}
                  onRideSelect={handleRideSelect}
                />
              </div>
            )}
            
            {myRides.asDriver.length === 0 && myRides.asRider.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No rides yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating or joining a ride.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setActiveSection('create')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Ride
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'wallet' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Driver Wallet</h2>
              <p className="mt-1 text-sm text-gray-600">
                Test earnings tracking and payment status management
              </p>
            </div>
            
            <DriverWallet />
          </div>
        )}

        {/* UPI Payment Modal */}
        <UPIPaymentModal
          rideId={selectedRideForPayment?._id || ''}
          amount={selectedRideForPayment?.pricePerSeat || 0}
          recipient={selectedRideForPayment?.driver?.name || 'Driver'}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedRideForPayment(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default RideIntegrationTest;