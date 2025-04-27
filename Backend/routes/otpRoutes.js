const express = require('express');
const otpRouter = express.Router();
const { sentOTP, verifyOTP } = require('../controllers/otpController');

// POST /api/auth/send-otp
otpRouter.post('/send-otp', sentOTP);

// PATCH /api/auth/verify-otp
otpRouter.patch('/verify-otp', verifyOTP);

module.exports = otpRouter;