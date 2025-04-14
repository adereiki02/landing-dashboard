#!/bin/bash

# Start MongoDB if it's not running (uncomment if needed)
# mongod --dbpath=/data/db &

# Start the server in one terminal
echo "Starting server..."
cd server && npm run dev &
SERVER_PID=$!

# Wait a bit for the server to start
sleep 5

# Start the client in another terminal
echo "Starting client..."
cd client && npm start &
CLIENT_PID=$!

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
echo "Both server and client are running. Press Ctrl+C to stop."
wait