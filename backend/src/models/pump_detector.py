import pandas as pd
import numpy as np
from typing import Dict, Optional
import xgboost as xgb
from sklearn.model_selection import train_test_split
import logging
import pickle

logger = logging.getLogger(__name__)

class PumpDetectorModel:
    """ML model to detect potential pump opportunities in meme coins."""
    
    def __init__(
        self,
        lookback_period: int = 60,
        lookahead_period: int = 15,
        pump_threshold: float = 0.20  # 20% price increase
    ):
        self.lookback_period = lookback_period
        self.lookahead_period = lookahead_period
        self.pump_threshold = pump_threshold
        self.model = None
        self.feature_columns = []
    
    def prepare_training_data(self, df: pd.DataFrame) -> tuple:
        """Prepare training data with pump labels."""
        try:
            df = df.copy()
            
            # Calculate future returns
            df['future_return'] = df['close'].shift(-self.lookahead_period) / df['close'] - 1
            
            # Create pump label
            df['is_pump'] = (df['future_return'] >= self.pump_threshold).astype(int)
            
            # Remove rows with NaN
            df = df.dropna()
            
            if df.empty:
                logger.warning("No training data after removing NaN values")
                return None, None, None, None
            
            # Define feature columns (exclude target and metadata)
            exclude_cols = ['timestamp', 'is_pump', 'future_return']
            self.feature_columns = [col for col in df.columns if col not in exclude_cols]
            
            X = df[self.feature_columns]
            y = df['is_pump']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y if len(y.unique()) > 1 else None
            )
            
            return X_train, X_test, y_train, y_test
            
        except Exception as e:
            logger.error(f"Error preparing training data: {e}")
            return None, None, None, None
    
    def train(self, X_train, y_train, X_test, y_test) -> Dict:
        """Train the pump detection model."""
        try:
            # Calculate scale_pos_weight for imbalanced data
            neg_count = (y_train == 0).sum()
            pos_count = (y_train == 1).sum()
            scale_pos_weight = neg_count / pos_count if pos_count > 0 else 1
            
            # Train XGBoost model
            self.model = xgb.XGBClassifier(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                scale_pos_weight=scale_pos_weight,
                random_state=42,
                tree_method='hist'
            )
            
            self.model.fit(X_train, y_train)
            
            # Evaluate
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            
            logger.info(f"Pump Detector - Train Score: {train_score:.4f}, Test Score: {test_score:.4f}")
            
            return {
                'train_score': train_score,
                'test_score': test_score,
                'feature_importance': dict(zip(self.feature_columns, self.model.feature_importances_))
            }
            
        except Exception as e:
            logger.error(f"Error training pump detector: {e}")
            return {}
    
    def predict_proba(self, features: pd.DataFrame) -> Optional[np.ndarray]:
        """Predict pump probability."""
        if self.model is None:
            logger.warning("Model not trained yet")
            return None
        
        try:
            # Ensure feature columns match
            features = features[self.feature_columns]
            proba = self.model.predict_proba(features)
            return proba[:, 1]  # Return probability of pump
            
        except Exception as e:
            logger.error(f"Error predicting pump probability: {e}")
            return None
    
    def save_model(self, filepath: str):
        """Save model to file."""
        try:
            with open(filepath, 'wb') as f:
                pickle.dump({
                    'model': self.model,
                    'feature_columns': self.feature_columns,
                    'params': {
                        'lookback_period': self.lookback_period,
                        'lookahead_period': self.lookahead_period,
                        'pump_threshold': self.pump_threshold
                    }
                }, f)
            logger.info(f"Model saved to {filepath}")
        except Exception as e:
            logger.error(f"Error saving model: {e}")
    
    def load_model(self, filepath: str):
        """Load model from file."""
        try:
            with open(filepath, 'rb') as f:
                data = pickle.load(f)
                self.model = data['model']
                self.feature_columns = data['feature_columns']
                params = data['params']
                self.lookback_period = params['lookback_period']
                self.lookahead_period = params['lookahead_period']
                self.pump_threshold = params['pump_threshold']
            logger.info(f"Model loaded from {filepath}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")