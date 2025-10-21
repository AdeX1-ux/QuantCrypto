import tweepy
import praw
from typing import Dict, List, Optional
import asyncio
import logging
from datetime import datetime, timedelta
import re

logger = logging.getLogger(__name__)

class SocialCollector:
    """Collects social media sentiment data from Twitter and Reddit."""
    
    def __init__(
        self,
        twitter_api_key: Optional[str] = None,
        twitter_api_secret: Optional[str] = None,
        twitter_bearer_token: Optional[str] = None,
        reddit_client_id: Optional[str] = None,
        reddit_client_secret: Optional[str] = None,
        reddit_user_agent: str = "CryptoAI/1.0"
    ):
        self.twitter_client = None
        self.reddit_client = None
        
        # Initialize Twitter client with API key and secret
        if twitter_api_key and twitter_api_secret:
            try:
                self.twitter_client = tweepy.Client(
                    consumer_key=twitter_api_key,
                    consumer_secret=twitter_api_secret,
                    bearer_token=twitter_bearer_token
                )
                logger.info("Twitter client initialized with API key and secret")
            except Exception as e:
                logger.error(f"Failed to initialize Twitter client: {e}")
        elif twitter_bearer_token:
            # Fallback to bearer token only
            try:
                self.twitter_client = tweepy.Client(bearer_token=twitter_bearer_token)
                logger.info("Twitter client initialized with bearer token only")
            except Exception as e:
                logger.error(f"Failed to initialize Twitter client with bearer token: {e}")
        
        # Initialize Reddit client
        if reddit_client_id and reddit_client_secret:
            try:
                self.reddit_client = praw.Reddit(
                    client_id=reddit_client_id,
                    client_secret=reddit_client_secret,
                    user_agent=reddit_user_agent
                )
                logger.info("Reddit client initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Reddit client: {e}")
    
    async def fetch_twitter_data(self, keywords: List[str], max_results: int = 100) -> List[Dict]:
        """Fetch tweets mentioning specific keywords."""
        if not self.twitter_client:
            logger.warning("Twitter client not initialized")
            return []
        
        try:
            query = ' OR '.join(keywords)
            
            # Search recent tweets
            tweets = await asyncio.to_thread(
                self.twitter_client.search_recent_tweets,
                query=query,
                max_results=max_results,
                tweet_fields=['created_at', 'public_metrics', 'author_id']
            )
            
            if not tweets.data:
                return []
            
            tweet_data = []
            for tweet in tweets.data:
                tweet_data.append({
                    'id': tweet.id,
                    'text': tweet.text,
                    'created_at': tweet.created_at,
                    'likes': tweet.public_metrics.get('like_count', 0),
                    'retweets': tweet.public_metrics.get('retweet_count', 0),
                    'replies': tweet.public_metrics.get('reply_count', 0)
                })
            
            return tweet_data
            
        except Exception as e:
            logger.error(f"Error fetching Twitter data: {e}")
            return []
    
    async def fetch_reddit_data(self, subreddits: List[str], keywords: List[str], limit: int = 100) -> List[Dict]:
        """Fetch Reddit posts from specified subreddits."""
        if not self.reddit_client:
            logger.warning("Reddit client not initialized")
            return []
        
        try:
            posts_data = []
            
            for subreddit_name in subreddits:
                subreddit = await asyncio.to_thread(
                    self.reddit_client.subreddit,
                    subreddit_name
                )
                
                # Get hot posts
                posts = await asyncio.to_thread(
                    lambda: list(subreddit.hot(limit=limit))
                )
                
                for post in posts:
                    # Check if any keyword is mentioned
                    text = f"{post.title} {post.selftext}".lower()
                    if any(keyword.lower() in text for keyword in keywords):
                        posts_data.append({
                            'id': post.id,
                            'title': post.title,
                            'text': post.selftext,
                            'score': post.score,
                            'num_comments': post.num_comments,
                            'created_utc': datetime.fromtimestamp(post.created_utc),
                            'subreddit': subreddit_name
                        })
            
            return posts_data
            
        except Exception as e:
            logger.error(f"Error fetching Reddit data: {e}")
            return []
    
    def calculate_basic_sentiment(self, text: str) -> float:
        """Calculate basic sentiment score (-1 to 1).
        
        This is a simple implementation. In production, use proper sentiment analysis.
        """
        positive_words = ['moon', 'bullish', 'pump', 'up', 'gain', 'profit', 'buy', 'long']
        negative_words = ['crash', 'bearish', 'dump', 'down', 'loss', 'sell', 'short', 'rug']
        
        text_lower = text.lower()
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        total = positive_count + negative_count
        if total == 0:
            return 0.0
        
        return (positive_count - negative_count) / total