from typing import Dict, List
import numpy as np
import logging

logger = logging.getLogger(__name__)

class SignalGenerator:
    """Generate trading signals from model predictions."""
    
    def __init__(
        self,
        pump_threshold: float = 0.7,
        exit_threshold: float = 0.6,
        min_confidence: float = 0.5
    ):
        self.pump_threshold = pump_threshold
        self.exit_threshold = exit_threshold
        self.min_confidence = min_confidence
    
    def generate_signal(
        self,
        pump_prob: float,
        exit_prob: float,
        current_position: bool = False
    ) -> Dict:
        """Generate trading signal based on model predictions.
        
        Returns:
            Dict with 'action' (buy/sell/hold), 'confidence', and 'reason'
        """
        try:
            signal = {
                'action': 'hold',
                'confidence': 0.0,
                'reason': '',
                'pump_prob': pump_prob,
                'exit_prob': exit_prob
            }
            
            # If we have a position, check exit signals first
            if current_position:
                if exit_prob >= self.exit_threshold:
                    signal['action'] = 'sell'
                    signal['confidence'] = exit_prob
                    signal['reason'] = f'Exit signal detected (prob: {exit_prob:.2f})'
                    return signal
            
            # Check for entry signals
            if not current_position:
                if pump_prob >= self.pump_threshold and exit_prob < 0.5:
                    signal['action'] = 'buy'
                    signal['confidence'] = pump_prob
                    signal['reason'] = f'Pump detected (prob: {pump_prob:.2f})'
                    return signal
            
            # Default to hold
            signal['confidence'] = max(pump_prob, exit_prob)
            signal['reason'] = 'Waiting for clear signal'
            
            return signal
            
        except Exception as e:
            logger.error(f"Error generating signal: {e}")
            return {'action': 'hold', 'confidence': 0.0, 'reason': 'Error'}
    
    def score_opportunity(
        self,
        pump_prob: float,
        exit_prob: float,
        sentiment_score: float = 0.0,
        volume_surge: bool = False,
        whale_activity: bool = False
    ) -> float:
        """Score trading opportunity (0-100)."""
        try:
            # Base score from pump probability
            score = pump_prob * 60
            
            # Reduce score if exit signal is strong
            score -= exit_prob * 20
            
            # Add sentiment bonus
            if sentiment_score > 0.5:
                score += 10
            
            # Add volume surge bonus
            if volume_surge:
                score += 10
            
            # Add whale activity bonus
            if whale_activity:
                score += 10
            
            # Clamp to 0-100
            score = max(0, min(100, score))
            
            return score
            
        except Exception as e:
            logger.error(f"Error scoring opportunity: {e}")
            return 0.0