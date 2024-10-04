const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://jp0916780:1234%40Abcd@cluster0.qes6n.mongodb.net/authdb', {
      dbName: 'authdb'
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;