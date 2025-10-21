// MongoDB initialization script
db = db.getSiblingDB('crypto_ai_db');

// Create collections
db.createCollection('market_data');
db.createCollection('signals');
db.createCollection('portfolio');
db.createCollection('ai_insights');
db.createCollection('user_settings');

// Create indexes for better performance
db.market_data.createIndex({ "symbol": 1, "timestamp": -1 });
db.signals.createIndex({ "symbol": 1, "timestamp": -1 });
db.portfolio.createIndex({ "user_id": 1 });
db.ai_insights.createIndex({ "timestamp": -1 });

print('MongoDB initialization completed successfully!');
