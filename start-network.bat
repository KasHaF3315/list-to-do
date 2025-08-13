@echo off
echo ========================================
echo TodoApp Network Access Setup
echo ========================================
echo.

echo This will start your TodoApp for network access from any device.
echo.

echo Step 1: Starting Backend Server...
start "TodoApp Backend" cmd /k "cd /d %~dp0backend && echo Starting Backend Server... && npm run dev"

timeout /t 3

echo Step 2: Starting Frontend Server...
start "TodoApp Frontend" cmd /k "cd /d %~dp0 && echo Starting Frontend Server... && set NEXT_PUBLIC_API_URL=http://%COMPUTERNAME%:5000 && npm run dev -- --hostname 0.0.0.0"

echo.
echo ========================================
echo TodoApp Started for Network Access!
echo ========================================
echo.
echo Your app is now accessible from any device on your network:
echo.
echo Local Access:
echo   http://localhost:3000
echo.
echo Network Access (from other devices):
echo   http://%COMPUTERNAME%:3000
echo   http://[YOUR-IP-ADDRESS]:3000
echo.
echo To find your IP address, run: ipconfig
echo Look for "IPv4 Address" under your network adapter.
echo.
echo Example: If your IP is 192.168.1.100, use:
echo   http://192.168.1.100:3000
echo.
echo Keep both terminal windows open while using the app.
echo.
pause
