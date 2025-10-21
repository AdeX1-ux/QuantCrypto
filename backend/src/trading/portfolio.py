from typing import Dict, List, Optional
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class Portfolio:
    """Portfolio manager for tracking positions and performance."""
    
    def __init__(self, initial_cash: float = 10000.0):
        self.initial_cash = initial_cash
        self.cash = initial_cash
        self.positions = {}  # symbol -> position info
        self.trade_history = []
        self.equity_curve = [{'timestamp': datetime.now(timezone.utc), 'value': initial_cash}]
    
    def open_position(self, symbol: str, quantity: float, price: float, timestamp: datetime = None):
        """Open a new position."""
        try:
            cost = quantity * price
            
            if cost > self.cash:
                logger.warning(f"Insufficient cash to open position: ${cost:.2f} required, ${self.cash:.2f} available")
                return False
            
            self.cash -= cost
            self.positions[symbol] = {
                'quantity': quantity,
                'entry_price': price,
                'entry_time': timestamp or datetime.now(timezone.utc),
                'current_price': price
            }
            
            self.trade_history.append({
                'symbol': symbol,
                'action': 'buy',
                'quantity': quantity,
                'price': price,
                'timestamp': timestamp or datetime.now(timezone.utc),
                'pnl': 0.0,
                'pnl_pct': 0.0
            })
            
            logger.info(f"Opened position: {symbol} x{quantity} @ ${price:.6f}")
            return True
            
        except Exception as e:
            logger.error(f"Error opening position: {e}")
            return False
    
    def close_position(self, symbol: str, price: float, timestamp: datetime = None):
        """Close an existing position."""
        try:
            if symbol not in self.positions:
                logger.warning(f"No open position for {symbol}")
                return False
            
            position = self.positions[symbol]
            quantity = position['quantity']
            entry_price = position['entry_price']
            
            # Calculate P&L
            proceeds = quantity * price
            cost = quantity * entry_price
            pnl = proceeds - cost
            pnl_pct = (price / entry_price - 1) * 100
            
            self.cash += proceeds
            
            self.trade_history.append({
                'symbol': symbol,
                'action': 'sell',
                'quantity': quantity,
                'price': price,
                'timestamp': timestamp or datetime.now(timezone.utc),
                'pnl': pnl,
                'pnl_pct': pnl_pct
            })
            
            del self.positions[symbol]
            
            logger.info(f"Closed position: {symbol} x{quantity} @ ${price:.6f}, PnL: ${pnl:.2f} ({pnl_pct:.2f}%)")
            return True
            
        except Exception as e:
            logger.error(f"Error closing position: {e}")
            return False
    
    def update_position_price(self, symbol: str, current_price: float):
        """Update current price for a position."""
        if symbol in self.positions:
            self.positions[symbol]['current_price'] = current_price
    
    def get_total_value(self) -> float:
        """Calculate total portfolio value."""
        position_value = sum(
            pos['quantity'] * pos['current_price']
            for pos in self.positions.values()
        )
        return self.cash + position_value
    
    def get_metrics(self) -> Dict:
        """Get portfolio performance metrics."""
        try:
            total_value = self.get_total_value()
            total_pnl = total_value - self.initial_cash
            total_pnl_pct = (total_value / self.initial_cash - 1) * 100
            
            # Calculate win rate
            closed_trades = [t for t in self.trade_history if t['action'] == 'sell']
            winning_trades = [t for t in closed_trades if t['pnl'] > 0]
            win_rate = len(winning_trades) / len(closed_trades) if closed_trades else 0.0
            
            return {
                'initial_cash': self.initial_cash,
                'cash': self.cash,
                'total_value': total_value,
                'total_pnl': total_pnl,
                'total_pnl_pct': total_pnl_pct,
                'active_positions': len(self.positions),
                'total_trades': len(closed_trades),
                'win_rate': win_rate
            }
            
        except Exception as e:
            logger.error(f"Error calculating metrics: {e}")
            return {}
    
    def get_position_details(self) -> List[Dict]:
        """Get details of all open positions."""
        positions = []
        for symbol, pos in self.positions.items():
            pnl = pos['quantity'] * (pos['current_price'] - pos['entry_price'])
            pnl_pct = (pos['current_price'] / pos['entry_price'] - 1) * 100
            
            positions.append({
                'symbol': symbol,
                'quantity': pos['quantity'],
                'entry_price': pos['entry_price'],
                'current_price': pos['current_price'],
                'value': pos['quantity'] * pos['current_price'],
                'pnl': pnl,
                'pnl_pct': pnl_pct,
                'entry_time': pos['entry_time'].isoformat() if pos['entry_time'] else None
            })
        
        return positions