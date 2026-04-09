#!/bin/bash

echo "Starting Dusk Protocol (Dockerized Web Prototype)..."

# Build and run containers
docker compose up --build

echo "Client: http://localhost:3000"
echo "Server: http://localhost:5000"