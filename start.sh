#!/bin/bash

# Start MongoDB if it's not running
mongod --dbpath=/data/db &
MONGO_PID=$!

# Wait a bit for MongoDB to start
sleep 3

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
  kill $MONGO_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Keep the script running
echo "Both server and client are running. Press Ctrl+C to stop."
wait