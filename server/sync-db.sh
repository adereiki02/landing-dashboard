#!/bin/bash

# Script untuk menyinkronkan database lokal ke produksi
echo "===== DATABASE SYNCHRONIZATION TOOL ====="
echo "Syncing local database to production..."
echo ""

# Pastikan berada di direktori server
cd "$(dirname "$0")"

# Jalankan script sinkronisasi
node scripts/directSync.js

echo ""
echo "===== SYNCHRONIZATION PROCESS COMPLETED ====="