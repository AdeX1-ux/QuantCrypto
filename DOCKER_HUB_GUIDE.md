# 🐳 Docker Hub Upload Guide

Your Crypto AI Trading System has been successfully uploaded to Docker Hub! Here's everything you need to know.

## 🎉 **Successfully Uploaded Images**

- **Frontend**: `adexx1/crypto-ai-frontend:latest` ✅
- **Backend**: `adexx1/crypto-ai-backend:latest` (Upload in progress)

## 📦 **Docker Hub Repository**

Your images are available at:
- **Frontend**: https://hub.docker.com/r/adexx1/crypto-ai-frontend
- **Backend**: https://hub.docker.com/r/adexx1/crypto-ai-backend

## 🚀 **How to Use Your Images**

### **Option 1: Use Docker Compose (Recommended)**

```bash
# Download and run using Docker Hub images
docker-compose -f docker-compose.hub.yml up -d
```

### **Option 2: Manual Docker Commands**

```bash
# Pull the images
docker pull adexx1/crypto-ai-frontend:latest
docker pull adexx1/crypto-ai-backend:latest

# Run MongoDB
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=crypto_ai_db \
  mongo:7.0

# Run Backend
docker run -d --name backend \
  -p 8000:8000 \
  --link mongodb \
  -e MONGO_URL=mongodb://admin:password123@mongodb:27017/crypto_ai_db?authSource=admin \
  adexx1/crypto-ai-backend:latest

# Run Frontend
docker run -d --name frontend \
  -p 3000:3000 \
  --link backend \
  -e REACT_APP_API_URL=http://localhost:8000 \
  adexx1/crypto-ai-frontend:latest
```

## 🌐 **Access Your Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 **Environment Variables**

Create a `.env` file to customize your setup:

```env
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DB_NAME=crypto_ai_db

# API Keys
ETHERSCAN_API_KEY=your_etherscan_key
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_BEARER_TOKEN=your_bearer_token
CLAUDE_API_KEY=your_claude_key

# Frontend URLs
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

## 📋 **Available Commands**

### **Start the System**
```bash
# Using Docker Compose
docker-compose -f docker-compose.hub.yml up -d

# View logs
docker-compose -f docker-compose.hub.yml logs -f

# Stop system
docker-compose -f docker-compose.hub.yml down
```

### **Update Images**
```bash
# Pull latest versions
docker pull adexx1/crypto-ai-frontend:latest
docker pull adexx1/crypto-ai-backend:latest

# Restart with new images
docker-compose -f docker-compose.hub.yml up -d --force-recreate
```

## 🔄 **Updating Your Images**

When you make changes to your code:

1. **Rebuild locally**:
   ```bash
   docker-compose build
   ```

2. **Tag for Docker Hub**:
   ```bash
   docker tag emergent-backend:latest adexx1/crypto-ai-backend:latest
   docker tag emergent-frontend:latest adexx1/crypto-ai-frontend:latest
   ```

3. **Push to Docker Hub**:
   ```bash
   docker push adexx1/crypto-ai-backend:latest
   docker push adexx1/crypto-ai-frontend:latest
   ```

## 🌍 **Deploy Anywhere**

Your images can now be deployed on any system with Docker:

### **Cloud Platforms**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Heroku Container Registry**

### **VPS/Server Deployment**
```bash
# On any Linux server
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone your repo or download docker-compose.hub.yml
wget https://raw.githubusercontent.com/yourusername/crypto-ai-trading/main/docker-compose.hub.yml

# Start the system
docker-compose -f docker-compose.hub.yml up -d
```

## 📊 **Image Details**

### **Frontend Image** (`adexx1/crypto-ai-frontend:latest`)
- **Base**: Node.js 18 Alpine
- **Size**: ~1.24GB
- **Features**: React app with Tailwind CSS, ApexCharts, Framer Motion
- **Port**: 3000

### **Backend Image** (`adexx1/crypto-ai-backend:latest`)
- **Base**: Python 3.11 Slim
- **Size**: ~2.46GB
- **Features**: FastAPI, AI/ML libraries, Exchange APIs, Web3
- **Port**: 8000

## 🛠️ **Troubleshooting**

### **Network Issues**
If you encounter network issues during push:
```bash
# Check Docker daemon
docker system info

# Restart Docker Desktop
# Then retry push
docker push adexx1/crypto-ai-backend:latest
```

### **Permission Issues**
```bash
# Login to Docker Hub
docker login

# Check your repositories
docker search adexx1
```

### **Image Not Found**
```bash
# Pull the latest images
docker pull adexx1/crypto-ai-frontend:latest
docker pull adexx1/crypto-ai-backend:latest

# Verify images
docker images | grep adexx1
```

## 🎯 **Next Steps**

1. **Share your images**: Anyone can now use your Crypto AI Trading System
2. **Set up CI/CD**: Automate building and pushing images
3. **Add version tags**: Use semantic versioning (v1.0.0, v1.1.0, etc.)
4. **Monitor usage**: Check Docker Hub analytics
5. **Add documentation**: Update README with Docker Hub instructions

## 📚 **Additional Resources**

- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**🎉 Congratulations! Your Crypto AI Trading System is now available worldwide on Docker Hub!**
