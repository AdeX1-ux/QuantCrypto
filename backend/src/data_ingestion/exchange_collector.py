import ccxt
import pandas as pd
from typing import Dict, List, Optional
import asyncio
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class ExchangeDataCollector:
    """Collects market data from cryptocurrency exchanges."""
    
    def __init__(self, exchange_id: str = 'binance', api_key: str = None, api_secret: str = None):
        self.exchange_id = exchange_id
        exchange_class = getattr(ccxt, exchange_id)
        
        config = {}
        if api_key and api_secret:
            config['apiKey'] = api_key
            config['secret'] = api_secret
            
        self.exchange = exchange_class(config)
        
    async def fetch_ohlcv(self, symbol: str, timeframe: str = '1m', limit: int = 500) -> pd.DataFrame:
        """Fetch OHLCV data for a symbol."""
        try:
            ohlcv = await asyncio.to_thread(
                self.exchange.fetch_ohlcv,
                symbol,
                timeframe,
                limit=limit
            )
            
            df = pd.DataFrame(
                ohlcv,
                columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
            )
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            return df
            
        except Exception as e:
            logger.error(f"Error fetching OHLCV for {symbol}: {e}")
            return pd.DataFrame()
    
    async def fetch_order_book(self, symbol: str, limit: int = 100) -> Dict:
        """Fetch order book data."""
        try:
            order_book = await asyncio.to_thread(
                self.exchange.fetch_order_book,
                symbol,
                limit=limit
            )
            return order_book
        except Exception as e:
            logger.error(f"Error fetching order book for {symbol}: {e}")
            return {'bids': [], 'asks': []}
    
    async def fetch_trades(self, symbol: str, limit: int = 100) -> List[Dict]:
        """Fetch recent trades."""
        try:
            trades = await asyncio.to_thread(
                self.exchange.fetch_trades,
                symbol,
                limit=limit
            )
            return trades
        except Exception as e:
            logger.error(f"Error fetching trades for {symbol}: {e}")
            return []
    
    async def get_ticker(self, symbol: str) -> Dict:
        """Get current ticker information."""
        try:
            ticker = await asyncio.to_thread(
                self.exchange.fetch_ticker,
                symbol
            )
            return ticker
        except Exception as e:
            logger.error(f"Error fetching ticker for {symbol}: {e}")
            return {}
    
    def get_markets(self) -> List[str]:
        """Get list of available markets."""
        try:
            self.exchange.load_markets()
            return list(self.exchange.markets.keys())
        except Exception as e:
            logger.error(f"Error loading markets: {e}")
            return []