require('dotenv').config();
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('FATAL: MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exiting the process drops the serverless container causing 500s, so we just log it
  }
};

module.exports = connectDB;
