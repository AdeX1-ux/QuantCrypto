# CryptoQuant AI - AI-Powered Crypto Trading Assistant  

An advanced AI-powered cryptocurrency trading system that monitors meme coins and crypto tokens in real-time, predicts optimal buy/sell timing with ML models (XGBoost + LightGBM), and provides strategic insights.

## 🎯 Key Features

### Intelligence Layer
- **ML Signal Generation**: XGBoost pump detector + LightGBM exit predictor
- **AI Trading Insights**: Claude Sonnet 4 analyzes signals and portfolio performance
- **Multi-Source Data**: Exchange APIs, on-chain analytics, social sentiment

### Trading System
- **Risk Management**: Position sizing, stop-loss (15%), take-profit (30%), Kelly Criterion
- **Paper Trading**: Test strategies risk-free (enabled by default)
- **Portfolio Tracking**: Real-time P&L, trade history, performance metrics
- **Modern Dashboard**: React UI with live charts and AI insights

### Data Sources
1. **Exchange Data** (CCXT): Binance, OKX, Coinbase - OHLCV, order books, trades
2. **On-Chain** (Web3.py, Solana): Holder distribution, whale activity, liquidity
3. **Social Sentiment** (Twitter, Reddit): Volume, engagement, sentiment scoring

## 🏗️ Architecture

### Docker Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Project Structure
```
crypto-ai-trading-system/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── server.py
│   └── src/
│       ├── data_ingestion/      # Exchange, on-chain, social collectors
│       ├── feature_engineering/  # Market, on-chain, sentiment features  
│       ├── models/              # Pump detector, exit predictor, signal generator
│       ├── trading/             # Portfolio, risk manager
│       └── ai_insights/         # Claude Sonnet 4 integration
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── pages/Dashboard.jsx
│       ├── components/          # MarketChart, PortfolioView, AIInsights, etc.
│       └── App.css
├── docker-compose.yml           # Development configuration
├── docker-compose.prod.yml      # Production configuration
├── docker-compose.hub.yml       # Docker Hub images
└── mongo-init.js               # Database initialization
```

### Docker Benefits
- **🔒 Isolated Environment**: Each service runs in its own container
- **📦 Easy Deployment**: One command to start the entire system
- **🔄 Consistent Environment**: Same setup across development, staging, and production
- **⚡ Fast Setup**: No need to install Python, Node.js, or MongoDB locally
- **🌐 Cloud Ready**: Easy deployment to any cloud platform
- **📊 Health Monitoring**: Built-in health checks for all services

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** installed and running
- **Git** (for cloning the repository)
- **Code editor** (VS Code recommended)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd crypto-ai-trading-system
```

### 2. Configure API Keys

Create a `.env` file in the project root:
```env
# Database Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DB_NAME=crypto_ai_db

# API Keys
BINANCE_API_KEY=your_binance_key
BINANCE_API_SECRET=your_binance_secret
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_BEARER_TOKEN=your_bearer_token
REDDIT_CLIENT_ID=your_reddit_id
REDDIT_CLIENT_SECRET=your_reddit_secret
ETHERSCAN_API_KEY=your_etherscan_key
INFURA_PROJECT_ID=your_infura_id
CLAUDE_API_KEY=your_claude_key

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

**Where to get keys:**
- **Binance**: https://www.binance.com/en/my/settings/api-management
- **Twitter**: https://developer.twitter.com/en/portal/dashboard  
- **Reddit**: https://www.reddit.com/prefs/apps
- **Etherscan**: https://etherscan.io/myapikey
- **Infura**: https://infura.io/dashboard
- **Claude**: https://console.anthropic.com/

### 3. Start the System

#### Development Mode (with live reloading)
```bash
docker-compose up
```

#### Production Mode
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### Using Docker Hub Images (Recommended)
```bash
docker-compose -f docker-compose.hub.yml up -d
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

### 5. Management Commands

#### Start/Stop System
```bash
# Start system
docker-compose up -d

# Stop system
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart
```

#### Container Management
```bash
# Access backend shell
docker-compose exec backend bash

# Access frontend shell
docker-compose exec frontend sh

# Check container health
docker-compose ps
```

### 6. Docker Hub Deployment (Recommended)

The system is also available as pre-built Docker images on Docker Hub:

```bash
# Use Docker Hub images (faster setup)
docker-compose -f docker-compose.hub.yml up -d
```

**Docker Hub Images:**
- **Frontend**: `adexx1/crypto-ai-frontend:latest`
- **Backend**: `adexx1/crypto-ai-backend:latest`

**Benefits:**
- ⚡ **Faster Setup**: No need to build images locally
- 🔄 **Always Updated**: Latest versions from Docker Hub
- 🌐 **Global Access**: Available worldwide
- 📦 **Production Ready**: Optimized for production use

## 📊 Usage Guide

### Train ML Models
1. Select symbol (e.g., DOGE/USDT)
2. Click **Train Models** → fetches 5000 historical candles
3. Trains XGBoost (pump detector) + LightGBM (exit predictor)
4. Takes 2-5 minutes

### Generate Signals
1. Select symbol from dropdown
2. Click **Generate Signal**
3. View:
   - Action: Buy/Sell/Hold
   - Confidence score
   - Opportunity score (0-100)
   - **AI Insight** from Claude Sonnet 4

### Execute Trades (Paper Trading)
1. Review signal + AI analysis
2. Click **Execute BUY/SELL**
3. System applies:
   - Position sizing (10% max)
   - Risk checks
   - Portfolio tracking

### Monitor Portfolio
**Portfolio Tab** shows:
- Total value, cash, P&L
- Open positions with live P&L
- Trade history
- Win rate

### AI Insights
**AI Insights Tab**:
- **Analyze Portfolio**: Claude reviews performance + recommendations
- **Analyze Market**: Market overview + opportunities
- Signal-specific analysis auto-included

## 🔑 API Endpoints

```bash
# Health check
GET /api/health

