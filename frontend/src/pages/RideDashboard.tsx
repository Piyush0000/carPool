import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RideService from '../services/ride.service';
import RideList from '../components/RideList';
import DriverWallet from '../components/DriverWallet';
import DriverRating from '../components/DriverRating';

const RideDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'myRides' | 'wallet'>('browse');
  const [rides, setRides] = useState<any[]>([]);
  const [myRides, setMyRides] = useState<{ asDriver: any[]; asRider: any[] }>({ asDriver: [], asRider: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSeat = async (rideId: string) => {
    try {
      await RideService.requestSeat(rideId);
      // Reload data to show updated status
      await loadDashboardData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to request seat');
    }
  };

  const handleRideSelect = (ride: any) => {
    navigate(`/rides/${ride._id}`);
  };

  // Calculate driver stats
  const totalRidesAsDriver = myRides.asDriver.length;
  const averageRating = totalRidesAsDriver > 0 ? 4.5 : 0; // Mock rating for demo

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ride Sharing Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Share rides, save money, and connect with fellow students
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

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'browse'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Browse Rides
              </button>
              <button
                onClick={() => setActiveTab('myRides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'myRides'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Rides
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'wallet'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Driver Wallet
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Available Rides</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Find rides offered by other students
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => navigate('/rides')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Ride
                </button>
              </div>
            </div>
            
            <RideList 
              rides={rides}
              onRideSelect={handleRideSelect}
              showRequestButton={true}
              onRequestSeat={handleRequestSeat}
            />
          </div>
        )}

        {activeTab === 'myRides' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Rides</h2>
              <p className="mt-1 text-sm text-gray-600">
                Rides you've created or joined
              </p>
            </div>
            
            {/* Driver Rating Section */}
            <div className="mb-8">
              <DriverRating 
                rating={averageRating} 
                totalRides={totalRidesAsDriver} 
                isVerified={true} 
              />
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
                    onClick={() => navigate('/rides')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create or Find Ride
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Driver Wallet</h2>
              <p className="mt-1 text-sm text-gray-600">
                Track your earnings as a driver
              </p>
            </div>
            
            <DriverWallet />
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDashboard;