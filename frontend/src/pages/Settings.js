import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Key, 
  Shield, 
  Bell,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { updateConfig } = useTrading();
  const [activeTab, setActiveTab] = useState('api-keys');
  const [isSaving, setIsSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState({});

  const [config, setConfig] = useState({
    binance_api_key: '',
    binance_api_secret: '',
    twitter_api_key: 'h9FeLgu9uYhFZDysHkkRHlsWU',
    twitter_api_secret: 'tbNG9veNZVkUgDjcb7Z3cK8JMhDJJiKb6LaBIqrXiueMAlnl6J',
    twitter_bearer_token: '',
    reddit_client_id: '',
    reddit_client_secret: '',
    etherscan_api_key: 'E93F4XZ6EBEHDACUYUR4VNGH258YRGHQ91',
    infura_project_id: '',
    paper_trading: true,
    max_position_size: 0.1,
    daily_loss_limit: 0.05,
    stop_loss_pct: 0.15,
    take_profit_pct: 0.30
  });

  const tabs = [
    { id: 'api-keys', name: 'API Keys', icon: Key },
    { id: 'trading', name: 'Trading Settings', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig(config);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSecretVisibility = (field) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const SecretInput = ({ field, label, value, placeholder }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showSecrets[field] ? 'text' : 'password'}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="input-field pr-10"
        />
        <button
          type="button"
          onClick={() => toggleSecretVisibility(field)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showSecrets[field] ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600">Configure your trading parameters and API keys</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-900 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                  } w-full flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-colors duration-200`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              {/* API Keys Tab */}
              {activeTab === 'api-keys' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <SettingsIcon className="h-6 w-6 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">API Keys Configuration</h2>
                  </div>

                  {/* Exchange APIs */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">Exchange APIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SecretInput
                        field="binance_api_key"
                        label="Binance API Key"
                        value={config.binance_api_key}
                        placeholder="Enter your Binance API key"
                      />
                      <SecretInput
                        field="binance_api_secret"
                        label="Binance API Secret"
                        value={config.binance_api_secret}
                        placeholder="Enter your Binance API secret"
                      />
                    </div>
                  </div>

                  {/* Social Media APIs */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">Social Media APIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SecretInput
                        field="twitter_api_key"
                        label="Twitter API Key"
                        value={config.twitter_api_key}
                        placeholder="Enter your Twitter API key"
                      />
                      <SecretInput
                        field="twitter_api_secret"
                        label="Twitter API Secret"
                        value={config.twitter_api_secret}
                        placeholder="Enter your Twitter API secret"
                      />
                      <SecretInput
                        field="twitter_bearer_token"
                        label="Twitter Bearer Token"
                        value={config.twitter_bearer_token}
                        placeholder="Enter your Twitter bearer token"
                      />
                      <SecretInput
                        field="reddit_client_id"
                        label="Reddit Client ID"
                        value={config.reddit_client_id}
                        placeholder="Enter your Reddit client ID"
                      />
                      <SecretInput
                        field="reddit_client_secret"
                        label="Reddit Client Secret"
                        value={config.reddit_client_secret}
                        placeholder="Enter your Reddit client secret"
                      />
                    </div>
                  </div>

                  {/* On-Chain APIs */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">On-Chain APIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SecretInput
                        field="etherscan_api_key"
                        label="Etherscan API Key"
                        value={config.etherscan_api_key}
                        placeholder="Enter your Etherscan API key"
                      />
                      <SecretInput
                        field="infura_project_id"
                        label="Infura Project ID"
                        value={config.infura_project_id}
                        placeholder="Enter your Infura project ID"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Trading Settings Tab */}
              {activeTab === 'trading' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="h-6 w-6 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Trading Settings</h2>
                  </div>

                  {/* Trading Mode */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">Trading Mode</h3>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="trading_mode"
                          checked={config.paper_trading}
                          onChange={() => handleInputChange('paper_trading', true)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Paper Trading (Recommended)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="trading_mode"
                          checked={!config.paper_trading}
                          onChange={() => handleInputChange('paper_trading', false)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Live Trading</span>
                      </label>
                    </div>
                    {!config.paper_trading && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800">Live Trading Warning</p>
                            <p className="text-sm text-red-700">
                              Live trading involves real money and significant risk. Make sure you understand the risks before enabling.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Risk Management */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">Risk Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Position Size (%)
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          max="1"
                          step="0.01"
                          value={config.max_position_size}
                          onChange={(e) => handleInputChange('max_position_size', parseFloat(e.target.value))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Loss Limit (%)
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          max="1"
                          step="0.01"
                          value={config.daily_loss_limit}
                          onChange={(e) => handleInputChange('daily_loss_limit', parseFloat(e.target.value))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stop Loss (%)
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          max="1"
                          step="0.01"
                          value={config.stop_loss_pct}
                          onChange={(e) => handleInputChange('stop_loss_pct', parseFloat(e.target.value))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Take Profit (%)
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          max="10"
                          step="0.01"
                          value={config.take_profit_pct}
                          onChange={(e) => handleInputChange('take_profit_pct', parseFloat(e.target.value))}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Bell className="h-6 w-6 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
                  </div>

                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications Coming Soon</h3>
                    <p className="text-gray-600">
                      Email and SMS notifications for trading signals and portfolio updates will be available soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
