"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAuth = exports.verifyEmail = exports.logout = exports.getMe = exports.login = exports.resendOTP = exports.verifyEmailWithOTP = exports.register = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const auth_utils_1 = require("../utils/auth.utils");
const otp_utils_1 = require("../utils/otp.utils");
const crypto_1 = __importDefault(require("crypto"));
const firebase_admin_service_1 = require("../services/firebase-admin.service");
const register = async (req, res) => {
    try {
        const { name, email, password, phone, gender, year, branch } = req.body;
        if (!name || !email || !password || !phone) {
            res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, and phone'
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
            return;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number'
            });
            return;
        }
        const existingUser = await User_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
            return;
        }
        const hashedPassword = await (0, auth_utils_1.hashPassword)(password);
        const userData = {
            name,
            email,
            password: hashedPassword,
            phone,
            isEmailVerified: true,
        };
        if (phone && phone.trim() !== '' && phone.trim() !== 'N/A') {
            userData.phone = phone.trim();
        }
        if (gender)
            userData.gender = gender;
        if (year)
            userData.year = year;
        if (branch)
            userData.branch = branch;
        const user = await User_model_1.default.create(userData);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    }
    catch (err) {
        console.error('Registration error:', err);
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            res.status(400).json({
                success: false,
                message: `A user with this ${field} already exists`
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.register = register;
const verifyEmailWithOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
            return;
        }
        const user = await User_model_1.default.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
            return;
        }
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    }
    catch (err) {
        console.error('Email verification error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.verifyEmailWithOTP = verifyEmailWithOTP;
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }
        const user = await User_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        if (user.isEmailVerified) {
            res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
            return;
        }
        const otp = (0, otp_utils_1.generateOTP)();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        try {
            await (0, otp_utils_1.sendEmailVerificationOTP)(user, otp);
            res.status(200).json({
                success: true,
                message: 'OTP resent successfully. Please check your email.'
            });
        }
        catch (emailError) {
            console.error('OTP resending failed:', emailError);
            res.status(500).json({
                success: false,
                message: 'Failed to resend OTP. Please try again later.'
            });
        }
    }
    catch (err) {
        console.error('OTP resend error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.resendOTP = resendOTP;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide an email and password'
            });
            return;
        }
        const user = await User_model_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        const isMatch = await (0, auth_utils_1.comparePassword)(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        (0, auth_utils_1.sendTokenResponse)(user, 200, res);
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_model_1.default.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (err) {
        console.error('Get me error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.getMe = getMe;
const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: {}
    });
};
exports.logout = logout;
const verifyEmail = async (req, res) => {
    try {
        const { token, userId, oobCode, mode, continueUrl } = req.query;
        if (oobCode && mode === 'verifyEmail') {
            if (continueUrl && typeof continueUrl === 'string') {
                try {
                    const url = new URL(continueUrl);
                    const searchParams = new URLSearchParams(url.search);
                    const tokenParam = searchParams.get('token');
                    const userIdParam = searchParams.get('userId');
                    if (tokenParam && userIdParam) {
                        const user = await User_model_1.default.findOne({
                            _id: userIdParam,
                            emailVerificationToken: tokenParam,
                            emailVerificationExpires: { $gt: Date.now() }
                        });
                        if (!user) {
                            res.status(400).json({
                                success: false,
                                message: 'Invalid or expired verification token'
                            });
                            return;
                        }
                        user.isEmailVerified = true;
                        user.emailVerificationToken = undefined;
                        user.emailVerificationExpires = undefined;
                        await user.save();
                        res.status(200).json({
                            success: true,
                            message: 'Email verified successfully'
                        });
                        return;
                    }
                }
                catch (urlError) {
                    console.error('Error parsing continueUrl:', urlError);
                }
            }
            res.status(200).json({
                success: true,
                message: 'Email verified successfully through Firebase'
            });
            return;
        }
        if (token && userId) {
            const user = await User_model_1.default.findOne({
                _id: userId,
                emailVerificationToken: token,
                emailVerificationExpires: { $gt: Date.now() }
            });
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid or expired verification token'
                });
                return;
            }
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();
            res.status(200).json({
                success: true,
                message: 'Email verified successfully'
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: 'Invalid verification link'
        });
    }
    catch (err) {
        console.error('Email verification error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
exports.verifyEmail = verifyEmail;
const firebaseAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        console.log('Firebase auth request received:', {
            hasIdToken: !!idToken,
            idTokenLength: idToken ? idToken.length : 0
        });
        if (!idToken) {
            res.status(400).json({
                success: false,
                message: 'ID token is required'
            });
            return;
        }
        console.log('Attempting to verify Firebase ID token...');
        const decodedToken = await (0, firebase_admin_service_1.verifyFirebaseIdToken)(idToken);
        console.log('Firebase token verified successfully:', {
            hasEmail: !!decodedToken.email,
            hasPhone: !!decodedToken.phone_number,
            email: decodedToken.email,
            phone: decodedToken.phone_number
        });
        let email;
        let name;
        let phone;
        if (decodedToken.email) {
            email = decodedToken.email;
        }
        else if (decodedToken.payload?.email) {
            email = decodedToken.payload.email;
        }
        else if (decodedToken.firebase?.identities?.email?.[0]) {
            email = decodedToken.firebase.identities.email[0];
        }
        if (decodedToken.name) {
            name = decodedToken.name;
        }
        else if (decodedToken.displayName) {
            name = decodedToken.displayName;
        }
        else if (decodedToken.payload?.name) {
            name = decodedToken.payload.name;
        }
        else if (decodedToken.payload?.displayName) {
            name = decodedToken.payload.displayName;
        }
        if (decodedToken.phone_number) {
            phone = decodedToken.phone_number;
        }
        console.log('Firebase token decoded - Email:', email, 'Phone:', phone);
        if (!email) {
            console.error('Invalid Firebase token - missing email. Decoded token structure:', JSON.stringify(decodedToken, null, 2));
            res.status(400).json({
                success: false,
                message: 'Invalid Firebase token: missing email'
            });
            return;
        }
        let user = await User_model_1.default.findOne({ email });
        if (!user) {
            const userName = name || email.split('@')[0] || 'Firebase User';
            const userData = {
                name: userName,
                email,
                password: await (0, auth_utils_1.hashPassword)(crypto_1.default.randomBytes(20).toString('hex')),
                isEmailVerified: true,
                emailVerificationToken: undefined,
                emailVerificationExpires: undefined
            };
            console.log('Creating new user with data:', userData);
            console.log('Phone value:', phone, 'Phone type:', typeof phone);
            if (phone && phone.trim() !== '' && phone.trim() !== 'N/A') {
                userData.phone = phone.trim();
                console.log('Adding phone to user data:', phone.trim());
            }
            else {
                console.log('Not adding phone to user data - phone is null/empty');
            }
            user = await User_model_1.default.create(userData);
            console.log('User created successfully:', user.email);
        }
        else if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();
            console.log('Existing user updated as verified:', user.email);
        }
        console.log('Sending successful auth response for:', user.email);
        (0, auth_utils_1.sendTokenResponse)(user, 200, res);
    }
    catch (err) {
        console.error('Firebase auth error:', err);
        console.error('Error stack:', err.stack);
        res.status(401).json({
            success: false,
            message: 'Firebase authentication failed: ' + (err.message || 'Unknown error')
        });
    }
};
exports.firebaseAuth = firebaseAuth;
//# sourceMappingURL=auth.controller.js.map