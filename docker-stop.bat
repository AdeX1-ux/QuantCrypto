@echo off
echo Stopping Crypto AI Trading System...
echo.

REM Stop and remove containers
docker-compose down

echo.
echo ========================================
echo Crypto AI Trading System stopped
echo ========================================
echo.
echo To start again: docker-start.bat
echo To remove volumes: docker-compose down -v
echo.

pause
