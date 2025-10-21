@echo off
echo ========================================
echo    CryptoQuant AI - Manual Setup
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo Backend dependencies installed!
echo.

echo [2/4] Setting up Frontend...
cd ..\frontend
npm install
echo Frontend dependencies installed!
echo.

echo [3/4] Creating environment file...
cd ..\backend
echo MONGO_URL=mongodb://localhost:27017 > .env
echo DB_NAME=crypto_ai_db >> .env
echo ETHERSCAN_API_KEY=E93F4XZ6EBEHDACUYUR4VNGH258YRGHQ91 >> .env
echo TWITTER_API_KEY=h9FeLgu9uYhFZDysHkkRHlsWU >> .env
echo TWITTER_API_SECRET=tbNG9veNZVkUgDjcb7Z3cK8JMhDJJiKb6LaBIqrXiueMAlnl6J >> .env
echo Environment file created!
echo.

echo [4/4] Starting MongoDB (if installed)...
echo If you see "MongoDB service is not installed", install MongoDB first:
echo Download: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.4-signed.msi
net start MongoDB 2>nul || echo MongoDB service not found - please install MongoDB first
echo.

echo ========================================
echo    Setup Complete! Next Steps:
echo ========================================
echo.
echo 1. Install MongoDB (if not already installed):
echo    Download: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.4-signed.msi
echo.
echo 2. Start Backend (in new Command Prompt):
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn server:app --host 0.0.0.0 --port 8000 --reload
echo.
echo 3. Start Frontend (in another Command Prompt):
echo    cd frontend
echo    npm start
echo.
echo 4. Access your app:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:8000
echo.
pause
