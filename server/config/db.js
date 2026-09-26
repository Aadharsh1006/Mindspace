require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const ChatThread = require('../models/ChatThread');
const Assessment = require('../models/Assessment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skcet_mental_health';

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[+] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    await seedInitialData();
  } catch (err) {
    isConnected = false;
    console.warn(`[!] MongoDB connection warning: ${err.message}`);
    console.warn(`[!] Operating in dual mode (MongoDB ready once service starts).`);
  }
};

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        id: 'USER_ADMIN',
        name: 'System Administrator',
        email: 'admin@mindspace.org',
        password: 'admin123',
        role: 'admin',
        age: 35,
        gender: 'Other'
      });
      console.log('[+] Seeded Admin user into MongoDB.');
    }
  } catch (err) {
    console.error('[-] MongoDB Seeding error:', err.message);
  }
};

module.exports = { connectDB, isConnected: () => isConnected };
