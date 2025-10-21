import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chart from 'react-apexcharts';
import {
  TrendingUp, TrendingDown, Activity, MessageSquare, Brain, Zap, DollarSign,
  BarChart3, Wallet, Settings, Menu, X, Send, Mic, MicOff, Volume2,
  Twitter, Newspaper, Users, Star, Heart, Share2, ArrowUpRight, ArrowDownRight,
  RefreshCw, Play, Pause, VolumeX, Bell, BellOff, Search, Filter, MoreHorizontal,
  Maximize2, Minimize2, Sun, Moon, VolumeX as VolumeOff, Maximize, Minimize
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws';

// Enhanced mock data with more realistic content
const mockTweets = [
  {
    id: 1,
    user: '@crypto_whale',
    text: 'BTC breaking through $110k resistance! 🚀 This is just the beginning of the bull run. Accumulating more at these levels.',
    sentiment: 'bullish',
    timestamp: new Date().toISOString(),
    likes: 1247,
    retweets: 89,
    verified: true
  },
  {
    id: 2,
    user: '@defi_guru',
    text: 'ETH 2.0 staking rewards looking solid. Accumulating more before the next leg up. DeFi ecosystem expanding rapidly.',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    likes: 892,
    retweets: 45,
    verified: true
  },
  {
    id: 3,
    user: '@sol_trader',
    text: 'SOL ecosystem expanding rapidly. New projects launching daily. Bullish on the long term. This is the future of DeFi.',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    likes: 1567,
    retweets: 123,
    verified: false
  },
  {
    id: 4,
    user: '@doge_king',
    text: 'DOGE to the moon! 🐕 Community is stronger than ever. HODL strong! The memes are becoming reality.',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    likes: 2341,
    retweets: 456,
    verified: true
  },
  {
    id: 5,
    user: '@bear_market',
    text: 'Market looking overextended. Expecting a pullback soon. Risk management is key in these volatile times.',
    sentiment: 'bearish',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    likes: 234,
    retweets: 12,
    verified: false
  }
];

const mockNews = [
  {
    id: 1,
    title: 'Bitcoin ETF Approval Expected This Week - Major Institutional Adoption',
    source: 'CoinDesk',
    sentiment: 'bullish',
    timestamp: new Date().toISOString(),
    category: 'Regulation'
  },
  {
    id: 2,
    title: 'Ethereum Network Upgrade Reduces Gas Fees by 40% - DeFi Activity Surges',
    source: 'CryptoNews',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    category: 'Technology'
  },
  {
    id: 3,
    title: 'Solana Ecosystem Reaches $100B TVL - New DeFi Protocols Launch',
    source: 'DeFi Pulse',
    sentiment: 'bullish',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    category: 'DeFi'
  }
];

const mockAIMessages = [
  {
    id: 1,
    type: 'ai',
    text: 'Market sentiment is extremely bullish. BTC showing strong momentum above $110k. Consider taking partial profits on any positions above 20% gains. Risk management is crucial.',
    timestamp: new Date().toISOString(),
    confidence: 92
  },
  {
    id: 2,
    type: 'ai',
    text: 'ETH/USDT showing consolidation pattern. Good entry point around $3,200-$3,300 range. Support level holding strong.',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    confidence: 87
  },
  {
    id: 3,
    type: 'user',
    text: 'Should I buy more SOL?',
    timestamp: new Date(Date.now() - 1200000).toISOString()
  },
  {
    id: 4,
    type: 'ai',
    text: 'SOL showing strong fundamentals. Current price action suggests potential for 15-20% upside. Risk management: set stop-loss at $180.',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    confidence: 89
  }
];

// Floating Toolbar Component
const FloatingToolbar = ({ isFullscreen, setIsFullscreen, isDarkMode, setIsDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="floating-toolbar"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="toolbar-button"
        title="Toggle Theme"
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="toolbar-button"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize className="w-5 h-5 text-purple-400" /> : <Maximize className="w-5 h-5 text-purple-400" />}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="toolbar-button"
        title="Settings"
      >
        <Settings className="w-5 h-5 text-gray-400" />
      </motion.button>
    </motion.div>
  );
};

// Progress Indicator Component
const ProgressIndicator = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="progress-indicator"
    />
  );
};

