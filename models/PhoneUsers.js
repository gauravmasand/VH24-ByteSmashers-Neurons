const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  ipAddress: { type: String },
  location: {
    city: String,
    state: String,
    country: String
  },
  signupDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhoneUser', UserSchema);