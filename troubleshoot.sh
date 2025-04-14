#!/bin/bash

echo "=== Troubleshooting Proxy Connection Issues ==="

# Check if MongoDB is running
echo "Checking if MongoDB is running..."
if pgrep -x "mongod" > /dev/null
then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running. Starting MongoDB..."
    mongod --dbpath=/data/db &
    sleep 3
    echo "MongoDB started"
fi

# Check if something is already using port 5000
echo "\nChecking if port 5000 is in use..."
if lsof -i:5000 > /dev/null
then
    echo "❌ Port 5000 is already in use. Here are the processes using it:"
    lsof -i:5000
    echo "\nYou may need to kill these processes before starting your server."
else
    echo "✅ Port 5000 is available"
fi

# Check if something is already using port 3000
echo "\nChecking if port 3000 is in use..."
if lsof -i:3000 > /dev/null
then
    echo "❌ Port 3000 is already in use. Here are the processes using it:"
    lsof -i:3000
    echo "\nYou may need to kill these processes before starting your client."
else
    echo "✅ Port 3000 is available"
fi

# Restart the server
echo "\nRestarting the server..."
cd server
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Test if server is responding
echo "\nTesting server connection..."
if curl -s http://localhost:5000 > /dev/null
then
    echo "✅ Server is running and responding"
else
    echo "❌ Server is not responding. Check server logs for errors."
fi

# Restart the client
echo "\nRestarting the client..."
cd ../client
npm start &
CLIENT_PID=$!

echo "\n=== Troubleshooting Complete ==="
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