// Enhanced Social Feed Component
const SocialFeed = ({ activeTab, setActiveTab }) => {
  const [tweets, setTweets] = useState(mockTweets);
  const [news, setNews] = useState(mockNews);
  const [isPaused, setIsPaused] = useState(false);

  const tabs = [
    { id: 'tweets', label: 'Tweets', icon: Twitter },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'chat', label: 'Community', icon: Users }
  ];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'bearish': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="terminal-column-premium h-full"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-premium-header text-xl">Live Feed</h2>
          <div className="flex items-center space-x-3">
            <div className="live-indicator">LIVE</div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPaused(!isPaused)}
              className="w-8 h-8 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center"
            >
              {isPaused ? <Play className="w-4 h-4 text-purple-400" /> : <Pause className="w-4 h-4 text-purple-400" />}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex space-x-2 bg-black/30 rounded-xl p-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Feed Content */}
      <div className="card-premium p-6 flex-1 overflow-hidden">
        <div className="social-feed-premium scrollbar-premium">
          <AnimatePresence>
            {activeTab === 'tweets' && tweets.map((tweet, index) => (
              <motion.div
                key={tweet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="social-item-premium hover-lift"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                      {tweet.user.charAt(1).toUpperCase()}
                    </div>
                    {tweet.verified && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Star className="w-2 h-2 text-white fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-premium text-sm font-medium">{tweet.user}</span>
                      <span className="text-premium-secondary text-xs">
                        {new Date(tweet.timestamp).toLocaleTimeString()}
                      </span>
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs border ${getSentimentColor(tweet.sentiment)}`}>
                        {getSentimentIcon(tweet.sentiment)}
                        <span className="font-medium">{tweet.sentiment}</span>
                      </div>
                    </div>
                    <p className="text-premium-secondary text-sm mb-3 leading-relaxed">{tweet.text}</p>
                    <div className="flex items-center space-x-6 text-xs text-gray-400">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        <span>{tweet.likes}</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{tweet.retweets}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeTab === 'news' && news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="social-item-premium hover-lift"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                    N
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-premium text-sm font-medium">{item.source}</span>
                      <span className="text-premium-secondary text-xs">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs border ${getSentimentColor(item.sentiment)}`}>
                        {getSentimentIcon(item.sentiment)}
                        <span className="font-medium">{item.sentiment}</span>
                      </div>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-premium-secondary text-sm leading-relaxed">{item.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float-premium">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-premium-header text-lg mb-2">Community Chat</h3>
                <p className="text-premium-secondary">Coming soon! Join the conversation with fellow traders.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Market Dashboard Component
const MarketDashboard = () => {
  const [marketData, setMarketData] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const symbols = [
    { symbol: 'BTC/USDT', name: 'Bitcoin', color: 'from-orange-500 to-yellow-500', icon: '₿' },
    { symbol: 'ETH/USDT', name: 'Ethereum', color: 'from-blue-500 to-purple-500', icon: 'Ξ' },
    { symbol: 'SOL/USDT', name: 'Solana', color: 'from-purple-500 to-pink-500', icon: '◎' },
    { symbol: 'DOGE/USDT', name: 'Dogecoin', color: 'from-yellow-500 to-orange-500', icon: 'Ð' }
  ];

  const fetchMarketData = useCallback(async () => {
    setIsUpdating(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/market-data`);
      setMarketData(response.data);
    } catch (err) {
      console.error("Error fetching market data:", err);
      // Enhanced fallback data
      setMarketData([
        { symbol: 'BTC/USDT', price: 109585, change: 2.34, volume: '45.2M', high_24h: 110200, low_24h: 107500 },
        { symbol: 'ETH/USDT', price: 3250, change: 1.87, volume: '23.1M', high_24h: 3280, low_24h: 3180 },
        { symbol: 'SOL/USDT', price: 195, change: 5.23, volume: '12.8M', high_24h: 198, low_24h: 185 },
        { symbol: 'DOGE/USDT', price: 0.085, change: -1.45, volume: '8.9M', high_24h: 0.088, low_24h: 0.082 }
      ]);
    }
    setIsUpdating(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const generateChartData = (symbol) => {
    const data = marketData.find(item => item.symbol === symbol);
    if (!data) return null;

    const prices = [];
    const times = [];
    let currentPrice = data.price;
    
    for (let i = 24; i >= 0; i--) {
      const time = new Date(Date.now() - i * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * data.price * 0.02;
      currentPrice += variation;
      prices.push(currentPrice);
      times.push(time.toLocaleTimeString());
    }

    return {
      series: [{
        name: symbol,
        data: prices
      }],
      options: {
        chart: {
          type: 'line',
          height: 350,
          background: 'transparent',
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        stroke: {
          curve: 'smooth',
          width: 4,
          colors: ['#8b5cf6']
        },
        colors: ['#8b5cf6'],
        grid: {
          borderColor: 'rgba(139, 92, 246, 0.1)',
          strokeDashArray: 4,
          xaxis: { lines: { show: true } },
          yaxis: { lines: { show: true } }
        },
        xaxis: {
          categories: times,
          labels: { 
            style: { colors: '#9ca3af', fontSize: '12px' },
            rotate: 0
          }
        },
        yaxis: {
          labels: { 
            style: { colors: '#9ca3af', fontSize: '12px' },
            formatter: (value) => `$${value.toLocaleString()}`
          }
        },
        tooltip: {
          theme: 'dark',
          style: { fontSize: '12px' },
          fillSeriesColor: false,
          marker: { show: true },
          x: { show: true },
          y: { 
            formatter: (value) => `$${value.toLocaleString()}`,
            title: { formatter: () => 'Price' }
          }
        },
        markers: {
          size: 0,
          hover: { size: 6 }
        }
      }
    };
  };

  const getSymbolData = (symbol) => {
    return marketData.find(item => item.symbol === symbol) || {
      symbol,
      price: 0,
      change: 0,
      volume: '0M',
      high_24h: 0,
      low_24h: 0
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-column-premium h-full"
    >
      {/* Enhanced Market Cards */}
      <div className="grid grid-cols-2 gap-6">
        {symbols.map((item) => {
          const data = getSymbolData(item.symbol);
          const changeColor = data.change >= 0 ? 'text-green-400' : 'text-red-400';
          const changeIcon = data.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
          const isActive = selectedSymbol === item.symbol;
          
          return (
            <motion.div
              key={item.symbol}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`card-premium p-6 cursor-pointer transition-all duration-300 ${
                isActive ? 'card-premium-active' : ''
              }`}
              onClick={() => setSelectedSymbol(item.symbol)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-premium text-sm font-medium">{item.symbol}</h3>
                    <p className="text-premium-secondary text-xs">{item.name}</p>
                  </div>
                </div>
                <motion.div 
                  className={`flex items-center space-x-1 text-sm font-medium ${changeColor}`}
                  animate={{ scale: isUpdating ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {changeIcon}
                  <span>{data.change.toFixed(2)}%</span>
                </motion.div>
              </div>
              <div className="space-y-2">
                <motion.p 
                  className="text-premium text-2xl font-bold"
                  animate={{ scale: isUpdating ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ${data.price.toLocaleString()}
                </motion.p>
                <div className="flex justify-between text-xs text-premium-secondary">
                  <span>Vol: {data.volume}</span>
                  <span>H: ${data.high_24h.toLocaleString()}</span>
                  <span>L: ${data.low_24h.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-premium p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-premium-header text-lg">{selectedSymbol} Chart</h3>
          <div className="flex items-center space-x-2">
            {['1H', '4H', '1D'].map((timeframe) => (
              <motion.button
                key={timeframe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-premium px-4 py-2 text-sm"
              >
                {timeframe}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="chart-container-premium">
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-8 h-8 text-purple-400" />
              </motion.div>
            </div>
          ) : (
            <Chart
              options={generateChartData(selectedSymbol)?.options}
              series={generateChartData(selectedSymbol)?.series}
              type="line"
              height={350}
            />
          )}
        </div>
      </motion.div>

      {/* Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-6"
      >
        <h3 className="text-premium-header text-lg mb-6">Market Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <p className="text-premium-secondary text-sm">Fear & Greed Index</p>
            <p className="text-green-400 text-xl font-bold">78</p>
            <p className="text-green-400 text-xs">Extreme Greed</p>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <p className="text-premium-secondary text-sm">Market Cap</p>
            <p className="text-premium text-lg font-bold">$2.1T</p>
            <p className="text-green-400 text-xs">+5.2%</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


// Enhanced AI Assistant Component with Buy/Sell and Portfolio
const AIAssistant = () => {
  const [messages, setMessages] = useState(mockAIMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');

  const symbols = [
    { symbol: 'BTC/USDT', name: 'Bitcoin', color: 'from-orange-500 to-yellow-500', icon: '₿' },
    { symbol: 'ETH/USDT', name: 'Ethereum', color: 'from-blue-500 to-purple-500', icon: 'Ξ' },
    { symbol: 'SOL/USDT', name: 'Solana', color: 'from-purple-500 to-pink-500', icon: '◎' },
    { symbol: 'DOGE/USDT', name: 'Dogecoin', color: 'from-yellow-500 to-orange-500', icon: 'Ð' }
  ];

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simulate AI response with typing animation
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'I\'m analyzing the market data. Based on current trends, I recommend monitoring the $110k resistance level for BTC. The momentum looks strong but risk management is key.',
        timestamp: new Date().toISOString(),
        confidence: 88
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="terminal-column-premium h-full"
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="ai-avatar">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-premium-header text-lg">AI Trading Guru</h2>
              <p className="text-premium-secondary text-xs">Your personal trading mentor</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-7 h-7 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors flex items-center justify-center"
          >
            {isExpanded ? <X className="w-3 h-3 text-purple-400" /> : <Menu className="w-3 h-3 text-purple-400" />}
          </motion.button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="live-indicator">ACTIVE</div>
          <div className="flex items-center space-x-2 text-xs text-premium-secondary">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>{isTyping ? 'Typing...' : 'Analyzing market...'}</span>
          </div>
        </div>
      </motion.div>

      {isExpanded && (
        <>
          {/* Enhanced Chat Messages */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium p-4 flex-1 overflow-hidden"
          >
            <div className="ai-chat h-64 overflow-y-auto scrollbar-premium">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`mb-3 ${
                      message.type === 'user' ? 'user-message-bubble' : 'ai-message-bubble'
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{message.text}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                      {message.confidence && (
                        <span className="text-xs text-purple-400 font-medium">
                          {message.confidence}%
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ai-message-bubble"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-400">AI is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Message Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-4"
          >
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask your AI mentor..."
                className="flex-1 bg-black/30 border border-purple-500/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={`w-8 h-8 rounded-lg transition-colors flex items-center justify-center ${
                  isListening 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                }`}
              >
                {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                className="btn-premium p-2"
              >
                <Send className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>

          {/* Symbol Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-4"
          >
            <h3 className="text-premium-header text-sm mb-3">Select Symbol</h3>
            <div className="grid grid-cols-2 gap-2">
              {symbols.map((item) => (
                <motion.button
                  key={item.symbol}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`p-2 rounded-lg transition-all text-xs ${
                    selectedSymbol === item.symbol 
                      ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-500/50' 
                      : 'bg-black/20 border border-gray-500/30 hover:border-purple-500/30'
                  }`}
                >
                  <div className={`w-6 h-6 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white text-xs font-bold mx-auto mb-1`}>
                    {item.icon}
                  </div>
                  <p className="text-premium text-xs font-medium">{item.symbol}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Trading Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-4"
          >
            <h3 className="text-premium-header text-sm mb-3">Trading Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-buy w-full flex items-center justify-center space-x-2 py-3 px-3 text-white font-medium text-sm"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Buy {selectedSymbol}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-sell w-full flex items-center justify-center space-x-2 py-3 px-3 text-white font-medium text-sm"
              >
                <TrendingDown className="w-4 h-4" />
                <span>Sell {selectedSymbol}</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Portfolio Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-4"
          >
            <h3 className="text-premium-header text-sm mb-3">Portfolio</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-premium-secondary text-xs">Total Balance</span>
                <span className="text-premium text-sm font-bold">$12,450.00</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-premium-secondary text-xs">24h P&L</span>
                <div className="text-right">
                  <span className="text-green-400 text-sm font-bold">+$1,234.50</span>
                  <p className="text-green-400 text-xs">(+9.9%)</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-premium-secondary text-xs">Open Positions</span>
                <span className="text-premium text-sm font-bold">3</span>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs text-premium-secondary mb-1">
                  <span>Portfolio Health</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('tweets');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading on mount
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <div className="trading-terminal-premium">
      <ProgressIndicator isLoading={isLoading} />
      
      {/* Enhanced Top Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-6 m-8 mb-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-glow-premium">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-premium-header text-3xl font-space">CryptoQuant AI</h1>
                <p className="text-premium-secondary text-sm">Professional Trading Terminal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  isLiveMode 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">Live Mode</span>
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="toolbar-button"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Main Terminal Grid */}
      <div className="terminal-grid-premium">
        {/* Left Column - Social Feed */}
        <div className="social-column-premium">
          <SocialFeed activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Middle Column - Market Dashboard */}
        <div className="main-column-premium">
          <MarketDashboard />
        </div>

        {/* Right Column - AI Assistant with Buy/Sell/Portfolio */}
        <div className="ai-column-premium">
          <AIAssistant />
        </div>
      </div>

      {/* Floating Toolbar */}
      <FloatingToolbar 
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  );
}

export default App;