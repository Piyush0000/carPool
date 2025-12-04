import express from 'express';
import {
  createRide,
  getAllRides,
  getRide,
  getMyRides,
  requestSeat,
  updateRiderStatus,
  updatePaymentStatus,
  riderMarkPaid,
  getPaymentDetails,
  closeRide,
  verifyRiderPayment,
  rejectRiderPayment,
  uploadRideQRCode,
  updateRide
} from '../controllers/ride.controller';
import { protect } from '../middleware/auth.middleware';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, '../uploads/')
  },
  filename: function (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
  }
})

const upload = multer({ storage: storage })

const router = express.Router();

// All routes are protected
router.use(protect);

// Ride creation and listing
router.route('/create').post(createRide);
router.route('/').get(getAllRides);
router.route('/my-rides').get(getMyRides);
router.route('/:id').get(getRide).put(updateRide);

// Seat requests
router.route('/:id/request-seat').post(requestSeat);

// Rider status updates (driver only)
router.route('/:id/rider/:riderId').patch(updateRiderStatus);

// Payment status updates
router.route('/:id/rider/:riderId/payment').patch(updatePaymentStatus);
router.route('/:id/mark-paid').patch(riderMarkPaid);
router.route('/:id/payment-details').get(getPaymentDetails);

// Payment verification (driver only)
router.route('/:id/rider/:riderId/verify-payment').patch(verifyRiderPayment);
router.route('/:id/rider/:riderId/reject-payment').patch(rejectRiderPayment);

// UPI QR code management (driver only)
router.route('/:id/upload-qr').post(upload.single('qrCode'), uploadRideQRCode);

// Close ride (driver only)
router.route('/:id/close').patch(closeRide);

export default router;