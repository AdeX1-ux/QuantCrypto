import pandas as pd
import numpy as np
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class SentimentFeatureExtractor:
    """Extract features from social media sentiment data."""
    
    def __init__(self, social_collector):
        self.social_collector = social_collector
    
    def extract_twitter_features(self, tweets: List[Dict]) -> Dict:
        """Extract features from Twitter data."""
        try:
            if not tweets:
                return {
                    'tweet_count': 0,
                    'avg_sentiment': 0.0,
                    'sentiment_std': 0.0,
                    'total_engagement': 0,
                    'positive_ratio': 0.0
                }
            
            sentiments = []
            total_engagement = 0
            
            for tweet in tweets:
                sentiment = self.social_collector.calculate_basic_sentiment(tweet.get('text', ''))
                sentiments.append(sentiment)
                
                total_engagement += (
                    tweet.get('likes', 0) +
                    tweet.get('retweets', 0) +
                    tweet.get('replies', 0)
                )
            
            positive_count = sum(1 for s in sentiments if s > 0)
            
            features = {
                'tweet_count': len(tweets),
                'avg_sentiment': np.mean(sentiments),
                'sentiment_std': np.std(sentiments),
                'total_engagement': total_engagement,
                'positive_ratio': positive_count / len(tweets) if tweets else 0.0
            }
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting Twitter features: {e}")
            return {}
    
    def extract_reddit_features(self, posts: List[Dict]) -> Dict:
        """Extract features from Reddit data."""
        try:
            if not posts:
                return {
                    'post_count': 0,
                    'avg_sentiment': 0.0,
                    'avg_score': 0.0,
                    'total_comments': 0
                }
            
            sentiments = []
            scores = []
            total_comments = 0
            
            for post in posts:
                text = f"{post.get('title', '')} {post.get('text', '')}"
                sentiment = self.social_collector.calculate_basic_sentiment(text)
                sentiments.append(sentiment)
                
                scores.append(post.get('score', 0))
                total_comments += post.get('num_comments', 0)
            
            features = {
                'post_count': len(posts),
                'avg_sentiment': np.mean(sentiments),
                'avg_score': np.mean(scores),
                'total_comments': total_comments
            }
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting Reddit features: {e}")
            return {}