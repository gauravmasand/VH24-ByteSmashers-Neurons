const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  ip: {
    type: String
  },
  location: {
    country: String,
    state: String,
    city: String
  },
  signupDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isFingerprint: {
    type: Boolean,
    default: false
  },
  fingerprint: {
    type: String,
    default: null
  },
  otp: String,
  otpExpiry: Date,
  userdevice: {
    type: String,
    default: "mobile"
  },
  sessiontime: {
    type: String,
    default: "30"
  },
  status: {
    type: String,
    default: "Authorized"
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
