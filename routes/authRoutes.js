const express = require('express');
const { googleRegisterAndLogin, register, login, loginOTPVerify } = require('../controllers/authController');
const { registerForOtp, requestOTP, verifyOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/google-register', googleRegisterAndLogin);
router.post('/register', register);
router.post('/login', login);
router.post('/login-otp-verify', loginOTPVerify);

router.post('/register-for-otp', registerForOtp);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;