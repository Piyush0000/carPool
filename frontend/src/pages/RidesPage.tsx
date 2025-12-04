import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RideService from '../services/ride.service';
import type { Ride } from '../services/ride.service';
import RideList from '../components/RideList';
import RideCreator from '../components/RideCreator';
import ApiTestComponent from '../components/ApiTestComponent';

const RidesPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      setLoading(true);
      const fetchedRides = await RideService.getAllRides();
      setRides(fetchedRides);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRide = async () => {
    setShowCreateForm(false);
    await loadRides();
  };

  const handleRequestSeat = async (rideId: string) => {
    try {
      await RideService.requestSeat(rideId);
      // Reload rides to show updated status
      await loadRides();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to request seat');
    }
  };

  const handleRideSelect = (ride: Ride) => {
    navigate(`/rides/${ride._id}`);
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

  if (error && error.includes('Network Error')) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Unable to connect to the server. Please make sure the backend server is running.
                </p>
              </div>
            </div>
          </div>
          <ApiTestComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* API Connection Test */}
        <div className="mb-6">
          <ApiTestComponent />
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ride Sharing</h1>
              <p className="mt-2 text-gray-600">
                Find or create ride shares with fellow students
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showCreateForm ? (
                  <>
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Ride
                  </>
                )}
              </button>
            </div>
          </div>
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

        {showCreateForm && (
          <div className="mb-8">
            <RideCreator 
              onCreateRide={handleCreateRide}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Rides
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Browse rides offered by other students
          </p>
        </div>

        <RideList 
          rides={rides}
          onRideSelect={handleRideSelect}
          showRequestButton={true}
          onRequestSeat={handleRequestSeat}
        />
      </div>
    </div>
  );
};

export default RidesPage;