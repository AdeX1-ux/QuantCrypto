from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import json
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

# Import custom modules
from src.data_ingestion.exchange_collector import ExchangeDataCollector
from src.data_ingestion.onchain_collector import OnChainCollector
from src.data_ingestion.social_collector import SocialCollector
from src.feature_engineering.market_features import MarketFeatureExtractor
from src.feature_engineering.onchain_features import OnChainFeatureExtractor
from src.feature_engineering.sentiment_features import SentimentFeatureExtractor
from src.models.pump_detector import PumpDetectorModel
from src.models.exit_predictor import ExitPredictorModel
from src.models.signal_generator import SignalGenerator
from src.trading.portfolio import Portfolio
from src.trading.risk_manager import RiskManager
from src.ai_insights.insights_generator import AIInsightsGenerator

ROOT_DIR = Path(__file__).parent
load_dotenv(dotenv_path=ROOT_DIR / '.env', override=True)

# MongoDB connection
mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.getenv('DB_NAME', 'crypto_ai_db')]

# Initialize FastAPI
app = FastAPI(title="Crypto AI Trading Assistant")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.subscribed_symbols: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from symbol subscriptions
        for symbol, connections in self.subscribed_symbols.items():
            if websocket in connections:
                connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except:
            self.disconnect(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                self.disconnect(connection)

    async def broadcast_to_symbol(self, symbol: str, message: str):
        if symbol in self.subscribed_symbols:
            for connection in self.subscribed_symbols[symbol]:
                try:
                    await connection.send_text(message)
                except:
                    self.disconnect(connection)

    def subscribe_to_symbol(self, websocket: WebSocket, symbol: str):
        if symbol not in self.subscribed_symbols:
            self.subscribed_symbols[symbol] = []
        if websocket not in self.subscribed_symbols[symbol]:
            self.subscribed_symbols[symbol].append(websocket)

    def unsubscribe_from_symbol(self, websocket: WebSocket, symbol: str):
        if symbol in self.subscribed_symbols and websocket in self.subscribed_symbols[symbol]:
            self.subscribed_symbols[symbol].remove(websocket)

manager = ConnectionManager()

# Pydantic Models
class ConfigUpdate(BaseModel):
    binance_api_key: Optional[str] = None
    binance_api_secret: Optional[str] = None
    twitter_api_key: Optional[str] = None
    twitter_api_secret: Optional[str] = None
    twitter_bearer_token: Optional[str] = None
    reddit_client_id: Optional[str] = None
    reddit_client_secret: Optional[str] = None
    etherscan_api_key: Optional[str] = None
    infura_project_id: Optional[str] = None

class MarketDataRequest(BaseModel):
    symbol: str
    timeframe: str = '1m'
    limit: int = 500

class SignalRequest(BaseModel):
    symbol: str
    keywords: Optional[List[str]] = None

class TradeRequest(BaseModel):
    symbol: str
    action: str
    price: float

class AIAnalysisRequest(BaseModel):
    type: str
    symbol: Optional[str] = None


# Initialization
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    global exchange_collector, onchain_collector, social_collector, ai_insights
    
    try:
        # Initialize exchange collector
        binance_key = os.getenv('BINANCE_API_KEY')
        binance_secret = os.getenv('BINANCE_API_SECRET')
        exchange_collector = ExchangeDataCollector(
            'binance',
            binance_key if binance_key else None,
            binance_secret if binance_secret else None
        )
        logger.info("Exchange collector initialized")
        
        # Initialize on-chain collector
        infura_url = f"https://mainnet.infura.io/v3/{os.getenv('INFURA_PROJECT_ID')}" if os.getenv('INFURA_PROJECT_ID') else None
        onchain_collector = OnChainCollector(
            infura_url=infura_url,
            etherscan_api_key=os.getenv('ETHERSCAN_API_KEY')
        )
        logger.info("On-chain collector initialized")
        
        # Initialize social collector
        social_collector = SocialCollector(
            twitter_api_key=os.getenv('TWITTER_API_KEY'),
            twitter_api_secret=os.getenv('TWITTER_API_SECRET'),
            twitter_bearer_token=os.getenv('TWITTER_BEARER_TOKEN'),
            reddit_client_id=os.getenv('REDDIT_CLIENT_ID'),
            reddit_client_secret=os.getenv('REDDIT_CLIENT_SECRET')
        )
        logger.info("Social collector initialized")
        
        # Initialize AI insights
        emergent_key = os.getenv('EMERGENT_LLM_KEY')
        if emergent_key:
            ai_insights = AIInsightsGenerator(emergent_key)
            logger.info("AI Insights Generator initialized")
        else:
            logger.warning("EMERGENT_LLM_KEY not found, AI insights disabled")
        
        # Start real-time data broadcasting
        asyncio.create_task(broadcast_realtime_data())
        logger.info("Real-time data broadcasting started")
        
    except Exception as e:
        logger.error(f"Error during startup: {e}")


# API Endpoints
@api_router.get("/")
async def root():
    return {
        "message": "Crypto AI Trading Assistant API",
        "version": "1.0.0",
        "status": "running"
    }

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

@api_router.post("/config/update")
async def update_config(config: ConfigUpdate):
    """Update API keys and configuration."""
    global exchange_collector, social_collector, onchain_collector
    
    try:
        if config.binance_api_key and config.binance_api_secret:
            exchange_collector = ExchangeDataCollector(
                'binance',
                config.binance_api_key,
                config.binance_api_secret
            )
        
        if config.twitter_api_key or config.twitter_api_secret or config.twitter_bearer_token or config.reddit_client_id:
            social_collector = SocialCollector(
                twitter_api_key=config.twitter_api_key,
                twitter_api_secret=config.twitter_api_secret,
                twitter_bearer_token=config.twitter_bearer_token,
                reddit_client_id=config.reddit_client_id,
                reddit_client_secret=config.reddit_client_secret
            )
        
        if config.infura_project_id:
            infura_url = f"https://mainnet.infura.io/v3/{config.infura_project_id}"
            onchain_collector = OnChainCollector(
                infura_url=infura_url,
                etherscan_api_key=config.etherscan_api_key
            )
        
        return {"status": "success", "message": "Configuration updated"}
    
    except Exception as e:
        logger.error(f"Error updating config: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/market/data")
async def get_market_data(request: MarketDataRequest):
    """Fetch market data for a symbol."""
    try:
        df = await exchange_collector.fetch_ohlcv(
            request.symbol,
            request.timeframe,
            request.limit
        )
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No data found")
        
        df = market_features.extract_all_features(df)
        data = df.tail(50).to_dict('records')
        
        for record in data:
            if 'timestamp' in record:
                record['timestamp'] = record['timestamp'].isoformat()
        
        return {
            "symbol": request.symbol,
            "timeframe": request.timeframe,
            "data": data
        }
    
    except Exception as e:
        logger.error(f"Error fetching market data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/signals/generate")
async def generate_signal(request: SignalRequest):
    """Generate trading signal for a symbol."""
    try:
        df = await exchange_collector.fetch_ohlcv(request.symbol, '1m', 500)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No market data available")
        
        df = market_features.extract_all_features(df)
        current_features = df.tail(1)
        
        pump_prob = 0.5
        exit_prob = 0.5
        
        if pump_detector.model is not None:
            pump_probs = pump_detector.predict_proba(current_features)
            if pump_probs is not None:
                pump_prob = float(pump_probs[0])
        
        if exit_predictor.model is not None:
            exit_probs = exit_predictor.predict_proba(current_features)
            if exit_probs is not None:
                exit_prob = float(exit_probs[0])
        
        has_position = request.symbol in portfolio.positions
        
        signal = signal_generator.generate_signal(
            pump_prob,
            exit_prob,
            has_position
        )
        
        current_price = float(df.iloc[-1]['close'])
        
        score = signal_generator.score_opportunity(
            pump_prob,
            exit_prob,
            sentiment_score=0.0,
            volume_surge=float(df.iloc[-1].get('volume_ratio', 1.0)) > 2.0
        )
        
        result = {
            "symbol": request.symbol,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "signal": signal,
            "current_price": current_price,
            "opportunity_score": score,
            "has_position": has_position
        }
        
        if ai_insights:
            market_feat = current_features.iloc[0].to_dict()
            insight = await ai_insights.analyze_trading_signal(
                request.symbol,
                pump_prob,
                exit_prob,
                market_feat
            )
            result['ai_insight'] = insight
        
        return result
    
    except Exception as e:
        logger.error(f"Error generating signal: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/trade/execute")
async def execute_trade(request: TradeRequest):
    """Execute a trade (paper trading)."""
    try:
        portfolio_value = portfolio.get_total_value()
        
        if request.action.lower() == 'buy':
            position_cost = 1000
            can_trade, reason = risk_manager.check_can_trade(portfolio_value, position_cost)
            
            if not can_trade:
                raise HTTPException(status_code=400, detail=reason)
            
            quantity = risk_manager.calculate_position_size(
                portfolio_value,
                request.price,
                0.7
            )
            
            success = portfolio.open_position(
                request.symbol,
                quantity,
                request.price
            )
            
            if not success:
                raise HTTPException(status_code=400, detail="Failed to open position")
            
            return {
                "status": "success",
                "action": "buy",
                "symbol": request.symbol,
                "quantity": quantity,
                "price": request.price,
                "cost": quantity * request.price
            }
        
        elif request.action.lower() == 'sell':
            success = portfolio.close_position(request.symbol, request.price)
            
            if not success:
                raise HTTPException(status_code=400, detail="No position to close")
            
            return {
                "status": "success",
                "action": "sell",
                "symbol": request.symbol,
                "price": request.price
            }
        
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error executing trade: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/portfolio")
async def get_portfolio():
    """Get portfolio status and metrics."""
    try:
        metrics = portfolio.get_metrics()
        positions = portfolio.get_position_details()
        recent_trades = portfolio.trade_history[-10:]
        
        return {
            "metrics": metrics,
            "positions": positions,
            "recent_trades": recent_trades
        }
    
    except Exception as e:
        logger.error(f"Error getting portfolio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/analyze")
async def get_ai_analysis(request: AIAnalysisRequest):
    """Get AI-powered analysis."""
    if not ai_insights:
        raise HTTPException(status_code=503, detail="AI insights not available")
    
    try:
        if request.type == 'portfolio':
            metrics = portfolio.get_metrics()
            recent_trades = portfolio.trade_history[-5:]
            analysis = await ai_insights.analyze_portfolio_performance(metrics, recent_trades)
            
        elif request.type == 'market':
            market_summary = {
                "Total Market Cap": "$2.1T",
                "24h Volume": "$95B",
                "BTC Dominance": "48.5%"
            }
            analysis = await ai_insights.analyze_market_conditions([], market_summary)
            
        else:
            raise HTTPException(status_code=400, detail="Invalid analysis type")
        
        return {"analysis": analysis}
    
    except Exception as e:
        logger.error(f"Error getting AI analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/markets/list")
async def list_markets():
    """Get list of available markets."""
    try:
        popular_pairs = [
            "DOGE/USDT", "SHIB/USDT", "PEPE/USDT", "FLOKI/USDT",
            "BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT"
        ]
        
        return {"markets": popular_pairs}
    
    except Exception as e:
        logger.error(f"Error listing markets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/models/train")
async def train_models(background_tasks: BackgroundTasks, symbol: str = "BTC/USDT"):
    """Train ML models with historical data."""
    try:
        background_tasks.add_task(train_models_background, symbol)
        return {"status": "training_started", "symbol": symbol}
    
    except Exception as e:
        logger.error(f"Error starting model training: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def train_models_background(symbol: str):
    """Background task to train models."""
    try:
        logger.info(f"Starting model training for {symbol}")
        
        df = await exchange_collector.fetch_ohlcv(symbol, '1m', 5000)
        
        if df.empty:
            logger.error("No data for training")
            return
        
        df = market_features.extract_all_features(df)
        
        X_train, X_test, y_train, y_test = pump_detector.prepare_training_data(df)
        if X_train is not None:
            pump_detector.train(X_train, y_train, X_test, y_test)
            logger.info("Pump detector trained successfully")
        
        X_train, X_test, y_train, y_test = exit_predictor.prepare_training_data(df)
        if X_train is not None:
            exit_predictor.train(X_train, y_train, X_test, y_test)
            logger.info("Exit predictor trained successfully")
        
    except Exception as e:
        logger.error(f"Error in background training: {e}")


# WebSocket endpoints
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "subscribe_symbol":
                symbol = message.get("symbol")
                manager.subscribe_to_symbol(websocket, symbol)
                await manager.send_personal_message(
                    json.dumps({"type": "subscribed", "symbol": symbol}), 
                    websocket
                )
            
            elif message.get("type") == "unsubscribe_symbol":
                symbol = message.get("symbol")
                manager.unsubscribe_from_symbol(websocket, symbol)
                await manager.send_personal_message(
                    json.dumps({"type": "unsubscribed", "symbol": symbol}), 
                    websocket
                )
            
            elif message.get("type") == "request_realtime_data":
                symbols = message.get("symbols", [])
                for symbol in symbols:
                    manager.subscribe_to_symbol(websocket, symbol)
                
                await manager.send_personal_message(
                    json.dumps({"type": "realtime_data_subscribed", "symbols": symbols}), 
                    websocket
                )
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background task for real-time data updates
async def broadcast_realtime_data():
    """Background task to broadcast real-time data to connected clients."""
    while True:
        try:
            if exchange_collector and manager.active_connections:
                # Get popular symbols
                popular_symbols = ["BTC/USDT", "ETH/USDT", "DOGE/USDT", "SHIB/USDT"]
                
                for symbol in popular_symbols:
                    try:
                        # Get current ticker data
                        ticker = await exchange_collector.get_ticker(symbol)
                        if ticker:
                            price_data = {
                                "type": "price_update",
                                "symbol": symbol,
                                "price": ticker.get("last", 0),
                                "change_24h": ticker.get("percentage", 0),
                                "volume_24h": ticker.get("baseVolume", 0),
                                "high_24h": ticker.get("high", 0),
                                "low_24h": ticker.get("low", 0),
                                "timestamp": datetime.now(timezone.utc).isoformat()
                            }
                            
                            await manager.broadcast_to_symbol(symbol, json.dumps(price_data))
                    
                    except Exception as e:
                        logger.error(f"Error broadcasting data for {symbol}: {e}")
                        continue
            
            await asyncio.sleep(5)  # Update every 5 seconds
            
        except Exception as e:
            logger.error(f"Error in real-time data broadcast: {e}")
            await asyncio.sleep(10)

# Additional API endpoints for frontend
@app.get("/market-data")
async def get_market_data():
    """Get current market data for all tracked symbols"""
    try:
        market_data = []
        for symbol in ["BTC/USDT", "ETH/USDT", "SOL/USDT", "DOGE/USDT"]:
            try:
                ticker = exchange_collector.get_ticker(symbol)
                if ticker:
                    market_data.append({
                        "symbol": symbol,
                        "price": ticker.get("last", 0),
                        "change": ticker.get("percentage", 0),
                        "volume": f"{(ticker.get('baseVolume', 0) / 1e6):.1f}M",
                        "high_24h": ticker.get("high", 0),
                        "low_24h": ticker.get("low", 0),
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
            except Exception as e:
                logger.error(f"Error fetching data for {symbol}: {e}")
                continue
        
        return market_data
    except Exception as e:
        logger.error(f"Error in get_market_data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch market data")

@app.get("/signals")
async def get_signals():
    """Get current AI trading signals"""
    try:
        # Generate signals using the signal generator
        signals = []
        
        # Get pump detection signals
        pump_signals = signal_generator.detect_pump_signals()
        for signal in pump_signals:
            signals.append({
                "symbol": signal.get("symbol", "BTC/USDT"),
                "type": "BUY" if signal.get("confidence", 0) > 70 else "HOLD",
                "confidence": signal.get("confidence", 0),
                "reason": signal.get("reason", "AI analysis"),
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        
        # Get exit prediction signals
        exit_signals = signal_generator.predict_exit_signals()
        for signal in exit_signals:
            signals.append({
                "symbol": signal.get("symbol", "BTC/USDT"),
                "type": "SELL" if signal.get("confidence", 0) > 70 else "HOLD",
                "confidence": signal.get("confidence", 0),
                "reason": signal.get("reason", "Exit prediction"),
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        
        return signals[:10]  # Return top 10 signals
    except Exception as e:
        logger.error(f"Error in get_signals: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch signals")

@app.get("/portfolio")
async def get_portfolio():
    """Get current portfolio data"""
    try:
        # Get portfolio from database
        portfolio_doc = await db.portfolio.find_one({"user_id": "default"})
        
        if portfolio_doc:
            total_value = portfolio_doc.get("total_value", 0)
            change_24h = portfolio_doc.get("change_24h", 0)
            active_positions = len(portfolio_doc.get("positions", []))
            today_pl = portfolio_doc.get("today_pl", 0)
            today_pl_percent = portfolio_doc.get("today_pl_percent", 0)
        else:
            # Default values if no portfolio found
            total_value = 10000.0
            change_24h = 0.0
            active_positions = 0
            today_pl = 0.0
            today_pl_percent = 0.0
        
        return {
            "totalValue": total_value,
            "change24h": change_24h,
            "activePositions": active_positions,
            "todayPL": today_pl,
            "todayPLPercent": today_pl_percent,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Error in get_portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio")

@app.get("/social-sentiment")
async def get_social_sentiment():
    """Get current social sentiment data"""
    try:
        # Get social data from database
        social_docs = await db.social_sentiment.find().sort("timestamp", -1).limit(20).to_list(20)
        
        tweets = []
        for doc in social_docs:
            tweets.append({
                "id": str(doc.get("_id", "")),
                "user": doc.get("username", "@crypto_user"),
                "text": doc.get("text", ""),
                "sentiment": doc.get("sentiment", "neutral"),
                "timestamp": doc.get("timestamp", datetime.now(timezone.utc).isoformat())
            })
        
        return tweets
    except Exception as e:
        logger.error(f"Error in get_social_sentiment: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch social sentiment")

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()