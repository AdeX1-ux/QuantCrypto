import pandas as pd
import numpy as np
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class MarketFeatureExtractor:
    """Extract market-based features from OHLCV data."""
    
    def __init__(self):
        pass
    
    def extract_all_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extract all market features from OHLCV data."""
        if df.empty:
            return df
        
        try:
            df = df.copy()
            
            # Price features
            df['returns'] = df['close'].pct_change()
            df['log_returns'] = np.log(df['close'] / df['close'].shift(1))
            df['price_change_1m'] = df['close'].pct_change(1)
            df['price_change_5m'] = df['close'].pct_change(5)
            df['price_change_15m'] = df['close'].pct_change(15)
            
            # Volume features
            df['volume_change'] = df['volume'].pct_change()
            df['volume_ma_5'] = df['volume'].rolling(5).mean()
            df['volume_ma_15'] = df['volume'].rolling(15).mean()
            df['volume_ratio'] = df['volume'] / df['volume_ma_15']
            
            # Volatility features
            df['volatility_5'] = df['returns'].rolling(5).std()
            df['volatility_15'] = df['returns'].rolling(15).std()
            
            # Technical indicators
            df = self._add_rsi(df)
            df = self._add_macd(df)
            df = self._add_bollinger_bands(df)
            
            # Momentum features
            df['momentum_5'] = df['close'] - df['close'].shift(5)
            df['momentum_15'] = df['close'] - df['close'].shift(15)
            
            # High/Low features
            df['high_low_range'] = (df['high'] - df['low']) / df['close']
            df['close_position'] = (df['close'] - df['low']) / (df['high'] - df['low'] + 1e-10)
            
            return df
            
        except Exception as e:
            logger.error(f"Error extracting market features: {e}")
            return df
    
    def _add_rsi(self, df: pd.DataFrame, period: int = 14) -> pd.DataFrame:
        """Add RSI indicator."""
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / (loss + 1e-10)
        df['rsi'] = 100 - (100 / (1 + rs))
        return df
    
    def _add_macd(self, df: pd.DataFrame, fast: int = 12, slow: int = 26, signal: int = 9) -> pd.DataFrame:
        """Add MACD indicator."""
        ema_fast = df['close'].ewm(span=fast).mean()
        ema_slow = df['close'].ewm(span=slow).mean()
        df['macd'] = ema_fast - ema_slow
        df['macd_signal'] = df['macd'].ewm(span=signal).mean()
        df['macd_diff'] = df['macd'] - df['macd_signal']
        return df
    
    def _add_bollinger_bands(self, df: pd.DataFrame, period: int = 20, std_dev: int = 2) -> pd.DataFrame:
        """Add Bollinger Bands."""
        df['bb_middle'] = df['close'].rolling(period).mean()
        bb_std = df['close'].rolling(period).std()
        df['bb_upper'] = df['bb_middle'] + (bb_std * std_dev)
        df['bb_lower'] = df['bb_middle'] - (bb_std * std_dev)
        df['bb_width'] = (df['bb_upper'] - df['bb_lower']) / df['bb_middle']
        df['bb_position'] = (df['close'] - df['bb_lower']) / (df['bb_upper'] - df['bb_lower'] + 1e-10)
        return df
    
    def extract_order_book_features(self, order_book: Dict) -> Dict:
        """Extract features from order book data."""
        try:
            bids = order_book.get('bids', [])
            asks = order_book.get('asks', [])
            
            if not bids or not asks:
                return {}
            
            # Calculate bid-ask spread
            best_bid = bids[0][0] if bids else 0
            best_ask = asks[0][0] if asks else 0
            spread = (best_ask - best_bid) / best_bid if best_bid > 0 else 0
            
            # Calculate order book imbalance
            bid_volume = sum([b[1] for b in bids[:10]])
            ask_volume = sum([a[1] for a in asks[:10]])
            imbalance = (bid_volume - ask_volume) / (bid_volume + ask_volume + 1e-10)
            
            return {
                'spread': spread,
                'order_book_imbalance': imbalance,
                'bid_volume': bid_volume,
                'ask_volume': ask_volume
            }
            
        except Exception as e:
            logger.error(f"Error extracting order book features: {e}")
            return {}