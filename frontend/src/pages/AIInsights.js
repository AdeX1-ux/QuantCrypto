import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import toast from 'react-hot-toast';

const AIInsights = () => {
  const { getAIAnalysis, portfolio } = useTrading();
  const [portfolioAnalysis, setPortfolioAnalysis] = useState(null);
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);

  const fetchPortfolioAnalysis = async () => {
    setIsLoadingPortfolio(true);
    try {
      const analysis = await getAIAnalysis('portfolio');
      setPortfolioAnalysis(analysis);
      toast.success('Portfolio analysis updated');
    } catch (error) {
      toast.error('Failed to fetch portfolio analysis');
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  const fetchMarketAnalysis = async () => {
    setIsLoadingMarket(true);
    try {
      const analysis = await getAIAnalysis('market');
      setMarketAnalysis(analysis);
      toast.success('Market analysis updated');
    } catch (error) {
      toast.error('Failed to fetch market analysis');
    } finally {
      setIsLoadingMarket(false);
    }
  };

  useEffect(() => {
    fetchPortfolioAnalysis();
    fetchMarketAnalysis();
  }, []);

  const mockInsights = {
    portfolio: {
      analysis: "Your portfolio shows strong performance with a 25% return. The AI recommends diversifying into more stable assets and reducing position sizes in volatile meme coins. Consider taking profits on BTC and ETH positions while maintaining exposure to DOGE.",
      recommendations: [
        "Take 50% profit on BTC position",
        "Reduce DOGE position size by 30%",
        "Consider adding SOL/USDT for diversification",
        "Set stop-loss at 10% for all positions"
      ],
      riskScore: 7.2,
      opportunityScore: 8.5
    },
    market: {
      analysis: "Current market conditions show bullish sentiment with increasing volume. Meme coins are experiencing a surge in social media activity. The AI detects potential pump opportunities in PEPE and FLOKI tokens.",
      trends: [
        "Meme coin volume up 150%",
        "Social sentiment extremely positive",
        "Whale accumulation detected",
        "Technical indicators bullish"
      ],
      topOpportunities: [
        { symbol: "PEPE/USDT", score: 85, reason: "Social buzz + volume surge" },
        { symbol: "FLOKI/USDT", score: 78, reason: "Whale accumulation" },
        { symbol: "SHIB/USDT", score: 72, reason: "Technical breakout" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
                <p className="text-sm text-gray-600">Powered by Claude Sonnet 4</p>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">AI Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Portfolio Analysis</h2>
            </div>
            <button
              onClick={fetchPortfolioAnalysis}
              disabled={isLoadingPortfolio}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingPortfolio ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {isLoadingPortfolio ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Analyzing portfolio...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Analysis Text */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-2">AI Analysis</p>
                    <p className="text-sm text-blue-800">
                      {portfolioAnalysis?.analysis || mockInsights.portfolio.analysis}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk & Opportunity Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Risk Score</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">
                    {mockInsights.portfolio.riskScore}/10
                  </div>
                  <p className="text-sm text-gray-500">Moderate Risk</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Opportunity Score</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {mockInsights.portfolio.opportunityScore}/10
                  </div>
                  <p className="text-sm text-gray-500">High Opportunity</p>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">AI Recommendations</h3>
                <div className="space-y-2">
                  {mockInsights.portfolio.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Market Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Market Analysis</h2>
            </div>
            <button
              onClick={fetchMarketAnalysis}
              disabled={isLoadingMarket}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingMarket ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {isLoadingMarket ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Analyzing market...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Market Analysis Text */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-2">Market Overview</p>
                    <p className="text-sm text-green-800">
                      {marketAnalysis?.analysis || mockInsights.market.analysis}
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Trends */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Key Trends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockInsights.market.trends.map((trend, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{trend}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Opportunities */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Top Opportunities</h3>
                <div className="space-y-3">
                  {mockInsights.market.topOpportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Target className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{opportunity.symbol}</p>
                          <p className="text-sm text-gray-600">{opportunity.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {opportunity.score}/100
                        </div>
                        <p className="text-sm text-gray-500">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* AI Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">AI Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
              <p className="text-sm text-gray-600">Signal Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-sm text-gray-600">Monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
              <p className="text-sm text-gray-600">Signals Generated</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIInsights;
