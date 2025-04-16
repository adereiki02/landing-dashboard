/**
 * Script untuk memeriksa data di database produksi
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
  console.log('Registered models:', registeredModels);
  return registeredModels;
}

// Fungsi untuk menghubungkan ke database
async function connectToDatabase(uri, name) {
  try {
    await mongoose.disconnect();
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`Connected to ${name} database: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    console.error(`Error connecting to ${name} database:`, error.message);
    process.exit(1);
  }
}

// Fungsi untuk memeriksa data di model
async function checkModelData(modelName) {
  try {
    // Dapatkan model dari mongoose
    const Model = mongoose.model(modelName);
    
    // Hitung jumlah dokumen
    const count = await Model.countDocuments();
    console.log(`${modelName}: ${count} documents`);
    
    // Jika ada dokumen, tampilkan beberapa contoh
    if (count > 0) {
      const samples = await Model.find().limit(2).lean();
      console.log(`  Sample document IDs: ${samples.map(doc => doc._id).join(', ')}`);
      
      // Tampilkan beberapa field dari dokumen pertama
      const firstDoc = samples[0];
      const fields = Object.keys(firstDoc).filter(key => key !== '_id' && key !== '__v');
      const sampleFields = fields.slice(0, 3); // Ambil 3 field pertama saja
      
      console.log('  Sample fields:');
      sampleFields.forEach(field => {
        const value = firstDoc[field];
        const displayValue = typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : value;
        console.log(`    - ${field}: ${displayValue}`);
      });
    }
    
    return count;
  } catch (error) {
    console.error(`Error checking data for ${modelName}:`, error.message);
    return 0;
  }
}

// Fungsi utama
async function main() {
  try {
    // 1. Hubungkan ke database produksi
    console.log('Connecting to production database...');
    await connectToDatabase(process.env.MONGO_URI_PROD, 'production');
    
    // 2. Daftarkan semua model
    console.log('\nRegistering models...');
    const models = registerAllModels();
    
    // 3. Periksa data di setiap model
    console.log('\nChecking data in production database:');
    let totalDocuments = 0;
    
    for (const model of models) {
      const count = await checkModelData(model);
      totalDocuments += count;
    }
    
    console.log(`\nTotal documents in production database: ${totalDocuments}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Tutup koneksi
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Jalankan fungsi utama
main();