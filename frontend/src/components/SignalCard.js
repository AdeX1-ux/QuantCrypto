import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const SignalCard = ({ signal, symbol, isLoading, onGenerateSignal, onExecuteTrade }) => {
  const getSignalColor = (action) => {
    switch (action) {
      case 'buy': return 'success';
      case 'sell': return 'danger';
      default: return 'warning';
    }
  };

  const getSignalIcon = (action) => {
    switch (action) {
      case 'buy': return TrendingUp;
      case 'sell': return TrendingDown;
      default: return Activity;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOpportunityColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="card relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-60 dark:opacity-30 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-primary-200 to-blue-200 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-200 to-cyan-200 blur-3xl"></div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trading Signal</h3>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-600">AI Powered</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Generating signal...</span>
        </div>
      ) : signal ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Signal Action */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-inner mb-3 ${
              signal.action === 'buy' ? 'bg-green-100' : 
              signal.action === 'sell' ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              {React.createElement(getSignalIcon(signal.action), {
                className: `h-8 w-8 ${
                  signal.action === 'buy' ? 'text-green-600' : 
                  signal.action === 'sell' ? 'text-red-600' : 'text-yellow-600'
                }`
              })}
            </div>
            <h4 className={`text-2xl font-bold ${
              signal.action === 'buy' ? 'text-green-600' : 
              signal.action === 'sell' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {signal.action?.toUpperCase() || 'HOLD'}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{symbol}</p>
          </div>

          {/* Signal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Confidence</p>
              <p className={`text-lg font-semibold ${getConfidenceColor(signal.confidence)}`}>
                {(signal.confidence * 100)?.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Opportunity</p>
              <p className={`text-lg font-semibold ${getOpportunityColor(signal.opportunity_score)}`}>
                {signal.opportunity_score?.toFixed(0) || 0}
              </p>
            </div>
          </div>

          {/* Current Price */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-xl font-bold text-gray-900">
              ${signal.current_price?.toFixed(6) || '0'}
            </p>
          </div>

          {/* AI Insight */}
          {signal.ai_insight && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">AI Analysis</p>
                  <p className="text-sm text-blue-800 mt-1">{signal.ai_insight}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {signal.action === 'buy' && (
              <button
                onClick={() => onExecuteTrade('buy', signal.current_price)}
                className="w-full btn-success flex items-center justify-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Execute BUY Order</span>
              </button>
            )}
            {signal.action === 'sell' && (
              <button
                onClick={() => onExecuteTrade('sell', signal.current_price)}
                className="w-full btn-danger flex items-center justify-center space-x-2"
              >
                <TrendingDown className="h-4 w-4" />
                <span>Execute SELL Order</span>
              </button>
            )}
            {signal.action === 'hold' && (
              <div className="text-center py-2">
                <Clock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No action recommended</p>
              </div>
            )}
          </div>

          {/* Signal Reason */}
          {signal.reason && (
            <div className="text-center">
              <p className="text-xs text-gray-500">{signal.reason}</p>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No signal available</p>
          <button
            onClick={onGenerateSignal}
            className="btn-primary"
          >
            Generate Signal
          </button>
        </div>
      )}

      {/* Generate New Signal Button */}
      {signal && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onGenerateSignal}
            disabled={isLoading}
            className="w-full btn-secondary"
          >
            {isLoading ? 'Generating...' : 'Generate New Signal'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SignalCard;
