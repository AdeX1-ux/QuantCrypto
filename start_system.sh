#!/bin/bash

# CryptoQuant AI - Startup Script
# This script starts both the backend and frontend services

echo "🚀 Starting CryptoQuant AI System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python is installed
if ! command -v python &> /dev/null; then
    print_error "Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Checking system requirements..."

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    print_warning ".env file not found in backend directory"
    print_status "Creating .env file with default values..."
    cat > backend/.env << EOF
MONGO_URL="mongodb://localhost:27017"
DB_NAME="crypto_ai_db"
CORS_ORIGINS="*"

# Emergent LLM Key
EMERGENT_LLM_KEY=sk-emergent-a6763904259B4823aA

# Exchange API Keys
BINANCE_API_KEY=qOVmkOFuAXN1Yxtj6QTTjHPNPRit0nYuP6VQzVSQIQnDRhpjYTM3B6zWlTMfS0u5
BINANCE_API_SECRET=3yD�uD�Uq9NUZstKJ�.3QtV�.L5Hb1VD'bsTZzqtXwD'hD-yaID�0pCmbm6s2KgTjDsFg8W7

# On-chain API Keys
ETHERSCAN_API_KEY=E93F4XZ6EBEHDACUYUR4VNGH258YRGHQ91
INFURA_PROJECT_ID=
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Social Media API Keys
TWITTER_API_KEY=h9FeLgu9uYhFZDysHkkRHlsWU
TWITTER_API_SECRET=tbNG9veNZVkUgDjcb7Z3cK8JMhDJJiKb6LaBIqrXiueMAlnl6J
TWITTER_BEARER_TOKEN=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=CryptoAI/1.0

# Redis
REDIS_URL=redis://localhost:6379

# Trading Config
PAPER_TRADING=true
MAX_POSITION_SIZE=0.1
DAILY_LOSS_LIMIT=0.05
EOF
    print_success ".env file created"
fi

# Install Python dependencies
print_status "Installing Python dependencies..."
cd backend
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python -m venv venv
fi

source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

print_status "Installing Python packages..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    print_success "Python dependencies installed"
else
    print_error "Failed to install Python dependencies"
    exit 1
fi

# Start backend server
print_status "Starting backend server..."
python server.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    print_success "Backend server started (PID: $BACKEND_PID)"
else
    print_error "Failed to start backend server"
    exit 1
fi

# Go back to root directory
cd ..

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Node.js dependencies installed"
    else
        print_error "Failed to install Node.js dependencies"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
else
    print_success "Node.js dependencies already installed"
fi

# Start frontend server
print_status "Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    print_success "Frontend server started (PID: $FRONTEND_PID)"
else
    print_error "Failed to start frontend server"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Go back to root directory
cd ..

print_success "CryptoQuant AI System Started Successfully!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo "🔌 WebSocket: ws://localhost:8000/ws"
echo ""
echo "📋 Services Running:"
echo "   - Backend Server (PID: $BACKEND_PID)"
echo "   - Frontend Server (PID: $FRONTEND_PID)"
echo ""
echo "🛑 To stop the system, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down CryptoQuant AI..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    print_success "System stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
print_status "System is running... Press Ctrl+C to stop"
wait
