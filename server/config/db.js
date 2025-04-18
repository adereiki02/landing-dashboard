const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    // Log database connection information
    console.log(`Connecting to ${config.nodeEnv} database`);
    console.log(`Database URI: ${config.mongoUri.substring(0, 20)}...`);
    
    const conn = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;