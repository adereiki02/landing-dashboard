/**
 * Script untuk menyinkronkan data langsung dari database lokal ke database produksi
 * Menggunakan pendekatan yang lebih sederhana dan langsung
 */

const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Fungsi untuk mendaftarkan semua model
function registerAllModels() {
  const modelsDir = path.join(__dirname, '../models');
  
  // Baca semua file di direktori models
  const files = fs.readdirSync(modelsDir);
  
  // Filter hanya file JavaScript dan bukan index.js atau userModel.js
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
      require(modelPath);
      console.log(`- Registered model from ${file}`);
    } catch (error) {
      console.error(`Error loading model ${file}:`, error.message);
    }
  }
  
  // Dapatkan semua model yang terdaftar
  const registeredModels = mongoose.modelNames();
  console.log(`Total registered models: ${registeredModels.length}`);
  return registeredModels;
}

// Fungsi untuk menghubungkan ke database
async function connectToDatabase(uri, name) {
  try {
    // Pastikan koneksi sebelumnya sudah terputus
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing existing connection...');
      await mongoose.disconnect();
    }
    
    // Tambahkan opsi koneksi yang lebih robust
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 detik timeout untuk pemilihan server
      socketTimeoutMS: 75000, // 75 detik timeout untuk socket
      connectTimeoutMS: 30000, // 30 detik timeout untuk koneksi
      keepAlive: true,
      keepAliveInitialDelay: 300000, // 5 menit
      maxPoolSize: 10, // Maksimum 10 koneksi dalam pool
      minPoolSize: 5 // Minimum 5 koneksi dalam pool
    });
    
    // Verifikasi koneksi berhasil
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Connection not established, current state: ${mongoose.connection.readyState}`);
    }
    
    console.log(`Connected to ${name} database: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    console.error(`Error connecting to ${name} database:`, error.message);
    throw error; // Lempar error daripada exit process agar bisa ditangani
  }
}

// Fungsi untuk mendapatkan semua data dari model
async function getAllData(modelName) {
  try {
    // Verifikasi koneksi sebelum operasi database
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Database connection is not open (state: ${mongoose.connection.readyState})`);
    }
    
    // Dapatkan model dari mongoose
    const Model = mongoose.model(modelName);
    
    // Ambil semua data dengan exec() untuk memastikan promise
    const data = await Model.find({}).lean().exec();
    console.log(`Retrieved ${data.length} documents from ${modelName}`);
    
    return data;
  } catch (error) {
    console.error(`Error retrieving data from ${modelName}:`, error.message);
    return [];
  }
}

// Fungsi untuk menyimpan data ke model
async function saveData(modelName, data) {
  try {
    // Dapatkan model dari mongoose
    const Model = mongoose.model(modelName);
    
    // Verifikasi koneksi sebelum operasi database
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Database connection is not open (state: ${mongoose.connection.readyState})`);
    }
    
    // Simpan setiap dokumen
    let created = 0;
    let updated = 0;
    let errors = 0;
    
    for (const doc of data) {
      try {
        // Hapus properti yang mungkin menyebabkan masalah
        const cleanDoc = { ...doc };
        
        // Cek apakah dokumen sudah ada
        const existingDoc = await Model.findById(doc._id).exec();
        
        if (existingDoc) {
          // Update dokumen yang ada
          await Model.findByIdAndUpdate(doc._id, cleanDoc, { new: true }).exec();
          updated++;
        } else {
          // Buat dokumen baru dengan ID yang sama
          await Model.create(cleanDoc);
          created++;
        }
      } catch (docError) {
        console.error(`Error processing document in ${modelName}: ${docError.message}`);
        errors++;
      }
    }
    
    console.log(`${modelName}: Created ${created} documents, Updated ${updated} documents, Errors: ${errors}`);
  } catch (error) {
    console.error(`Error saving data to ${modelName}:`, error.message);
  }
}

// Fungsi utama
async function main() {
  try {
    console.log('Starting database synchronization...');
    console.log('Source: Local database (Development)');
    console.log('Target: Production database');
    
    // 1. Hubungkan ke database lokal
    console.log('\nConnecting to local database...');
    await connectToDatabase(process.env.MONGO_URI_DEV, 'local');
    
    // 2. Daftarkan semua model
    console.log('\nRegistering models...');
    const models = registerAllModels();
    
    // 3. Ambil data dari semua model
    console.log('\nRetrieving data from local database...');
    const allData = {};
    
    for (const model of models) {
      try {
        // Coba dapatkan data dari model
        const data = await getAllData(model);
        allData[model] = data;
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError.message);
      }
    }
    
    // 4. Hubungkan ke database produksi
    console.log('\nConnecting to production database...');
    await connectToDatabase(process.env.MONGO_URI_PROD, 'production');
    
    // 5. Daftarkan model lagi untuk koneksi baru
    console.log('\nRe-registering models for production connection...');
    registerAllModels();
    
    // 6. Simpan data ke database produksi
    console.log('\nSaving data to production database...');
    for (const model of models) {
      if (allData[model] && allData[model].length > 0) {
        await saveData(model, allData[model]);
      } else {
        console.log(`No data to sync for ${model}`);
      }
    }
    
    console.log('\nDatabase synchronization completed!');
  } catch (error) {
    console.error('Synchronization error:', error.message);
  } finally {
    try {
      // Tutup koneksi
      console.log('Closing database connection...');
      await mongoose.disconnect();
      console.log('Database connection closed');
    } catch (err) {
      console.error('Error closing connection:', err.message);
    }
    process.exit(0);
  }
}

// Jalankan fungsi utama
main();