import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketChart = ({ symbol }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/market/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol: symbol,
            timeframe: '1m',
            limit: 100
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.data.map(item => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            price: parseFloat(item.close),
            volume: parseFloat(item.volume)
          }));
          
          setChartData(formattedData);
          
          if (formattedData.length > 1) {
            const change = ((formattedData[formattedData.length - 1].price - formattedData[0].price) / formattedData[0].price) * 100;
            setPriceChange(change);
          }
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [symbol]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Price Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{symbol}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${chartData[chartData.length - 1]?.price?.toFixed(6) || '0'}
            </span>
            <div className={`flex items-center space-x-1 ${
              priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="h-4 w-4" />
          <span>Live</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb44" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 0.01', 'dataMax + 0.01']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(229,231,235,0.6)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => [
                name === 'price' ? `$${value.toFixed(6)}` : value.toLocaleString(),
                name === 'price' ? 'Price' : 'Volume'
              ]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={priceChange >= 0 ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: priceChange >= 0 ? "#22c55e" : "#ef4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="h-16 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [value.toLocaleString(), 'Volume']}
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#3b82f6"
              strokeWidth={1}
              dot={false}
              fill="url(#volumeGradient)"
            />
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketChart;
