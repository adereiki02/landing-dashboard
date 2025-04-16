const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Pilih URI database berdasarkan environment
    const mongoUri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGO_URI_PROD 
      : process.env.MONGO_URI_DEV;
    
    // Log informasi koneksi database yang digunakan
    console.log(`Using ${process.env.NODE_ENV} database`);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;