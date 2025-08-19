@echo off
setlocal enabledelayedexpansion

echo ========================================
echo TodoApp Universal Access Setup
echo ========================================
echo.

echo Detecting your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    if not "!ip!"=="" (
        echo Found IP: !ip!
        goto :found_ip
    )
)

:found_ip
if "!ip!"=="" (
    set "ip=localhost"
    echo Could not detect IP, using localhost
)

echo.
echo Setting up environment for universal access...
echo API URL will be: http://!ip!:5000
echo.

echo Step 1: Creating environment file...
echo NEXT_PUBLIC_API_URL=http://!ip!:5000 > .env.local

echo Step 2: Starting Backend Server (accessible from network)...
start "TodoApp Backend" cmd /k "cd /d %~dp0backend && echo Backend Server Starting... && echo Accessible at: http://!ip!:5000 && echo. && npm run dev"

timeout /t 5

echo Step 3: Starting Frontend Server (accessible from network)...
start "TodoApp Frontend" cmd /k "cd /d %~dp0 && echo Frontend Server Starting... && echo Accessible at: http://!ip!:3000 && echo. && npm run dev -- --hostname 0.0.0.0"

echo.
echo ========================================
echo TodoApp is now accessible from ANY device!
echo ========================================
echo.
echo Access URLs:
echo.
echo From this computer:
echo   http://localhost:3000
echo.
echo From other devices on your network:
echo   http://!ip!:3000
echo.
echo From mobile devices (same WiFi):
echo   http://!ip!:3000
echo.
echo Backend API:
echo   http://!ip!:5000
echo.
echo ========================================
echo Instructions for other devices:
echo ========================================
echo.
echo 1. Make sure all devices are on the same WiFi network
echo 2. Open a web browser on any device
echo 3. Go to: http://!ip!:3000
echo 4. Create an account and start using TodoApp!
echo.
echo Keep both terminal windows open while using the app.
echo.
echo If you have firewall issues, you may need to:
echo - Allow Node.js through Windows Firewall
echo - Allow ports 3000 and 5000 through your router
echo.
pause
