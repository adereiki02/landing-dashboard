/**
 * Script untuk memeriksa koneksi database
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Fungsi untuk memeriksa koneksi database
async function checkConnection(uri, name) {
  try {
    // Buat koneksi baru
    const conn = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout setelah 5 detik
    });
    
    console.log(`✅ Successfully connected to ${name} database`);
    console.log(`   - Host: ${conn.host}`);
    console.log(`   - Database Name: ${conn.name}`);
    
    // Dapatkan daftar koleksi
    const collections = await conn.db.listCollections().toArray();
    console.log(`   - Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   - Available collections:');
      collections.forEach(collection => {
        console.log(`     * ${collection.name}`);
      });
    }
    
    // Tutup koneksi
    await conn.close();
    console.log(`   - Connection closed`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to connect to ${name} database:`);
    console.error(`   - Error: ${error.message}`);
    return false;
  }
}

// Fungsi utama
async function main() {
  console.log('Checking database connections...\n');
  
  // Periksa koneksi ke database lokal
  console.log('LOCAL DATABASE:');
  const localConnected = await checkConnection(process.env.MONGO_URI_DEV, 'local');
  
  console.log('\nPRODUCTION DATABASE:');
  const prodConnected = await checkConnection(process.env.MONGO_URI_PROD, 'production');
  
  console.log('\nSUMMARY:');
  console.log(`- Local database: ${localConnected ? '✅ Connected' : '❌ Failed'}`);
  console.log(`- Production database: ${prodConnected ? '✅ Connected' : '❌ Failed'}`);
  
  // Keluar dengan kode status yang sesuai
  process.exit(localConnected && prodConnected ? 0 : 1);
}

// Jalankan fungsi utama
main();