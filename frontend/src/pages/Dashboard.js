import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import MarketChart from '../components/MarketChart';
import SignalCard from '../components/SignalCard';
import TradingPanel from '../components/TradingPanel';
import LiveMetrics from '../components/LiveMetrics';
import { useTrading } from '../contexts/TradingContext';
import { useSocket } from '../contexts/SocketContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { portfolio, generateSignal, executeTrade } = useTrading();
  const { isConnected } = useSocket();
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');
  const [currentSignal, setCurrentSignal] = useState(null);
  const [isGeneratingSignal, setIsGeneratingSignal] = useState(false);
  const [marketData, setMarketData] = useState(null);

  const symbols = [
    'BTC/USDT', 'ETH/USDT', 'DOGE/USDT', 'SHIB/USDT', 
    'PEPE/USDT', 'FLOKI/USDT', 'BNB/USDT', 'SOL/USDT'
  ];

  const handleGenerateSignal = async () => {
    setIsGeneratingSignal(true);
    try {
      const signal = await generateSignal(selectedSymbol);
      setCurrentSignal(signal);
      toast.success('Signal generated successfully!');
    } catch (error) {
      toast.error('Failed to generate signal');
    } finally {
      setIsGeneratingSignal(false);
    }
  };

  const handleExecuteTrade = async (action, price) => {
    try {
      await executeTrade(selectedSymbol, action, price);
      toast.success(`${action.toUpperCase()} order executed!`);
    } catch (error) {
      toast.error(`Failed to execute ${action} order`);
    }
  };

  const getSignalColor = (signal) => {
    if (!signal) return 'gray';
    switch (signal.action) {
      case 'buy': return 'success';
      case 'sell': return 'danger';
      default: return 'warning';
    }
  };

  const getSignalIcon = (signal) => {
    if (!signal) return Clock;
    switch (signal.action) {
      case 'buy': return TrendingUp;
      case 'sell': return TrendingDown;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CryptoQuant AI Dashboard</h1>
              <p className="text-sm text-gray-600">AI-Powered Crypto Trading Assistant</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="metric-card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${portfolio?.metrics?.total_value?.toLocaleString() || '0'}
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total P&L</p>
                <p className={`text-2xl font-bold ${portfolio?.metrics?.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${portfolio?.metrics?.total_pnl?.toFixed(2) || '0'}
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
                  {(portfolio?.metrics?.win_rate * 100)?.toFixed(1) || '0'}%
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
                  {portfolio?.metrics?.active_positions || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Market Analysis</h2>
                <div className="flex space-x-2">
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="input-field w-auto"
                  >
                    {symbols.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                </div>
              </div>
              <MarketChart symbol={selectedSymbol} />
            </motion.div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Current Signal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <SignalCard
                signal={currentSignal}
                symbol={selectedSymbol}
                isLoading={isGeneratingSignal}
                onGenerateSignal={handleGenerateSignal}
                onExecuteTrade={handleExecuteTrade}
              />
            </motion.div>

            {/* Live Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <LiveMetrics symbol={selectedSymbol} />
            </motion.div>
          </div>
        </div>

        {/* Recent Trades */}
        {portfolio?.recent_trades && portfolio.recent_trades.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        P&L
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {portfolio.recent_trades.slice(0, 5).map((trade, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trade.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`status-indicator ${
                            trade.action === 'buy' ? 'status-success' : 'status-danger'
                          }`}>
                            {trade.action.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${trade.price?.toFixed(6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ${trade.pnl?.toFixed(2)} ({trade.pnl_pct?.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
