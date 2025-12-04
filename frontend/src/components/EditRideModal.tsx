import React, { useState } from 'react';
import type { Ride } from '../services/ride.service';
import RideService from '../services/ride.service';

interface EditRideModalProps {
  ride: Ride;
  onClose: () => void;
  onUpdate: (updatedRide: Ride) => void;
}

const EditRideModal: React.FC<EditRideModalProps> = ({ ride, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    pickup: ride.pickup,
    destination: ride.destination,
    date: ride.date.split('T')[0], // Extract date part only
    time: ride.time,
    seatsAvailable: ride.seatsAvailable,
    pricePerSeat: ride.pricePerSeat,
    carModel: ride.carModel || '',
    rules: ride.rules || '',
    status: ride.status
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedRide = await RideService.updateRide(ride._id, {
        pickup: formData.pickup,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        seatsAvailable: formData.seatsAvailable,
        pricePerSeat: formData.pricePerSeat,
        carModel: formData.carModel,
        rules: formData.rules,
        status: formData.status
      });
      
      onUpdate(updatedRide);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Ride</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Location */}
              <div className="md:col-span-2">
                <label htmlFor="pickup-address" className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickup-address"
                  id="pickup-address"
                  value={formData.pickup.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pickup: {
                      ...prev.pickup,
                      address: e.target.value
                    }
                  }))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Destination */}
              <div className="md:col-span-2">
                <label htmlFor="destination-address" className="block text-sm font-medium text-gray-700">
                  Destination
                </label>
                <input
                  type="text"
                  name="destination-address"
                  id="destination-address"
                  value={formData.destination.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    destination: {
                      ...prev.destination,
                      address: e.target.value
                    }
                  }))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Available Seats */}
              <div>
                <label htmlFor="seatsAvailable" className="block text-sm font-medium text-gray-700">
                  Available Seats
                </label>
                <input
                  type="number"
                  name="seatsAvailable"
                  id="seatsAvailable"
                  min="1"
                  max="4"
                  value={formData.seatsAvailable}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Price Per Seat */}
              <div>
                <label htmlFor="pricePerSeat" className="block text-sm font-medium text-gray-700">
                  Price Per Seat (₹)
                </label>
                <input
                  type="number"
                  name="pricePerSeat"
                  id="pricePerSeat"
                  min="0"
                  step="1"
                  value={formData.pricePerSeat}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Car Model */}
              <div className="md:col-span-2">
                <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">
                  Car Model (Optional)
                </label>
                <input
                  type="text"
                  name="carModel"
                  id="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Rules */}
              <div className="md:col-span-2">
                <label htmlFor="rules" className="block text-sm font-medium text-gray-700">
                  Rules (Optional)
                </label>
                <textarea
                  name="rules"
                  id="rules"
                  rows={3}
                  value={formData.rules}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Status */}
              <div className="md:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Ride Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Ride'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRideModal;