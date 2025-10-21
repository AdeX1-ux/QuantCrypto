import pandas as pd
import numpy as np
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class OnChainFeatureExtractor:
    """Extract features from on-chain data."""
    
    def __init__(self):
        pass
    
    def extract_holder_features(self, holder_data: Dict) -> Dict:
        """Extract features from holder distribution data."""
        try:
            features = {
                'total_holders': holder_data.get('total_holders', 0),
                'holder_concentration': holder_data.get('concentration', 0.0),
            }
            
            balances = holder_data.get('holder_balances', [])
            if balances:
                features['avg_holder_balance'] = np.mean(balances)
                features['median_holder_balance'] = np.median(balances)
                features['holder_balance_std'] = np.std(balances)
            else:
                features['avg_holder_balance'] = 0
                features['median_holder_balance'] = 0
                features['holder_balance_std'] = 0
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting holder features: {e}")
            return {}
    
    def extract_whale_features(self, whale_txs: List[Dict]) -> Dict:
        """Extract features from whale transaction data."""
        try:
            if not whale_txs:
                return {
                    'whale_buy_count': 0,
                    'whale_sell_count': 0,
                    'whale_net_flow': 0.0,
                    'whale_avg_size': 0.0
                }
            
            buy_txs = [tx for tx in whale_txs if tx.get('type') == 'buy']
            sell_txs = [tx for tx in whale_txs if tx.get('type') == 'sell']
            
            buy_volume = sum([tx.get('amount', 0) for tx in buy_txs])
            sell_volume = sum([tx.get('amount', 0) for tx in sell_txs])
            
            features = {
                'whale_buy_count': len(buy_txs),
                'whale_sell_count': len(sell_txs),
                'whale_net_flow': buy_volume - sell_volume,
                'whale_avg_size': np.mean([tx.get('amount', 0) for tx in whale_txs])
            }
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting whale features: {e}")
            return {}
    
    def extract_liquidity_features(self, liquidity_data: Dict) -> Dict:
        """Extract features from liquidity pool data."""
        try:
            features = {
                'total_liquidity': liquidity_data.get('total_liquidity', 0.0),
                'liquidity_24h_change': liquidity_data.get('liquidity_24h_change', 0.0),
                'volume_24h': liquidity_data.get('volume_24h', 0.0),
                'volume_to_liquidity': 0.0
            }
            
            if features['total_liquidity'] > 0:
                features['volume_to_liquidity'] = features['volume_24h'] / features['total_liquidity']
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting liquidity features: {e}")
            return {}