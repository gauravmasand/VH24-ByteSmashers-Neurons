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
<<<<<<< HEAD
  isFingerprint: {
    type: Boolean,
    default: false
  },
  fingerprint: {
    type: String,
    default: null
=======
  faceauth: {
    type: Boolean,
    default: false
  },
  fingerauth: {
    type: Boolean,
    default: false
  },
  facetoken: {
    type: String,
    default: ''
  },
  fingertoken: {
    type: String,
    default: ''
>>>>>>> bbe3636b4eb56589af91daf762137da683140ba9
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

<<<<<<< HEAD
module.exports = mongoose.model('User', UserSchema);
=======
module.exports = mongoose.model('User', UserSchema);
>>>>>>> bbe3636b4eb56589af91daf762137da683140ba9
