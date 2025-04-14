#!/bin/bash

echo "=== Fixing Proxy Connection Issues ==="

# Stop any existing processes on ports 3000 and 5000
echo "Stopping any processes on ports 3000 and 5000..."
kill $(lsof -t -i:3000) 2>/dev/null
kill $(lsof -t -i:5000) 2>/dev/null

# Wait a moment for processes to terminate
sleep 2

# Start the server
echo "Starting server..."
cd server
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Start the client
echo "Starting client..."
cd ../client
npm start &
CLIENT_PID=$!

echo "\n=== Fix Complete ==="
echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"
echo "\nPress Ctrl+C to stop both processes"

# Function to handle script termination
cleanup() {
  echo "Shutting down..."
  kill $SERVER_PID
  kill $CLIENT_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Keep the script running
wait