# Get markets list
GET /api/markets/list

# Fetch market data
POST /api/market/data
{
  "symbol": "DOGE/USDT",
  "timeframe": "1m",
  "limit": 500
}

# Generate signal
POST /api/signals/generate
{
  "symbol": "DOGE/USDT"
}

# Execute trade (paper)
POST /api/trade/execute
{
  "symbol": "DOGE/USDT",
  "action": "buy",
  "price": 0.123456
}

# Get portfolio
GET /api/portfolio

# AI analysis
POST /api/ai/analyze
{
  "type": "portfolio"  # or "market"
}

# Train models
POST /api/models/train?symbol=BTC/USDT
```

## 🧠 ML Models

### Pump Detector (XGBoost)
- **Target**: 20%+ price increase in next 15 minutes
- **Features**: Price momentum, volume surge, RSI, MACD, Bollinger Bands, volatility
- **Output**: Probability (0-1)

### Exit Predictor (LightGBM)
- **Target**: -10% drop in next 10 minutes
- **Features**: RSI overbought, declining volume, momentum divergence
- **Output**: Probability (0-1)

### Signal Generator
Combines models + rules:
```python
score = (pump_prob * 60) - (exit_prob * 20) + sentiment_bonus + volume_bonus
if pump_prob > 0.7 and exit_prob < 0.5:
    action = "BUY"
elif exit_prob > 0.6:
    action = "SELL"
```

## ⚠️ Risk Management

### Built-in Controls
- **Max Position**: 10% of portfolio per trade
- **Stop Loss**: 15% automatic exit
- **Take Profit**: 30% target
- **Daily Loss Limit**: 5% → trading halts
- **Kelly Criterion**: Position sizing based on confidence

### Paper Trading (Default)
- `PAPER_TRADING=true` in `.env`
- Simulates trades with $10,000 virtual cash
- Full P&L tracking
- **Switch to live only after extensive testing**

## 🛠️ Tech Stack

**Backend**: FastAPI, XGBoost, LightGBM, CCXT, Web3.py, Tweepy, PRAW, Emergent Integrations (Claude)  
**Frontend**: React 19, Shadcn/UI, Recharts, Tailwind CSS  
**Database**: MongoDB (Motor async driver)  
**AI**: Claude Sonnet 4 via Emergent LLM Key

## 🐛 Troubleshooting

### Container Health Issues
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

### Database Connection Issues
**Problem**: Cannot connect to MongoDB
**Solution**:
```bash
# Check MongoDB status
docker-compose logs mongodb

# Restart database
docker-compose restart mongodb
```

### Frontend Build Issues
**Problem**: Frontend container fails to start
**Solution**:
```bash
# Check build logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Exchange API Blocked (451 Error)
**Issue**: Binance restricts certain regions  
**Fix**: 
- Use VPN
- Switch to OKX/Coinbase via Settings
- Use demo/testnet for development

### Models Not Trained
**Fix**: Click "Train Models" and wait 2-5 minutes

### AI Insights Unavailable
**Fix**: Verify `CLAUDE_API_KEY` in `.env` file

### Network Connectivity Issues
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

## 🚨 Critical Warnings

### ⚠️ HIGH RISK
1. Crypto trading is **extremely risky**
2. Meme coins are **highly volatile**
3. **NO profit guarantees**
4. **You can lose everything**

### Legal
- **Not financial advice** - educational only
- Comply with local regulations
- Consult tax professionals
- **Use at your own risk**

### Best Practices
✅ Start with paper trading  
✅ Never invest more than you can lose  
✅ Set realistic expectations  
✅ Monitor trades actively  

❌ Don't use borrowed money  
❌ Don't ignore risk limits  
❌ Don't trade emotionally  

## 📝 What's Implemented

Based on reference files (crypto_ai_complete.py + crpy.pdf):

### ✅ Complete
- Exchange data ingestion (CCXT)
- On-chain collectors (Web3.py, Solana placeholders)
- Social collectors (Twitter, Reddit)
- Feature engineering (market, on-chain, sentiment)
- ML models (Pump, Exit, Signal Generator)
- Risk management (position sizing, limits)
- Portfolio tracking
- AI insights (Claude Sonnet 4)
- Paper trading
- Modern React dashboard
- API endpoints

### 🔄 Ready for Extension
- **Backtesting**: Framework ready, needs historical data loader
- **Live Trading**: Switch `PAPER_TRADING=false` + add exchange execution
- **Advanced On-Chain**: Connect to Dune Analytics / Etherscan API
- **Alerts**: Email/Telegram notification system
- **Strategy Optimization**: Hyperparameter tuning

## 📈 Performance Tips

1. **Model Retraining**: Schedule daily retraining via cron
2. **Caching**: Add Redis for feature store (reduces API calls)
3. **Rate Limits**: Implement exponential backoff for exchange APIs
4. **WebSockets**: Use for real-time price updates
5. **Database**: Index `symbol`, `timestamp` fields

## 📞 Support

### Docker Commands
```bash
# View logs
docker-compose logs -f

# Check container health
docker-compose ps

# Restart services
docker-compose restart

# View resource usage
docker stats
```

### Health Checks
```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend health
curl http://localhost:3000

# Database health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Docker Hub Images
- **Frontend**: https://hub.docker.com/r/adexx1/crypto-ai-frontend
- **Backend**: https://hub.docker.com/r/adexx1/crypto-ai-backend

---

**⚡ Built with Emergent Agent** | **🤖 Claude Sonnet 4 Insights** | **💚 Paper Trading First**

**Trade Smart. Manage Risk. Learn Continuously.**
