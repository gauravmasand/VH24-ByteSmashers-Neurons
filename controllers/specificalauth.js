const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Update this with the correct path to the User model

// Secret key for token generation (You should store this in environment variables in a real application)
const SECRET_KEY = 'your_secret_key_here';

// Function to generate token based on auth type
const generateAuthToken = (authType, userId) => {
    const payload = {
      id: userId,
      authType: authType,
      timestamp: Date.now()
    };
  
    // Generate JWT token
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
  };
  
  // Function to handle faceauth
  const faceAuth = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
  
      // Check if faceauth is enabled
      if (user.faceauth) {
        const token = generateAuthToken('faceauth', user._id);
        user.specialtoken = token;
        await user.save();
        return token;
      } else {
        throw new Error('Face authentication is not enabled for this user');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Function to handle fingerauth
  const fingerAuth = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
  
      // Check if fingerauth is enabled
      if (user.fingerauth) {
        const token = generateAuthToken('fingerauth', user._id);
        user.specialtoken = token;
        await user.save();
        return token;
      } else {
        throw new Error('Finger authentication is not enabled for this user');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Exporting the functions
  module.exports = {
    faceAuth,
    fingerAuth
  };