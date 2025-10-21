#!/usr/bin/env python3
"""
Test script to verify API key integration for CryptoQuant AI
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the backend src directory to Python path
backend_src = Path(__file__).parent / "backend" / "src"
sys.path.insert(0, str(backend_src))

from data_ingestion.onchain_collector import OnChainCollector
from data_ingestion.social_collector import SocialCollector

async def test_etherscan_api():
    """Test Etherscan API integration."""
    print("🔍 Testing Etherscan API integration...")
    
    # Use the provided Etherscan API key
    etherscan_key = "E93F4XZ6EBEHDACUYUR4VNGH258YRGHQ91"
    
    collector = OnChainCollector(etherscan_api_key=etherscan_key)
    
    # Test with a popular token (USDT)
    usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    
    try:
        # Test token info
        holders_data = await collector.get_token_holders(usdt_address)
        print(f"✅ Token holders data: {holders_data}")
        
        # Test whale transactions
        whale_txs = await collector.get_whale_transactions(usdt_address)
        print(f"✅ Whale transactions found: {len(whale_txs)}")
        
        # Test contract verification
        is_verified = await collector.check_contract_verified(usdt_address)
        print(f"✅ Contract verified: {is_verified}")
        
    except Exception as e:
        print(f"❌ Etherscan API test failed: {e}")

async def test_twitter_api():
    """Test Twitter API integration."""
    print("\n🐦 Testing Twitter API integration...")
    
    # Use the provided Twitter API keys
    twitter_api_key = "h9FeLgu9uYhFZDysHkkRHlsWU"
    twitter_api_secret = "tbNG9veNZVkUgDjcb7Z3cK8JMhDJJiKb6LaBIqrXiueMAlnl6J"
    
    collector = SocialCollector(
        twitter_api_key=twitter_api_key,
        twitter_api_secret=twitter_api_secret
    )
    
    try:
        # Test Twitter data fetching
        keywords = ["bitcoin", "crypto"]
        tweets = await collector.fetch_twitter_data(keywords, max_results=10)
        print(f"✅ Twitter data fetched: {len(tweets)} tweets")
        
        if tweets:
            print(f"   Sample tweet: {tweets[0]['text'][:100]}...")
        
    except Exception as e:
        print(f"❌ Twitter API test failed: {e}")

async def main():
    """Run all API tests."""
    print("🚀 CryptoQuant AI - API Key Integration Test")
    print("=" * 50)
    
    await test_etherscan_api()
    await test_twitter_api()
    
    print("\n✅ API key integration test completed!")

if __name__ == "__main__":
    asyncio.run(main())
