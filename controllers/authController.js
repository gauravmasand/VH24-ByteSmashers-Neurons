const User = require("../models/User");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");
const bcrypt = require("bcrypt");
const axios = require('axios');
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
