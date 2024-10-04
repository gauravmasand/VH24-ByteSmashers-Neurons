const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { sendOtpToPhone } = require('../utils/otpUtils');

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;
  try {
    let user = await User.findOne({ phone });
    // if (!user) {
    //   return res.status(400).json({ message: 'User not found' });
    // }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpEntry = new OTP({ phone, otp });

    await OTP.deleteMany({ phone }); // Remove previous OTPs for the phone number
    await otpEntry.save();

    sendOtpToPhone(phone, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }

};

exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ phone });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    await OTP.deleteMany({ phone }); // Clean up used OTP
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};