const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Fungsi untuk menghubungkan ke database
async function connectToDatabase(uri) {
  try {
    // Ensure any previous connection is closed
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      console.log('Closing existing connection before creating a new one');
      await mongoose.connection.close();
    }
    
    const conn = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
      socketTimeoutMS: 60000, // Increased timeout to 60s
      connectTimeoutMS: 30000, // Added explicit connect timeout
      keepAlive: true,
      keepAliveInitialDelay: 300000 // 5 minutes
    });
    
    // Verify connection is established
    if (conn.readyState !== 1) {
      throw new Error(`Connection not established, current state: ${conn.readyState}`);
    }
    
    console.log(`Connected to: ${conn.name} at ${conn.host}`);
    
    // Add event listeners for connection issues
    conn.on('error', (err) => {
      console.error(`Connection error event: ${err.message}`);
    });
    
    conn.on('disconnected', () => {
      console.warn('Connection disconnected event fired');
    });
    
    return conn;
  } catch (error) {
    console.error(`Connection error: ${error.message}`);
    throw error;
  }
}

// Fungsi untuk mendaftarkan model pada koneksi
function registerModels(connection) {
  // Impor semua model
  const models = require('../models');
  
  // Daftarkan setiap model pada koneksi
  for (const [modelName, modelSchema] of Object.entries(models)) {
    if (!connection.models[modelName]) {
      connection.model(modelName, modelSchema.schema);
    }
  }
  
  return connection.models;
}

// Fungsi untuk mendapatkan semua model dari database
async function getModels(connection) {
  // Daftarkan model pada koneksi
  const models = registerModels(connection);
  const modelNames = Object.keys(models);
  
  if (modelNames.length === 0) {
    console.warn('No models registered. Check your model definitions.');
  } else {
    console.log(`Registered models: ${modelNames.join(', ')}`);
  }
  
  return models;
}

// Fungsi untuk menyinkronkan data dari sumber ke tujuan
async function syncData(sourceConn, targetConn) {
  try {
    // Dapatkan semua model dari koneksi sumber
    const sourceModels = await getModels(sourceConn);
    const targetModels = await getModels(targetConn);
    const modelNames = Object.keys(sourceModels);
    
    console.log(`Found ${modelNames.length} models to sync`);
    
    for (const modelName of modelNames) {
      console.log(`Syncing ${modelName}...`);
      
      // Dapatkan model dari kedua koneksi
      const SourceModel = sourceConn.model(modelName);
      const TargetModel = targetConn.model(modelName);
      
      // Ambil semua data dari sumber
      const sourceData = await SourceModel.find({}).lean();
      console.log(`Found ${sourceData.length} documents in ${modelName}`);
      
      let createdCount = 0;
      let updatedCount = 0;
      
      // Untuk setiap dokumen di sumber
      for (const doc of sourceData) {
        try {
          // Hapus properti yang mungkin menyebabkan masalah
          const docToSave = { ...doc };
          
          // Cek apakah dokumen sudah ada di tujuan berdasarkan _id
          const existingDoc = await TargetModel.findById(doc._id).lean();
          
          if (existingDoc) {
            // Update dokumen yang sudah ada
            await TargetModel.findByIdAndUpdate(doc._id, docToSave, { new: true });
            updatedCount++;
          } else {
            // Buat dokumen baru
            await TargetModel.create(docToSave);
            createdCount++;
          }
        } catch (docError) {
          console.error(`Error processing document in ${modelName}: ${docError.message}`);
        }
      }
      
      console.log(`${modelName}: Created ${createdCount} documents, Updated ${updatedCount} documents`);
    }
    
    console.log('Database synchronization completed!');
  } catch (error) {
    console.error(`Sync error: ${error.message}`);
    throw error;
  }
}

// Fungsi utama untuk menjalankan sinkronisasi
async function main() {
  let sourceConn = null;
  let targetConn = null;
  
  try {
    // Tentukan URI berdasarkan argumen command line atau environment
    const sourceUri = process.env.MONGO_URI_DEV;
    const targetUri = process.env.MONGO_URI_PROD;
    
    if (!sourceUri || !targetUri) {
      throw new Error('Database URIs not defined. Check your .env file.');
    }
    
    console.log('Source database: Development');
    console.log('Target database: Production');
    
    // Koneksi ke database lokal (sumber)
    console.log('Connecting to source database...');
    sourceConn = await connectToDatabase(sourceUri);
    
    // Koneksi ke database Atlas (tujuan)
    console.log('Connecting to target database...');
    targetConn = await connectToDatabase(targetUri);
    
    // Verifikasi koneksi
    if (!sourceConn.readyState || sourceConn.readyState !== 1) {
      throw new Error('Source database connection is not open');
    }
    
    if (!targetConn.readyState || targetConn.readyState !== 1) {
      throw new Error('Target database connection is not open');
    }
    
    console.log('Both connections established successfully');
    
    // Jalankan sinkronisasi
    console.log('Starting data synchronization...');
    await syncData(sourceConn, targetConn);
  } catch (error) {
    console.error(`Main error: ${error.message}`);
  } finally {
    // Tutup koneksi
    console.log('Closing database connections...');
    if (sourceConn) {
      try {
        await sourceConn.close();
        console.log('Source connection closed');
      } catch (err) {
        console.error(`Error closing source connection: ${err.message}`);
      }
    }
    
    if (targetConn) {
      try {
        await targetConn.close();
        console.log('Target connection closed');
      } catch (err) {
        console.error(`Error closing target connection: ${err.message}`);
      }
    }
    
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Jalankan fungsi utama
main();