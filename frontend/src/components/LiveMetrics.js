import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Volume,
  Clock,
  Zap
} from 'lucide-react';

const LiveMetrics = ({ symbol }) => {
  const [metrics, setMetrics] = useState({
    price: 0,
    change24h: 0,
    volume24h: 0,
    high24h: 0,
    low24h: 0,
    marketCap: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // This would fetch real-time metrics from the API
        // For now, using mock data
        setMetrics({
          price: 47250.50,
          change24h: 2.45,
          volume24h: 2850000000,
          high24h: 47500,
          low24h: 46100,
          marketCap: 920000000000,
          lastUpdate: new Date()
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [symbol]);

  const formatNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Metrics</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Price */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Current Price</p>
          <p className="text-2xl font-bold text-gray-900">
            ${metrics.price.toLocaleString()}
          </p>
          <div className={`flex items-center justify-center space-x-1 mt-1 ${
            metrics.change24h >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.change24h >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {metrics.change24h >= 0 ? '+' : ''}{metrics.change24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* 24h Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600">24h High</p>
            <p className="text-sm font-semibold text-gray-900">
              ${metrics.high24h.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">24h Low</p>
            <p className="text-sm font-semibold text-gray-900">
              ${metrics.low24h.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Volume */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Volume className="h-4 w-4 text-gray-500" />
            <p className="text-xs text-gray-600">24h Volume</p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            ${formatNumber(metrics.volume24h)}
          </p>
        </div>

        {/* Market Cap */}
        <div className="text-center">
          <p className="text-xs text-gray-600">Market Cap</p>
          <p className="text-sm font-semibold text-gray-900">
            ${formatNumber(metrics.marketCap)}
          </p>
        </div>

        {/* Last Update */}
        <div className="text-center pt-2 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-3 w-3 text-gray-400" />
            <p className="text-xs text-gray-500">
              Updated {metrics.lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;
