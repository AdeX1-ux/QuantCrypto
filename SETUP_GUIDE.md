# CryptoQuant AI - Complete Setup Guide

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- Docker Desktop installed: https://www.docker.com/products/docker-desktop/
- Git (optional, for cloning)

### 1. Start Everything with Docker
```cmd
# Clone or download the project
# Navigate to project directory
cd C:\Users\adeen\OneDrive\Desktop\cryptio\.emergent

# Start all services (MongoDB + Backend + Frontend)
docker-compose up --build

# Access the application:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# MongoDB: localhost:27017
```

### 2. Stop Services
```cmd
docker-compose down
```

---

## 🛠️ Manual Setup (Without Docker)

### Option A: MongoDB Community Server
```cmd
# Download MongoDB Community Server 7.0
curl -o mongodb-windows-x86_64-7.0.4-signed.msi https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.4-signed.msi

# Install MongoDB (run as Administrator)
msiexec /i mongodb-windows-x86_64-7.0.4-signed.msi /quiet

# Start MongoDB service
net start MongoDB
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://cloud.mongodb.com/
2. Create free cluster
3. Get connection string
4. Update `backend/.env` with Atlas URI

### Backend Setup
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Update backend/.env with your MongoDB connection
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=crypto_ai_db

# Start backend
venv\Scripts\uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```cmd
cd frontend
npm install
npm start
```

---

## 🔧 Configuration

### API Keys (Already Configured)
- ✅ Etherscan API Key: `E93F4XZ6EBEHDACUYUR4VNGH258YRGHQ91`
- ✅ Twitter API Key: `h9FeLgu9uYhFZDysHkkRHlsWU`
- ✅ Twitter API Secret: `tbNG9veNZVkUgDjcb7Z3cK8JMhDJJiKb6LaBIqrXiueMAlnl6J`

### Optional API Keys
- Claude API Key (for AI insights)
- Twitter Bearer Token (for enhanced social data)

---

## 📊 Features

### ✅ Implemented
- **Real-time Market Data**: Live price updates via WebSocket
- **AI Trading Signals**: Pump detection and exit prediction
- **Portfolio Management**: Track positions and P&L
- **Risk Management**: Stop-loss, take-profit, position sizing
- **Social Sentiment**: Twitter/Reddit analysis
- **On-chain Analytics**: Token holders, whale transactions
- **Modern UI**: Dark mode, glassmorphism, responsive design
- **Paper Trading**: Safe testing environment

### 🔄 Real-time Features
- Live price updates every 5 seconds
- WebSocket connections for instant data
- Market metrics dashboard
- Signal notifications

---

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```cmd
   # Check if MongoDB is running
   net start MongoDB
   
   # Or use Docker MongoDB
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

2. **Port Already in Use**
   ```cmd
   # Kill process using port 8000
   netstat -ano | findstr :8000
   taskkill /PID <PID_NUMBER> /F
   
   # Kill process using port 3000
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```

3. **Python Dependencies Error**
   ```cmd
   cd backend
   venv\Scripts\activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Node Dependencies Error**
   ```cmd
   cd frontend
   npm cache clean --force
   npm install
   ```

---

## 📱 Access Points

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **WebSocket**: ws://localhost:8000/ws
- **MongoDB**: localhost:27017

---

## 🎯 Next Steps

1. **Start with Docker** (easiest): `docker-compose up --build`
2. **Access Frontend**: http://localhost:3000
3. **Configure Settings**: Add optional API keys
4. **Start Trading**: Monitor signals and manage portfolio

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all services are running
3. Check logs in terminal/console
4. Ensure ports 3000, 8000, 27017 are available
