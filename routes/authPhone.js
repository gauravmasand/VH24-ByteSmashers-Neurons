const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp } = require('../controllers/authPhoneController');

// Routes for phone signup
router.post('/signup/phone/request-otp', requestOtp);
router.post('/signup/phone/verify-otp', verifyOtp);

module.exports = router;