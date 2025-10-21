import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TradingContext = createContext();

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

export const TradingProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/portfolio`);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Failed to fetch portfolio data');
    }
  };

  // Generate trading signal
  const generateSignal = async (symbol) => {
    try {
      const response = await axios.post(`${API_BASE}/api/signals/generate`, {
        symbol: symbol
      });
      return response.data;
    } catch (error) {
      console.error('Error generating signal:', error);
      throw new Error('Failed to generate signal');
    }
  };

  // Execute trade
  const executeTrade = async (symbol, action, price) => {
    try {
      const response = await axios.post(`${API_BASE}/api/trade/execute`, {
        symbol: symbol,
        action: action,
        price: price
      });
      
      // Refresh portfolio after trade
      await fetchPortfolio();
      
      return response.data;
    } catch (error) {
      console.error('Error executing trade:', error);
      throw new Error('Failed to execute trade');
    }
  };

  // Train models
  const trainModels = async (symbol) => {
    try {
      const response = await axios.post(`${API_BASE}/api/models/train`, null, {
        params: { symbol: symbol }
      });
      return response.data;
    } catch (error) {
      console.error('Error training models:', error);
      throw new Error('Failed to train models');
    }
  };

  // Get AI analysis
  const getAIAnalysis = async (type, symbol = null) => {
    try {
      const response = await axios.post(`${API_BASE}/api/ai/analyze`, {
        type: type,
        symbol: symbol
      });
      return response.data;
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      throw new Error('Failed to get AI analysis');
    }
  };

  // Get market data
  const getMarketData = async (symbol, timeframe = '1m', limit = 500) => {
    try {
      const response = await axios.post(`${API_BASE}/api/market/data`, {
        symbol: symbol,
        timeframe: timeframe,
        limit: limit
      });
      return response.data;
    } catch (error) {
      console.error('Error getting market data:', error);
      throw new Error('Failed to get market data');
    }
  };

  // Get markets list
  const getMarketsList = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/markets/list`);
      return response.data;
    } catch (error) {
      console.error('Error getting markets list:', error);
      throw new Error('Failed to get markets list');
    }
  };

  // Update configuration
  const updateConfig = async (config) => {
    try {
      const response = await axios.post(`${API_BASE}/api/config/update`, config);
      return response.data;
    } catch (error) {
      console.error('Error updating config:', error);
      throw new Error('Failed to update configuration');
    }
  };

  // Initialize portfolio on mount
  useEffect(() => {
    fetchPortfolio();
    
    // Set up periodic refresh
    const interval = setInterval(fetchPortfolio, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    portfolio,
    isLoading,
    error,
    fetchPortfolio,
    generateSignal,
    executeTrade,
    trainModels,
    getAIAnalysis,
    getMarketData,
    getMarketsList,
    updateConfig
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};
