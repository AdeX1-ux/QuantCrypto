@echo off
echo ========================================
echo    Starting CryptoQuant AI System
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\adeen\OneDrive\Desktop\cryptio\.emergent\backend && venv\Scripts\uvicorn server:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Frontend Server" cmd /k "cd /d C:\Users\adeen\OneDrive\Desktop\cryptio\.emergent\frontend && npm start"

echo.
echo ========================================
echo    Services Starting...
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Both windows will open automatically.
echo Close this window when done.
echo.
pause