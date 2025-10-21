# 🐳 Docker Setup Guide for Crypto AI Trading System

Your project is already fully dockerized! This guide shows you how to use it effectively.

## 🚀 Quick Start

### Windows Users
```bash
# Start the system
docker-start.bat

# View logs
docker-logs.bat

# Stop the system
docker-stop.bat

# Rebuild everything
docker-rebuild.bat
```

### Linux/Mac Users
```bash
# Start the system
./docker-start.sh

# View logs
docker-compose logs -f

# Stop the system
docker-compose down
```

## 📋 Available Commands

### Development Mode
```bash
# Start with live reloading
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Mode
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Stop production environment
docker-compose -f docker-compose.prod.yml down
```

## 🏗️ Architecture

Your dockerized system includes:

- **Frontend** (React): `http://localhost:3000`
- **Backend** (FastAPI): `http://localhost:8000`
- **MongoDB**: `localhost:27017`
- **Network**: All services communicate via `crypto_ai_network`

## 🔧 Service Details

### Backend Service
- **Image**: Custom Python 3.11
- **Port**: 8000
- **Features**: 
  - Health checks
  - Non-root user for security
  - Auto-reload in development
  - Optimized caching

### Frontend Service
- **Image**: Node.js 18 Alpine
- **Port**: 3000
- **Features**:
  - Health checks
  - Non-root user for security
  - Signal handling with dumb-init
  - Optimized build caching

### MongoDB Service
- **Image**: MongoDB 7.0
- **Port**: 27017
- **Features**:
  - Persistent data storage
  - Initialization scripts
  - Health checks
  - Authentication enabled

## 🛠️ Development Workflow

### Making Changes
1. **Code Changes**: Edit files in your IDE
2. **Backend**: Changes auto-reload (volume mounted)
3. **Frontend**: Changes auto-reload (volume mounted)
4. **Database**: Changes persist in Docker volume

### Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

## 🔒 Security Features

- **Non-root users**: All services run as non-root
- **Health checks**: Automatic service monitoring
- **Network isolation**: Services communicate via private network
- **Volume security**: Proper file permissions

## 📊 Monitoring

### Health Checks
- **Backend**: `GET /health` endpoint
- **Frontend**: HTTP check on port 3000
- **MongoDB**: Database ping check

### Viewing Status
```bash
# Check service status
docker-compose ps

# View resource usage
docker stats

# Check health
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

## 🗄️ Data Management

### Backup Database
```bash
# Create backup
docker-compose exec mongodb mongodump --out /data/backup

# Copy backup to host
docker cp crypto_ai_mongodb:/data/backup ./mongodb-backup
```

### Reset Database
```bash
# Stop and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8000
   ```

2. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Out of Disk Space**
   ```bash
   # Clean up Docker
   docker system prune -a
   docker volume prune
   ```

4. **Service Won't Start**
   ```bash
   # Check logs
   docker-compose logs [service-name]
   
   # Rebuild
   docker-compose up -d --build
   ```

### Performance Optimization

```bash
# Limit resources
docker-compose up -d --scale backend=1 --scale frontend=1

# Monitor resources
docker stats

# Clean up
docker system prune
```

## 🌐 Environment Variables

Create a `.env` file for custom configuration:

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

## 🎯 Next Steps

1. **Customize**: Edit environment variables in `.env`
2. **Deploy**: Use `docker-compose.prod.yml` for production
3. **Monitor**: Set up logging and monitoring
4. **Scale**: Add load balancers and multiple instances

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Docker Guide](https://fastapi.tiangolo.com/deployment/docker/)
- [React Docker Guide](https://create-react-app.dev/docs/deployment/#docker)
- [MongoDB Docker Guide](https://hub.docker.com/_/mongo)

---

**Happy Trading! 🚀**
