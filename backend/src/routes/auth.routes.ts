import express from 'express';
import { register, login, getMe, logout, verifyEmail, firebaseAuth } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/firebase', firebaseAuth);
router.get('/verify-email', verifyEmail);
router.get('/me', protect, getMe);
router.get('/logout', logout);

export default router;