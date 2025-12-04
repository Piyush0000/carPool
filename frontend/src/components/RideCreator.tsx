import React, { useState } from 'react';
import RideService from '../services/ride.service';
import type { CreateRideData } from '../services/ride.service';
import MapInput from './MapInput';

interface RideCreatorProps {
  onCreateRide?: (ride: any) => void;
  onCancel?: () => void;
}

const RideCreator: React.FC<RideCreatorProps> = ({ onCreateRide, onCancel }) => {
  const [formData, setFormData] = useState({
    pickup: { address: '', coordinates: undefined as [number, number] | undefined },
    destination: { address: '', coordinates: undefined as [number, number] | undefined },
    date: '',
    time: '08:00',
    seatsAvailable: 3,
    pricePerSeat: 50,
    carModel: '',
    rules: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties like pickup.address
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentKey = parent as keyof typeof prev;
        return {
          ...prev,
          [parentKey]: {
            ...(prev[parentKey] as any),
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationSelect = (locationType: 'pickup' | 'destination', location: { address: string; coordinates: [number, number] }) => {
    setFormData(prev => ({
      ...prev,
      [locationType]: {
        address: location.address,
        coordinates: location.coordinates
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.pickup.address || !formData.destination.address) {
      setError('Please select both pickup and destination locations');
      return;
    }
    
    if (!formData.pickup.coordinates || !formData.destination.coordinates) {
      setError('Please select locations from the suggestions');
      return;
    }
    
    if (!formData.date) {
      setError('Please select a date');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const rideData: CreateRideData = {
        pickup: {
          address: formData.pickup.address,
          coordinates: formData.pickup.coordinates
        },
        destination: {
          address: formData.destination.address,
          coordinates: formData.destination.coordinates
        },
        date: formData.date,
        time: formData.time,
        seatsAvailable: formData.seatsAvailable,
        pricePerSeat: formData.pricePerSeat,
        carModel: formData.carModel,
        rules: formData.rules
      };
      
      const createdRide = await RideService.createRide(rideData);
      
      if (onCreateRide) {
        onCreateRide(createdRide);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Create New Ride Listing</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
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
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="pickup.address" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location *
            </label>
            <MapInput
              onLocationSelect={(location) => handleLocationSelect('pickup', location)}
              placeholder="Enter pickup location"
            />
          </div>
          
          <div>
            <label htmlFor="destination.address" className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <MapInput
              onLocationSelect={(location) => handleLocationSelect('destination', location)}
              placeholder="Enter destination"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="seatsAvailable" className="block text-sm font-medium text-gray-700 mb-1">
              Available Seats
            </label>
            <select
              id="seatsAvailable"
              name="seatsAvailable"
              value={formData.seatsAvailable}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="pricePerSeat" className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Seat (₹)
            </label>
            <input
              type="number"
              id="pricePerSeat"
              name="pricePerSeat"
              value={formData.pricePerSeat}
              onChange={handleChange}
              min="0"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">
            Car Model (Optional)
          </label>
          <input
            type="text"
            id="carModel"
            name="carModel"
            value={formData.carModel}
            onChange={handleChange}
            placeholder="e.g., Maruti Suzuki Swift"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="rules" className="block text-sm font-medium text-gray-700 mb-1">
            Rules (Optional)
          </label>
          <textarea
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            placeholder="e.g., No music, Luggage space, etc."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Ride Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RideCreator;