import pandas as pd
import numpy as np
from typing import Dict, Optional
import lightgbm as lgb
from sklearn.model_selection import train_test_split
import logging
import pickle

logger = logging.getLogger(__name__)

class ExitPredictorModel:
    """ML model to predict optimal exit points."""
    
    def __init__(
        self,
        lookback_period: int = 30,
        lookahead_period: int = 10,
        exit_threshold: float = -0.10  # -10% from peak
    ):
        self.lookback_period = lookback_period
        self.lookahead_period = lookahead_period
        self.exit_threshold = exit_threshold
        self.model = None
        self.feature_columns = []
    
    def prepare_training_data(self, df: pd.DataFrame) -> tuple:
        """Prepare training data with exit labels."""
        try:
            df = df.copy()
            
            # Calculate future returns
            df['future_return'] = df['close'].shift(-self.lookahead_period) / df['close'] - 1
            
            # Create exit signal (when price is about to drop)
            df['should_exit'] = (df['future_return'] <= self.exit_threshold).astype(int)
            
            # Remove rows with NaN
            df = df.dropna()
            
            if df.empty:
                logger.warning("No training data after removing NaN values")
                return None, None, None, None
            
            # Define feature columns
            exclude_cols = ['timestamp', 'should_exit', 'future_return']
            self.feature_columns = [col for col in df.columns if col not in exclude_cols]
            
            X = df[self.feature_columns]
            y = df['should_exit']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y if len(y.unique()) > 1 else None
            )
            
            return X_train, X_test, y_train, y_test
            
        except Exception as e:
            logger.error(f"Error preparing training data: {e}")
            return None, None, None, None
    
    def train(self, X_train, y_train, X_test, y_test) -> Dict:
        """Train the exit prediction model."""
        try:
            # Calculate scale_pos_weight
            neg_count = (y_train == 0).sum()
            pos_count = (y_train == 1).sum()
            scale_pos_weight = neg_count / pos_count if pos_count > 0 else 1
            
            # Train LightGBM model
            self.model = lgb.LGBMClassifier(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.1,
                scale_pos_weight=scale_pos_weight,
                random_state=42,
                verbose=-1
            )
            
            self.model.fit(X_train, y_train)
            
            # Evaluate
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            
            logger.info(f"Exit Predictor - Train Score: {train_score:.4f}, Test Score: {test_score:.4f}")
            
            return {
                'train_score': train_score,
                'test_score': test_score,
                'feature_importance': dict(zip(self.feature_columns, self.model.feature_importances_))
            }
            
        except Exception as e:
            logger.error(f"Error training exit predictor: {e}")
            return {}
    
    def predict_proba(self, features: pd.DataFrame) -> Optional[np.ndarray]:
        """Predict exit probability."""
        if self.model is None:
            logger.warning("Model not trained yet")
            return None
        
        try:
            features = features[self.feature_columns]
            proba = self.model.predict_proba(features)
            return proba[:, 1]  # Return probability of exit
            
        except Exception as e:
            logger.error(f"Error predicting exit probability: {e}")
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
                        'exit_threshold': self.exit_threshold
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
                self.exit_threshold = params['exit_threshold']
            logger.info(f"Model loaded from {filepath}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")