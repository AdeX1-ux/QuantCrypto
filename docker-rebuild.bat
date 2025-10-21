@echo off
echo Rebuilding Crypto AI Trading System...
echo.

REM Stop existing containers
echo Stopping existing containers...
docker-compose down

REM Remove old images
echo Removing old images...
docker-compose down --rmi all

REM Rebuild and start
echo Rebuilding and starting services...
docker-compose up -d --build

REM Wait for services to start
timeout /t 10 /nobreak >nul

REM Show status
echo.
echo Service Status:
docker-compose ps

echo.
echo ========================================
echo Crypto AI Trading System rebuilt and started
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo MongoDB: localhost:27017
echo.

pause
