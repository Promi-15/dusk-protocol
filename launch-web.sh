#!/bin/bash

echo "Igniting Dusk Protocol Web Prototype..."

set -e

ROOT_DIR=$(pwd)

echo "Installing dependencies..."

# Install server deps
cd "$ROOT_DIR/web-prototype/server"
if [ ! -d "node_modules" ]; then
  echo "Installing server dependencies..."
  npm install
fi

# Install client deps
cd "$ROOT_DIR/../client" 2>/dev/null || cd "$ROOT_DIR/web-prototype/client"
if [ ! -d "node_modules" ]; then
  echo "Installing client dependencies..."
  npm install
fi

echo "Starting services..."

# Run server
cd "$ROOT_DIR/web-prototype/server"
npm start &
SERVER_PID=$!

# Run client
cd "$ROOT_DIR/web-prototype/client"
npm run dev &
CLIENT_PID=$!

echo "Server: http://localhost:5000"
echo "Client: http://localhost:5173"

# Cleanup on exit
trap "echo 'Shutting down...'; kill $SERVER_PID $CLIENT_PID" EXIT

wait