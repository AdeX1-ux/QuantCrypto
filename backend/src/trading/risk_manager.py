from typing import Dict
import logging

logger = logging.getLogger(__name__)

class RiskManager:
    """Risk management for trading operations."""
    
    def __init__(
        self,
        max_position_size: float = 0.1,  # 10% of portfolio per position
        max_total_exposure: float = 0.5,  # 50% max total exposure
        daily_loss_limit: float = 0.05,  # 5% daily loss limit
        stop_loss_pct: float = 0.15,  # 15% stop loss
        take_profit_pct: float = 0.30  # 30% take profit
    ):
        self.max_position_size = max_position_size
        self.max_total_exposure = max_total_exposure
        self.daily_loss_limit = daily_loss_limit
        self.stop_loss_pct = stop_loss_pct
        self.take_profit_pct = take_profit_pct
        self.daily_start_value = None
    
    def check_can_trade(self, portfolio_value: float, position_cost: float) -> tuple:
        """Check if a new trade is allowed.
        
        Returns: (can_trade: bool, reason: str)
        """
        try:
            # Initialize daily start value if needed
            if self.daily_start_value is None:
                self.daily_start_value = portfolio_value
            
            # Check daily loss limit
            daily_pnl = (portfolio_value / self.daily_start_value - 1)
            if daily_pnl <= -self.daily_loss_limit:
                return False, f"Daily loss limit reached ({daily_pnl:.2%})"
            
            # Check position size limit
            position_size_pct = position_cost / portfolio_value
            if position_size_pct > self.max_position_size:
                return False, f"Position size too large ({position_size_pct:.2%} > {self.max_position_size:.2%})"
            
            return True, "Risk checks passed"
            
        except Exception as e:
            logger.error(f"Error checking risk: {e}")
            return False, "Error in risk check"
    
    def calculate_position_size(
        self,
        portfolio_value: float,
        price: float,
        confidence: float
    ) -> float:
        """Calculate appropriate position size based on confidence and risk.
        
        Uses Kelly Criterion with fractional sizing.
        """
        try:
            # Base position size as percentage of portfolio
            base_size_pct = self.max_position_size * confidence
            
            # Calculate dollar amount
            position_value = portfolio_value * base_size_pct
            
            # Calculate quantity
            quantity = position_value / price
            
            return quantity
            
        except Exception as e:
            logger.error(f"Error calculating position size: {e}")
            return 0.0
    
    def check_exit_conditions(
        self,
        entry_price: float,
        current_price: float
    ) -> Dict:
        """Check if exit conditions are met."""
        try:
            pnl_pct = (current_price / entry_price - 1)
            
            result = {
                'should_exit': False,
                'reason': ''
            }
            
            # Check stop loss
            if pnl_pct <= -self.stop_loss_pct:
                result['should_exit'] = True
                result['reason'] = f"Stop loss triggered ({pnl_pct:.2%})"
                return result
            
            # Check take profit
            if pnl_pct >= self.take_profit_pct:
                result['should_exit'] = True
                result['reason'] = f"Take profit triggered ({pnl_pct:.2%})"
                return result
            
            return result
            
        except Exception as e:
            logger.error(f"Error checking exit conditions: {e}")
            return {'should_exit': False, 'reason': 'Error'}
    
    def reset_daily_tracking(self, current_value: float):
        """Reset daily tracking (call at start of each day)."""
        self.daily_start_value = current_value
        logger.info(f"Daily tracking reset: ${current_value:.2f}")