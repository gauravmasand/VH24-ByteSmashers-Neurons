const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Update fingerprint for authenticated user
router.post('/update-fingerprint', async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const { fingerprint } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find user and update fingerprint
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isFingerprint = true;
    user.fingerprint = fingerprint;
    await user.save();

    res.status(200).json({ message: 'Fingerprint updated successfully' });
  } catch (err) {
    console.error('Error updating fingerprint:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;