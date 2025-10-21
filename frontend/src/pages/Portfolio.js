import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Target,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Portfolio = () => {
  // This would be connected to the TradingContext in a real implementation
  const mockPortfolio = {
    metrics: {
      total_value: 12500.50,
      cash: 2500.00,
      total_pnl: 2500.50,
      total_pnl_pct: 25.0,
      active_positions: 3,
      total_trades: 15,
      win_rate: 0.73
    },
    positions: [
      {
        symbol: 'BTC/USDT',
        quantity: 0.1,
        entry_price: 45000,
        current_price: 47000,
        value: 4700,
        pnl: 200,
        pnl_pct: 4.44,
        entry_time: '2024-01-15T10:30:00Z'
      },
      {
        symbol: 'ETH/USDT',
        quantity: 2.5,
        entry_price: 2800,
        current_price: 2950,
        value: 7375,
        pnl: 375,
        pnl_pct: 5.36,
        entry_time: '2024-01-16T14:20:00Z'
      },
      {
        symbol: 'DOGE/USDT',
        quantity: 10000,
        entry_price: 0.08,
        current_price: 0.085,
        value: 850,
        pnl: 50,
        pnl_pct: 6.25,
        entry_time: '2024-01-17T09:15:00Z'
      }
    ],
    recent_trades: [
      {
        symbol: 'SHIB/USDT',
        action: 'sell',
        quantity: 5000000,
        price: 0.000012,
        timestamp: '2024-01-17T16:45:00Z',
        pnl: 150,
        pnl_pct: 12.5
      },
      {
        symbol: 'PEPE/USDT',
        action: 'buy',
        quantity: 10000000,
        price: 0.0000015,
        timestamp: '2024-01-17T15:30:00Z',
        pnl: 0,
        pnl_pct: 0
      }
    ]
  };

  const getPnLColor = (pnl) => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPnLIcon = (pnl) => {
    return pnl >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Overview</h1>
            <p className="text-sm text-gray-600">Track your trading performance and positions</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="metric-card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${mockPortfolio.metrics.total_value.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="metric-card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total P&L</p>
                <p className={`text-2xl font-bold ${getPnLColor(mockPortfolio.metrics.total_pnl)}`}>
                  ${mockPortfolio.metrics.total_pnl.toFixed(2)}
                </p>
                <p className={`text-sm ${getPnLColor(mockPortfolio.metrics.total_pnl)}`}>
                  {mockPortfolio.metrics.total_pnl_pct.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="metric-card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(mockPortfolio.metrics.win_rate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">
                  {mockPortfolio.metrics.total_trades} trades
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="metric-card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Positions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockPortfolio.metrics.active_positions}
                </p>
                <p className="text-sm text-gray-500">
                  ${mockPortfolio.metrics.total_value - mockPortfolio.metrics.cash} invested
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Positions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Positions</h2>
            <div className="space-y-4">
              {mockPortfolio.positions.map((position, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{position.symbol}</h3>
                      <p className="text-sm text-gray-600">
                        {position.quantity} @ ${position.entry_price.toFixed(6)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${position.current_price.toFixed(6)}
                      </p>
                      <div className={`flex items-center space-x-1 ${getPnLColor(position.pnl)}`}>
                        {React.createElement(getPnLIcon(position.pnl), { className: "h-4 w-4" })}
                        <span className="text-sm font-medium">
                          ${position.pnl.toFixed(2)} ({position.pnl_pct.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Value: ${position.value.toFixed(2)}</span>
                    <span>Entry: {new Date(position.entry_time).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Trades */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h2>
            <div className="space-y-3">
              {mockPortfolio.recent_trades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${
                      trade.action === 'buy' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {trade.action === 'buy' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{trade.symbol}</p>
                      <p className="text-sm text-gray-600">
                        {trade.action.toUpperCase()} {trade.quantity.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${trade.price.toFixed(6)}
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-500">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
