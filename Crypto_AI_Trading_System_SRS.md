# Crypto AI Trading System - Software Requirements Specification (SRS)

**Version:** 1.0  
**Date:** October 21, 2025  
**Author:** Adeen
**Project:** Crypto AI Trading System with Docker Implementation  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Technical Implementation](#technical-implementation)
5. [Docker Implementation](#docker-implementation)
6. [Deployment Guide](#deployment-guide)
7. [API Documentation](#api-documentation)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Future Enhancements](#future-enhancements)
10. [Appendices](#appendices)

---

## Executive Summary

The Crypto AI Trading System is a comprehensive cryptocurrency trading platform that combines real-time market data collection, AI-powered insights, and automated trading capabilities. The system has been fully dockerized and deployed to Docker Hub for global accessibility.

### Key Achievements
- ✅ Complete Docker containerization
- ✅ Docker Hub deployment
- ✅ Health monitoring implementation
- ✅ Production-ready configuration
- ✅ Comprehensive documentation

---

## Project Overview

### System Purpose
The Crypto AI Trading System is designed to provide:
- Real-time cryptocurrency market data collection
- AI-powered trading insights and predictions
- Portfolio management and risk assessment
- Social sentiment analysis
- On-chain data analysis
- Automated trading signals

### Target Users
- Cryptocurrency traders
- Investment analysts
- Algorithmic trading enthusiasts
- Financial institutions

### System Scope
- Multi-exchange data integration
- Machine learning model deployment
- Real-time data processing
- Web-based user interface
- RESTful API services

---

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   External APIs │    │   Data Storage  │
│   Interface     │    │   (Exchanges)   │    │   (Volumes)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Overview

#### Frontend (React Application)
- **Technology**: React 18, Tailwind CSS, ApexCharts
- **Features**: Real-time dashboard, portfolio management, trading interface
- **Port**: 3000
- **Docker Image**: `adexx1/crypto-ai-frontend:latest`

#### Backend (FastAPI Application)
- **Technology**: Python 3.11, FastAPI, Uvicorn
- **Features**: RESTful API, WebSocket connections, AI/ML processing
- **Port**: 8000
- **Docker Image**: `adexx1/crypto-ai-backend:latest`

#### Database (MongoDB)
- **Technology**: MongoDB 7.0
- **Features**: Document storage, real-time queries, data persistence
- **Port**: 27017
- **Docker Image**: `mongo:7.0`

---

## Technical Implementation

### Backend Services

#### Data Collection Services
1. **Exchange Data Collector**
   - Real-time price data from multiple exchanges
   - Order book analysis
   - Trading volume metrics
   - Historical data storage

2. **On-Chain Data Collector**
   - Blockchain transaction monitoring
   - Wallet activity analysis
   - Network metrics
   - Smart contract interactions

3. **Social Media Collector**
   - Twitter sentiment analysis
   - Reddit discussion monitoring
   - News sentiment processing
   - Social sentiment scoring

#### AI/ML Services
1. **Signal Generator**
   - Technical analysis indicators
   - Pattern recognition
   - Market trend analysis
   - Trading signal generation

2. **Pump Detector**
   - Anomaly detection algorithms
   - Volume spike analysis
   - Price movement prediction
   - Risk assessment

3. **Exit Predictor**
   - Exit strategy optimization
   - Profit/loss prediction
   - Risk management
   - Portfolio rebalancing

#### Portfolio Management
1. **Portfolio Tracker**
   - Real-time portfolio valuation
   - Performance metrics
   - Risk assessment
   - Asset allocation

2. **Risk Manager**
   - Position sizing
   - Stop-loss management
   - Risk limits
   - Portfolio optimization

### Frontend Components

#### Dashboard
- Real-time market data display
- Portfolio performance charts
- Trading signals overview
- System status monitoring

#### Trading Interface
- Order placement
- Position management
- Risk controls
- Performance analytics

#### AI Insights
- Market predictions
- Sentiment analysis
- Trading recommendations
- Risk assessments

---

## Docker Implementation

### Docker Architecture

The system is fully containerized using Docker Compose with the following services:

#### Development Configuration (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: crypto_ai_mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: crypto_ai_db
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

  backend:
    build: ./backend
    container_name: crypto_ai_backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=mongodb://admin:password123@mongodb:27017/crypto_ai_db?authSource=admin
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    container_name: crypto_ai_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
```

#### Production Configuration (`docker-compose.prod.yml`)
- Health checks for all services
- Environment variable support
- Production optimizations
- Security hardening

### Docker Images

#### Backend Image (`adexx1/crypto-ai-backend:latest`)
- **Base**: Python 3.11 Slim
- **Size**: ~2.46GB
- **Features**: FastAPI, AI/ML libraries, Exchange APIs, Web3
- **Security**: Non-root user, health checks

#### Frontend Image (`adexx1/crypto-ai-frontend:latest`)
- **Base**: Node.js 18 Alpine
- **Size**: ~1.24GB
- **Features**: React app, Tailwind CSS, ApexCharts
- **Security**: Non-root user, signal handling

### Docker Hub Deployment

Both images are available on Docker Hub:
- **Frontend**: https://hub.docker.com/r/adexx1/crypto-ai-frontend
- **Backend**: https://hub.docker.com/r/adexx1/crypto-ai-backend

---

## Deployment Guide

### Local Development Setup

#### Prerequisites
- Docker Desktop installed and running
- Git (for cloning the repository)
- Code editor (VS Code recommended)

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd crypto-ai-trading-system
```

#### Step 2: Environment Configuration
Create a `.env` file:
```env
# Database Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DB_NAME=crypto_ai_db

# API Keys
ETHERSCAN_API_KEY=your_etherscan_key
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_BEARER_TOKEN=your_bearer_token
CLAUDE_API_KEY=your_claude_key

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

#### Step 3: Start the System
```bash
# Development mode with live reloading
docker-compose up

# Production mode
docker-compose -f docker-compose.prod.yml up -d
```

#### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Production Deployment

#### Using Docker Hub Images
```bash
# Download and run using Docker Hub images
docker-compose -f docker-compose.hub.yml up -d
```

#### Cloud Deployment Options
1. **AWS ECS/Fargate**
2. **Google Cloud Run**
3. **Azure Container Instances**
4. **DigitalOcean App Platform**
5. **Heroku Container Registry**

### Management Commands

#### Development Commands
```bash
# Start system
docker-compose up -d

# View logs
docker-compose logs -f

# Stop system
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

#### Production Commands
```bash
# Start production system
docker-compose -f docker-compose.prod.yml up -d

# Update images
docker pull adexx1/crypto-ai-frontend:latest
docker pull adexx1/crypto-ai-backend:latest

# Restart with new images
docker-compose -f docker-compose.hub.yml up -d --force-recreate
```

---

## API Documentation

### Base URL
- **Development**: http://localhost:8000
- **Production**: https://your-domain.com

### Authentication
The API uses API key authentication for sensitive endpoints.

### Core Endpoints

#### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "healthy",
  "exchange_collector": true,
  "ai_insights": true,
  "portfolio_value": 0
}
```

#### Market Data
```http
GET /api/market-data/{symbol}
```
**Parameters:**
- `symbol`: Cryptocurrency symbol (e.g., BTC, ETH)

#### Trading Signals
```http
GET /api/signals
POST /api/signals
```

#### Portfolio Management
```http
GET /api/portfolio
POST /api/portfolio/positions
PUT /api/portfolio/positions/{id}
DELETE /api/portfolio/positions/{id}
```

#### AI Insights
```http
GET /api/insights
POST /api/insights/generate
```

### WebSocket Endpoints

#### Real-time Data
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
};
```

---

## Troubleshooting Guide

### Common Issues

#### 1. Container Health Issues
**Problem**: Backend container shows as unhealthy
**Solution**: 
```bash
# Check logs
docker-compose logs backend

# Test health endpoint
curl http://localhost:8000/api/health

# Restart container
docker-compose restart backend
```

#### 2. Database Connection Issues
**Problem**: Cannot connect to MongoDB
**Solution**:
```bash
# Check MongoDB status
docker-compose logs mongodb

# Verify connection string
echo $MONGO_URL

# Restart database
docker-compose restart mongodb
```

#### 3. Frontend Build Issues
**Problem**: Frontend container fails to start
**Solution**:
```bash
# Check build logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

#### 4. Network Connectivity Issues
**Problem**: Services cannot communicate
**Solution**:
```bash
# Check network
docker network ls
docker network inspect emergent_crypto_ai_network

# Restart all services
docker-compose down
docker-compose up -d
```

### Performance Optimization

#### Resource Limits
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

#### Monitoring
```bash
# View resource usage
docker stats

# Check container health
docker-compose ps

# Monitor logs
docker-compose logs -f --tail=100
```

---

## Future Enhancements

### Planned Features
1. **Advanced AI Models**
   - Deep learning integration
   - Reinforcement learning
   - Natural language processing

2. **Enhanced Security**
   - OAuth2 authentication
   - API rate limiting
   - Encryption at rest

3. **Scalability Improvements**
   - Kubernetes deployment
   - Load balancing
   - Auto-scaling

4. **Additional Integrations**
   - More cryptocurrency exchanges
   - DeFi protocol integration
   - NFT market analysis

### Technical Roadmap
- **Q1 2025**: Advanced ML models
- **Q2 2025**: Mobile application
- **Q3 2025**: Enterprise features
- **Q4 2025**: Global deployment

---

## Appendices

### Appendix A: Environment Variables

#### Required Variables
```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DB_NAME=crypto_ai_db
```

#### Optional Variables
```env
ETHERSCAN_API_KEY=your_key
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_BEARER_TOKEN=your_token
CLAUDE_API_KEY=your_key
```

### Appendix B: Docker Commands Reference

#### Image Management
```bash
# Build images
docker-compose build

# Push to Docker Hub
docker push adexx1/crypto-ai-backend:latest
docker push adexx1/crypto-ai-frontend:latest

# Pull from Docker Hub
docker pull adexx1/crypto-ai-backend:latest
docker pull adexx1/crypto-ai-frontend:latest
```

#### Container Management
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Appendix C: File Structure

```
crypto-ai-trading-system/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── server.py
│   └── src/
│       ├── ai_insights/
│       ├── data_ingestion/
│       ├── feature_engineering/
│       ├── models/
│       └── trading/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── public/
├── docker-compose.yml
├── docker-compose.prod.yml
├── docker-compose.hub.yml
├── mongo-init.js
└── README.md
```

### Appendix D: Health Check Implementation

#### Backend Health Check
```python
@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        portfolio_value = portfolio.get_total_value() if 'portfolio' in globals() and portfolio is not None else 0
    except:
        portfolio_value = 0
    
    return {
        "status": "healthy",
        "exchange_collector": exchange_collector is not None,
        "ai_insights": ai_insights is not None,
        "portfolio_value": portfolio_value
    }
```

#### Docker Health Check
```dockerfile
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1
```

---

## Conclusion

The Crypto AI Trading System represents a comprehensive solution for cryptocurrency trading with advanced AI capabilities. The system has been successfully dockerized and deployed to Docker Hub, making it accessible globally. The implementation includes robust health monitoring, security features, and production-ready configurations.

The system is now ready for:
- Local development
- Production deployment
- Cloud deployment
- Global distribution via Docker Hub

For support and updates, refer to the project documentation and Docker Hub repositories.

---

**Document Version:** 1.0  
**Last Updated:** October 21, 2025  
**Next Review:** January 21, 2026
