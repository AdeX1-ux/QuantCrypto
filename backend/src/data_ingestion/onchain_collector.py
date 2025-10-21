from web3 import Web3
from typing import Dict, List, Optional
import asyncio
import logging
import aiohttp
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class OnChainCollector:
    """Collects on-chain data from Ethereum and other blockchains."""
    
    def __init__(self, infura_url: str = None, etherscan_api_key: str = None):
        self.etherscan_api_key = etherscan_api_key
        self.etherscan_base_url = "https://api.etherscan.io/api"
        if infura_url:
            self.w3 = Web3(Web3.HTTPProvider(infura_url))
        else:
            self.w3 = None
    
    async def _make_etherscan_request(self, params: Dict) -> Dict:
        """Make a request to Etherscan API."""
        if not self.etherscan_api_key:
            logger.warning("Etherscan API key not provided")
            return {}
        
        params['apikey'] = self.etherscan_api_key
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.etherscan_base_url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('status') == '1':
                            return data.get('result', {})
                        else:
                            logger.error(f"Etherscan API error: {data.get('message', 'Unknown error')}")
                            return {}
                    else:
                        logger.error(f"HTTP error {response.status}")
                        return {}
        except Exception as e:
            logger.error(f"Error making Etherscan request: {e}")
            return {}

    async def get_token_holders(self, token_address: str, limit: int = 100) -> Dict:
        """Get top token holders data using Etherscan API."""
        try:
            # Get token info first
            token_info_params = {
                'module': 'token',
                'action': 'tokeninfo',
                'contractaddress': token_address
            }
            
            token_info = await self._make_etherscan_request(token_info_params)
            
            # Get token supply
            supply_params = {
                'module': 'stats',
                'action': 'tokensupply',
                'contractaddress': token_address
            }
            
            total_supply = await self._make_etherscan_request(supply_params)
            
            # For now, return structure with available data
            holders_data = {
                'total_holders': int(token_info.get('totalHolders', 0)) if token_info else 0,
                'total_supply': int(total_supply) if total_supply else 0,
                'top_holders': [],
                'holder_balances': [],
                'concentration': 0.0,
                'token_name': token_info.get('tokenName', 'Unknown') if token_info else 'Unknown',
                'token_symbol': token_info.get('symbol', 'UNK') if token_info else 'UNK'
            }
            
            logger.info(f"Fetched token info for {token_address}: {holders_data['token_name']} ({holders_data['token_symbol']})")
            return holders_data
            
        except Exception as e:
            logger.error(f"Error fetching holders for {token_address}: {e}")
            return {'total_holders': 0, 'top_holders': [], 'holder_balances': [], 'concentration': 0.0}
    
    async def get_whale_transactions(self, token_address: str, hours: int = 24) -> List[Dict]:
        """Get recent large transactions (whale activity) using Etherscan API."""
        try:
            # Get recent token transfers
            transfer_params = {
                'module': 'account',
                'action': 'tokentx',
                'contractaddress': token_address,
                'page': 1,
                'offset': 100,
                'sort': 'desc'
            }
            
            transfers = await self._make_etherscan_request(transfer_params)
            
            whale_txs = []
            if isinstance(transfers, list):
                for tx in transfers[:50]:  # Limit to recent transactions
                    try:
                        value = int(tx.get('value', 0))
                        decimals = int(tx.get('tokenDecimal', 18))
                        actual_value = value / (10 ** decimals)
                        
                        # Consider transactions > $10,000 as whale activity (simplified)
                        if actual_value > 10000:  # This is a simplified threshold
                            whale_txs.append({
                                'hash': tx.get('hash', ''),
                                'from': tx.get('from', ''),
                                'to': tx.get('to', ''),
                                'value': actual_value,
                                'timestamp': int(tx.get('timeStamp', 0)),
                                'block_number': int(tx.get('blockNumber', 0))
                            })
                    except (ValueError, TypeError) as e:
                        logger.warning(f"Error parsing transaction: {e}")
                        continue
            
            logger.info(f"Found {len(whale_txs)} whale transactions for {token_address}")
            return whale_txs
            
        except Exception as e:
            logger.error(f"Error fetching whale transactions: {e}")
            return []
    
    async def get_liquidity_info(self, token_address: str) -> Dict:
        """Get liquidity pool information."""
        try:
            # In production, query DEX contracts (Uniswap, PancakeSwap, etc.)
            liquidity_data = {
                'total_liquidity': 0.0,
                'liquidity_24h_change': 0.0,
                'volume_24h': 0.0,
                'price_impact': 0.0
            }
            
            logger.info(f"Fetching liquidity info for {token_address}")
            return liquidity_data
            
        except Exception as e:
            logger.error(f"Error fetching liquidity info: {e}")
            return {'total_liquidity': 0.0, 'liquidity_24h_change': 0.0, 'volume_24h': 0.0, 'price_impact': 0.0}
    
    async def check_contract_verified(self, token_address: str) -> bool:
        """Check if contract is verified on Etherscan."""
        try:
            if not self.etherscan_api_key:
                return False
                
            # Get contract source code
            params = {
                'module': 'contract',
                'action': 'getsourcecode',
                'address': token_address
            }
            
            result = await self._make_etherscan_request(params)
            
            if isinstance(result, list) and len(result) > 0:
                source_code = result[0].get('SourceCode', '')
                return source_code != '' and source_code != 'Contract source code not verified'
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking contract verification: {e}")
            return False