const User = require("../models/User");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");
const bcrypt = require("bcrypt");
const axios = require("axios");
const crypto = require("crypto");
const OTP = require("../models/OTP");
const { sendOtpToEmail } = require("../utils/otpUtils");
const nodemailer = require("nodemailer");
const refreshTokens = new Map();
const rateLimitMap = new Map();

const { sendVerificationEmail } = require("../utils/emailUtils");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {

    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    console.log("Step 1: Checking if the user already exists...");
    let user = await User.findOne({ email });

    if (user) {
      console.log("Step 2: User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Step 3: Creating new user...");
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip) || {};
    const location = {
      country: geo.country || "Unknown",
      state: geo.region || "Unknown",
      city: geo.city || "Unknown",
    };

    user = new User({
      name,
      email,
      password,
      ip,
      location,
    });
    await user.save();

    console.log("Step 4: Sending verification email...");
    await sendVerificationEmail(email, user.id);

    console.log("Step 5: Registration successful");
    res.status(201).json({
      message:
        "User registered successfully, please check your email to verify your account",
    });
  } catch (err) {
    console.error("Error occurred during registration:", err);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const maxAttempts = 5;
  const lockoutTime = 60 * 60 * 1000; // 1 hour

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is locked out
    const userAttempts = rateLimitMap.get(email) || { attempts: 0, lockUntil: null };
    if (userAttempts.lockUntil && userAttempts.lockUntil > Date.now()) {
      return res.status(403).json({ message: "Too many login attempts. Please try again after 1 hour." });
    }

    // Check if the email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      userAttempts.attempts += 1;
      if (userAttempts.attempts >= maxAttempts) {
        userAttempts.lockUntil = Date.now() + lockoutTime;
        userAttempts.attempts = 0;
      }
      rateLimitMap.set(email, userAttempts);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Reset attempts after successful login
    rateLimitMap.delete(email);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Store OTP and expiry in the user's record
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Replace with your hosting provider's SMTP host
      port: 465, // Commonly used port for SMTP
      secure: true, // Use true if using port 465, false otherwise
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Enable debugging to identify email send issues
      logger: true, // Log the communication with the server
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Use EMAIL_USER instead of EMAIL
      to: user.email,
      subject: "Your OTP for Login Verification",
      text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("OTP email sent successfully to:", user.email);
      res.status(200).json({ message: "OTP has been sent to your email address." });
    } catch (err) {
      console.error("Error sending OTP email:", err);
      res.status(500).json({ message: "Error sending OTP email." });
    }
  } catch (err) {
    console.error("Error during login process:", err);
    res.status(500).send("Server Error");
  }
};

exports.loginOTPVerify = async (req, res) => {
  const { email, otp } = req.body;
  try {

    if (!email || !otp) {
      return res.status(400).json({ message: "All fields is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if OTP is valid
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, clear OTP fields and generate a JWT
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token after OTP verification
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Generate Refresh Token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    refreshTokens.set(refreshToken, user.id);

    res.json({
      token,
      refreshToken,
      expiresIn: 3600, // Token expiry time in seconds
      userId: user.id,
    });
  } catch (err) {
    console.error("Error during OTP verification process: ", err); // Log detailed error to console for debugging
    res.status(500).send("Server Error");
  }
};

exports.googleRegisterAndLogin = async (req, res) => {
  const { name, email, password } = req.body;

  try {

    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    console.log("Step 1: Checking if the user already exists...");
    let user = await User.findOne({ email });

    if (user) {
      console.log("Step 2: User already exists, logging in user...");
      // Generate a token for the user
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: "Login successful", token });
    }

    console.log("Step 3: Creating new user...");
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip) || {};
    const location = {
      country: geo.country || "Unknown",
      state: geo.region || "Unknown",
      city: geo.city || "Unknown",
    };

    user = new User({
      name,
      email,
      password,
      ip,
      location,
      isVerified: true // Set isVerified to true by default
    });
    await user.save();

    console.log("Step 4: Sending verification email...");
    await sendVerificationEmail(email, user.id);

    console.log("Step 5: Registration successful");
    // Generate a token for the new user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      message: "User registered successfully, please check your email to verify your account",
      token
    });
  } catch (err) {
    console.error("Error occurred during registration:", err);
    res.status(500).send("Server Error");
  }
};

//// Email OTP login

// User Registration
exports.registerForOtp = async (req, res) => {
  const { name, email, password, phone, ip, location } = req.body;
  try {

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ name, email, password, phone, ip, location });
    await user.save();

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpEntry = new OTP({ email, otp });

    await OTP.deleteMany({ email }); // Remove previous OTPs for the email
    await otpEntry.save();

    await sendOtpToEmail(email, otp); // Updated to actually send an email
    res.status(200).json({
      message: "User registered successfully and OTP sent successfully",
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Request OTP for Login
exports.requestOTP = async (req, res) => {
  const { email } = req.body;
  try {

    if (!email) {
      return res.status(400).json({ message: "All fields is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpEntry = new OTP({ email, otp });

    await OTP.deleteMany({ email }); // Remove previous OTPs for the email
    await otpEntry.save();

    await sendOtpToEmail(email, otp); // Updated to actually send an email
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Verify OTP for Login
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {

    if (!email || !otp) {
      return res.status(400).json({ message: "All fields is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email });
    user.isVerified = true; // Update user verification status
    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await OTP.deleteMany({ email }); // Clean up used OTP
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};