@echo off
echo ========================================
echo    CryptoQuant AI - Starting System
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\adeen\OneDrive\Desktop\cryptio\.emergent\backend && .\venv\Scripts\uvicorn server:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend...
start "Frontend Server" cmd /k "cd /d C:\Users\adeen\OneDrive\Desktop\cryptio\.emergent\frontend && npm start"

echo.
echo ========================================
echo    Opening Web Applications...
echo ========================================
echo.

echo Opening Frontend Dashboard...
start http://localhost:3000

echo Opening API Documentation...
start http://localhost:8000/docs

echo.
echo ========================================
echo    System Status
echo ========================================
echo.
echo ✅ Backend: http://localhost:8000
echo ✅ Frontend: http://localhost:3000
echo ✅ API Docs: http://localhost:8000/docs
echo.
echo Both services are starting in separate windows.
echo The web applications should open automatically.
echo.
echo Press any key to close this window...
pause >nul

