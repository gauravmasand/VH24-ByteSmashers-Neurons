const User = require("../models/User");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");
const bcrypt = require("bcrypt");
const axios = require('axios');
const OTP = require('../models/OTP');
const { sendOtpToEmail } = require('../utils/otpUtils');

const { sendVerificationEmail } = require('../utils/emailUtils');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('Step 1: Checking if the user already exists...');
    let user = await User.findOne({ email });

    if (user) {
      console.log('Step 2: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Step 3: Creating new user...');
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip) || {};
    const location = {
      country: geo.country || 'Unknown',
      state: geo.region || 'Unknown',
      city: geo.city || 'Unknown'
    };

    user = new User({
      name,
      email,
      password,
      ip,
      location
    });
    await user.save();

    console.log('Step 4: Sending verification email...');
    sendVerificationEmail(email, user.id);

    console.log('Step 5: Registration successful');
    res.status(201).json({ message: 'User registered successfully, please check your email to verify your account' });
  } catch (err) {
    console.error('Error occurred during registration:', err);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Check if the email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};


//// Email OTP login

// User Registration
exports.registerForOtp = async (req, res) => {
  const { name, email, password, phone, ip, location } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password, phone, ip, location });
    await user.save();

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpEntry = new OTP({ email, otp });

    await OTP.deleteMany({ email }); // Remove previous OTPs for the email
    await otpEntry.save();

    await sendOtpToEmail(email, otp); // Updated to actually send an email
    res.status(200).json({ message: 'User registered successfully and OTP sent successfully' });

  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Request OTP for Login
exports.requestOTP = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpEntry = new OTP({ email, otp });

    await OTP.deleteMany({ email }); // Remove previous OTPs for the email
    await otpEntry.save();

    await sendOtpToEmail(email, otp); // Updated to actually send an email
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Verify OTP for Login
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email });
    user.isVerified = true; // Update user verification status
    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    await OTP.deleteMany({ email }); // Clean up used OTP
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};