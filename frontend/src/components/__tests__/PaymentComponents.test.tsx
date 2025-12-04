import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DriverPaymentPanel from '../DriverPaymentPanel';
import RiderPaymentPanel from '../RiderPaymentPanel';
import AdminPaymentDashboard from '../AdminPaymentDashboard';

// Simple export test for payment components
import DriverPaymentPanel from '../DriverPaymentPanel';
import RiderPaymentPanel from '../RiderPaymentPanel';
import AdminPaymentDashboard from '../AdminPaymentDashboard';

// Export components to verify they can be imported
export { DriverPaymentPanel, RiderPaymentPanel, AdminPaymentDashboard };

// Simple type checking
const testComponents = () => {
  return {
    DriverPaymentPanel,
    RiderPaymentPanel,
    AdminPaymentDashboard
  };
};

export default testComponents;

// Mock the RideService
jest.mock('../../services/ride.service', () => ({
  __esModule: true,
  default: {
    uploadRideQRCode: jest.fn(),
    updateDriverUpiId: jest.fn(),
    verifyRiderPayment: jest.fn(),
    rejectRiderPayment: jest.fn(),
    updatePaymentStatus: jest.fn(),
    riderMarkPaid: jest.fn()
  }
}));

describe('Payment Components', () => {
  const mockRide = {
    _id: '1',
    driver: {
      _id: 'driver1',
      name: 'John Driver',
      email: 'john@example.com',
      phone: '1234567890'
    },
    pickup: {
      address: 'Pickup Location'
    },
    destination: {
      address: 'Destination Location'
    },
    date: '2023-01-01',
    time: '10:00',
    seatsAvailable: 4,
    pricePerSeat: 50,
    status: 'Open',
    riders: [
      {
        user: {
          _id: 'rider1',
          name: 'Jane Rider',
          email: 'jane@example.com',
          phone: '0987654321'
        },
        status: 'Accepted',
        requestedAt: '2023-01-01T00:00:00.000Z'
      }
    ],
    chatRoomId: 'chat1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  test('renders DriverPaymentPanel component', () => {
    render(
      <DriverPaymentPanel 
        ride={mockRide} 
        onRideUpdate={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Payment Management')).toBeInTheDocument();
    expect(screen.getByText('Payment Statistics')).toBeInTheDocument();
    expect(screen.getByText('UPI ID')).toBeInTheDocument();
    expect(screen.getByText('UPI QR Code')).toBeInTheDocument();
  });

  test('renders RiderPaymentPanel component', () => {
    render(
      <RiderPaymentPanel 
        ride={mockRide} 
        currentUser={{ id: 'rider1' }} 
        onRideUpdate={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Payment Details')).toBeInTheDocument();
    expect(screen.getByText('Driver Information')).toBeInTheDocument();
    expect(screen.getByText('Payment Status')).toBeInTheDocument();
    expect(screen.getByText('UPI Payment')).toBeInTheDocument();
  });

  test('renders AdminPaymentDashboard component', () => {
    render(
      <AdminPaymentDashboard 
        rides={[mockRide]} 
        onRideUpdate={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Admin Payment Dashboard')).toBeInTheDocument();
    expect(screen.getByText('All Rides')).toBeInTheDocument();
  });
});