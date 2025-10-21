@echo off
echo ========================================
echo    CryptoQuant AI - Cloud Setup
echo ========================================
echo.

echo [1/3] Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo Backend dependencies installed!
echo.

echo [2/3] Setting up Frontend...
cd ..\frontend
npm install
echo Frontend dependencies installed!
echo.

echo [3/3] Creating environment file for MongoDB Atlas...
cd ..\backend
echo # MongoDB Atlas Connection (replace with your Atlas URI)
echo MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/crypto_ai_db?retryWrites=true^&w=majority > .env
echo DB_NAME=crypto_ai_db >> .env
echo ETHERSCAN_API_KEY=E93F4XZ6EBEHDACUYUR4VNGH258YRGHQ91 >> .env
echo TWITTER_API_KEY=h9FeLgu9uYhFZDysHkkRHlsWU >> .env
echo TWITTER_API_SECRET=tbNG9veNZVkUgDjcb7Z3cK8JMhDJJiKb6LaBIqrXiueMAlnl6J >> .env
echo.
echo Environment file created!
echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo.
echo 1. Get FREE MongoDB Atlas cluster:
echo    Go to: https://cloud.mongodb.com/
echo    Create account and free cluster
echo    Get connection string
echo.
echo 2. Update backend/.env with your Atlas URI:
echo    Replace the MONGO_URL line with your Atlas connection string
echo.
echo 3. Start Backend (in new Command Prompt):
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn server:app --host 0.0.0.0 --port 8000 --reload
echo.
echo 4. Start Frontend (in another Command Prompt):
echo    cd frontend
echo    npm start
echo.
echo 5. Access your app:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:8000
echo.
pause
