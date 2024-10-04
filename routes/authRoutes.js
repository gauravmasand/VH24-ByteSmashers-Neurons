const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerForOtp, requestOTP, verifyOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/register-for-otp', registerForOtp);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;