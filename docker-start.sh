#!/bin/bash

echo "Starting Crypto AI Trading System with Docker..."
echo

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "ERROR: Docker is not running. Please start Docker first."
    exit 1
fi

# Start the services
echo "Starting services..."
docker-compose up -d

# Wait a moment for services to start
sleep 5

# Show status
echo
echo "Service Status:"
docker-compose ps

echo
echo "========================================"
echo "Crypto AI Trading System is starting..."
echo "========================================"
echo
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "MongoDB: localhost:27017"
echo
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo
