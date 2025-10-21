@echo off
echo Starting Crypto AI Trading System with Docker...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Start the services
echo Starting services...
docker-compose up -d

REM Wait a moment for services to start
timeout /t 5 /nobreak >nul

REM Show status
echo.
echo Service Status:
docker-compose ps

echo.
echo ========================================
echo Crypto AI Trading System is starting...
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo MongoDB: localhost:27017
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.

pause
