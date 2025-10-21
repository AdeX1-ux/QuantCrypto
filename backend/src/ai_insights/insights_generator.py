try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    _EMERGENT_AVAILABLE = True
except Exception:
    LlmChat = None  # type: ignore
    UserMessage = None  # type: ignore
    _EMERGENT_AVAILABLE = False
from typing import Dict, List, Optional
import logging
import asyncio
import os
from datetime import datetime

logger = logging.getLogger(__name__)

class AIInsightsGenerator:
    """Generate AI-powered trading insights using Claude Sonnet 4."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.chat = None
        self._initialize_chat()
    
    def _initialize_chat(self):
        """Initialize Claude chat client."""
        try:
            if not _EMERGENT_AVAILABLE:
                logger.warning("Emergent integrations package not available; AI insights disabled.")
                return
            self.chat = LlmChat(
                api_key=self.api_key,
                session_id=f"crypto_insights_{datetime.now().strftime('%Y%m%d')}",
                system_message="""You are an expert crypto trading analyst specializing in meme coins and volatile tokens. 
                Your role is to provide concise, actionable insights based on market data, technical indicators, 
                on-chain metrics, and social sentiment. Always consider risk factors and provide balanced analysis.
                Keep responses brief and focused on key insights."""
            ).with_model("anthropic", "claude-3-7-sonnet-20250219")
            logger.info("AI Insights Generator initialized with Claude Sonnet 4")
        except Exception as e:
            logger.error(f"Failed to initialize AI chat: {e}")
    
    async def analyze_trading_signal(
        self,
        symbol: str,
        pump_prob: float,
        exit_prob: float,
        market_features: Dict,
        onchain_features: Dict = None,
        sentiment_features: Dict = None
    ) -> str:
        """Analyze a trading signal and provide AI insights."""
        try:
            # Prepare analysis context
            context = f"""Analyze this crypto trading opportunity:
            
Symbol: {symbol}
Pump Probability: {pump_prob:.2%}
Exit Probability: {exit_prob:.2%}

Market Data:
- Current Price: ${market_features.get('close', 0):.6f}
- 5min Change: {market_features.get('price_change_5m', 0):.2%}
- 15min Change: {market_features.get('price_change_15m', 0):.2%}
- Volume Ratio: {market_features.get('volume_ratio', 0):.2f}x
- RSI: {market_features.get('rsi', 0):.1f}
- Volatility: {market_features.get('volatility_15', 0):.4f}
"""
            
            if onchain_features:
                context += f"""
On-Chain Metrics:
- Holder Concentration: {onchain_features.get('holder_concentration', 0):.2%}
- Whale Net Flow: {onchain_features.get('whale_net_flow', 0):.2f}
- Liquidity Change 24h: {onchain_features.get('liquidity_24h_change', 0):.2%}
"""
            
            if sentiment_features:
                context += f"""
Social Sentiment:
- Tweet Count: {sentiment_features.get('tweet_count', 0)}
- Avg Sentiment: {sentiment_features.get('avg_sentiment', 0):.2f}
- Positive Ratio: {sentiment_features.get('positive_ratio', 0):.2%}
"""
            
            context += "\nProvide a brief analysis (2-3 sentences) covering: 1) Key opportunity/risk factors, 2) Recommended action (buy/hold/sell), 3) Main concern to watch."
            
            # Get AI insight
            if not _EMERGENT_AVAILABLE or not self.chat or not UserMessage:
                return "AI insights unavailable (SDK not installed)."
            user_message = UserMessage(text=context)
            response = await self.chat.send_message(user_message)
            return response
            
        except Exception as e:
            logger.error(f"Error generating AI insight: {e}")
            return "Unable to generate AI insight at this time."
    
    async def analyze_portfolio_performance(
        self,
        portfolio_metrics: Dict,
        recent_trades: List[Dict]
    ) -> str:
        """Analyze overall portfolio performance and provide recommendations."""
        try:
            context = f"""Analyze this crypto trading portfolio performance:

Portfolio Metrics:
- Total Value: ${portfolio_metrics.get('total_value', 0):,.2f}
- Cash: ${portfolio_metrics.get('cash', 0):,.2f}
- Total PnL: ${portfolio_metrics.get('total_pnl', 0):,.2f} ({portfolio_metrics.get('total_pnl_pct', 0):.2%})
- Win Rate: {portfolio_metrics.get('win_rate', 0):.2%}
- Total Trades: {portfolio_metrics.get('total_trades', 0)}
- Active Positions: {portfolio_metrics.get('active_positions', 0)}
"""
            
            if recent_trades:
                context += "\nRecent Trades (last 5):\n"
                for i, trade in enumerate(recent_trades[:5], 1):
                    context += f"{i}. {trade.get('symbol', 'N/A')}: {trade.get('action', 'N/A')} @ ${trade.get('price', 0):.6f}, PnL: {trade.get('pnl_pct', 0):.2%}\n"
            
            context += "\nProvide: 1) Performance assessment, 2) Key strengths/weaknesses, 3) Actionable recommendation for improvement."
            
            if not _EMERGENT_AVAILABLE or not self.chat or not UserMessage:
                return "AI insights unavailable (SDK not installed)."
            user_message = UserMessage(text=context)
            response = await self.chat.send_message(user_message)
            return response
            
        except Exception as e:
            logger.error(f"Error analyzing portfolio: {e}")
            return "Unable to analyze portfolio at this time."
    
    async def analyze_market_conditions(
        self,
        top_movers: List[Dict],
        market_summary: Dict
    ) -> str:
        """Analyze overall market conditions."""
        try:
            context = """Analyze current crypto/meme coin market conditions:

Market Summary:
"""
            
            for key, value in market_summary.items():
                context += f"- {key}: {value}\n"
            
            if top_movers:
                context += "\nTop Movers (24h):\n"
                for i, coin in enumerate(top_movers[:5], 1):
                    context += f"{i}. {coin.get('symbol', 'N/A')}: {coin.get('change_24h', 0):.2%}, Vol: ${coin.get('volume_24h', 0):,.0f}\n"
            
            context += "\nProvide: 1) Market sentiment overview, 2) Opportunities to watch, 3) Risk factors."
            
            if not _EMERGENT_AVAILABLE or not self.chat or not UserMessage:
                return "AI insights unavailable (SDK not installed)."
            user_message = UserMessage(text=context)
            response = await self.chat.send_message(user_message)
            return response
            
        except Exception as e:
            logger.error(f"Error analyzing market: {e}")
            return "Unable to analyze market conditions at this time."