const express = require('express');
const { verifyEmail } = require('../controllers/emailVerificationController');

const router = express.Router();

router.get('/verify-email', verifyEmail);

module.exports = router;