/**
 * Script untuk mendaftarkan semua model mongoose
 * Ini memastikan bahwa semua model terdaftar sebelum digunakan
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Fungsi untuk mendaftarkan semua model
function registerAllModels() {
  const modelsDir = path.join(__dirname, '../models');
  
  // Baca semua file di direktori models
  const files = fs.readdirSync(modelsDir);
  
  // Filter hanya file JavaScript dan bukan index.js
  const modelFiles = files.filter(file => 
    file.endsWith('.js') && 
    file !== 'index.js' &&
    file !== 'userModel.js' // Skip alias files
  );
  
  console.log('Registering models:');
  
  // Impor setiap file model
  for (const file of modelFiles) {
    try {
      const modelPath = path.join(modelsDir, file);
      const model = require(modelPath);
      
      // Cek apakah ini adalah model mongoose
      if (model.modelName && model.schema) {
        console.log(`- ${model.modelName} (${file})`);
      } else {
        console.log(`- ${file} (not a mongoose model)`);
      }
    } catch (error) {
      console.error(`Error loading model ${file}:`, error.message);
    }
  }
  
  // Dapatkan semua model yang terdaftar
  const registeredModels = mongoose.modelNames();
  console.log('\nRegistered models:', registeredModels);
}

module.exports = registerAllModels;

// Jika dijalankan langsung
if (require.main === module) {
  // Impor dotenv untuk variabel lingkungan
  require('dotenv').config();
  
  // Hubungkan ke database
  mongoose.connect(process.env.MONGO_URI_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database');
    registerAllModels();
    
    // Tutup koneksi setelah selesai
    setTimeout(() => {
      mongoose.disconnect()
        .then(() => console.log('Database connection closed'))
        .catch(err => console.error('Error closing connection:', err))
        .finally(() => process.exit(0));
    }, 1000);
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
}