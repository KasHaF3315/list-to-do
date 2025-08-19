@echo off
echo ========================================
echo TodoApp Universal Startup Script
echo ========================================
echo.

echo Step 1: Checking environment...
if not exist "backend\.env" (
    echo Creating backend environment file...
    copy "backend\env.example" "backend\.env"
    echo Backend environment file created.
) else (
    echo Backend environment file exists.
)

echo.
echo Step 2: Installing dependencies...
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo Installing frontend dependencies...
cd ..
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Starting MongoDB (if available)...
echo Checking if MongoDB is running...
netstat -an | findstr ":27017" >nul
if errorlevel 1 (
    echo MongoDB is not running. Please start MongoDB manually or install MongoDB.
    echo You can download MongoDB from: https://www.mongodb.com/try/download/community
    echo.
    echo For now, the app will work with local storage fallback.
) else (
    echo MongoDB is running on port 27017.
)

echo.
echo Step 4: Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && echo Starting Backend Server... && npm run dev"

echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo Step 5: Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && echo Starting Frontend Server... && set NEXT_PUBLIC_API_URL=http://192.168.43.236:5000 && npm run dev -- --hostname 0.0.0.0"

echo.
echo ========================================
echo TodoApp is now running!
echo ========================================
echo.
echo Access your app from ANY device:
echo.
echo From this computer:
echo   http://localhost:3000
echo.
echo From other devices (phone, tablet, etc):
echo   http://192.168.43.236:3000
echo.
echo Backend API:
echo   http://192.168.43.236:5000
echo.
echo ========================================
echo IMPORTANT NOTES:
echo ========================================
echo.
echo 1. Make sure your firewall allows connections on ports 3000 and 5000
echo 2. Both servers must be running for full functionality
echo 3. Data will be stored in MongoDB database
echo 4. If MongoDB is not available, data will be stored locally
echo 5. Keep both terminal windows open!
echo.
echo ========================================
echo Troubleshooting:
echo ========================================
echo.
echo If you can't access from other devices:
echo 1. Check Windows Firewall settings
echo 2. Make sure both servers are running
echo 3. Try accessing from the same network
echo 4. Check the IP address in the config files
echo.
echo If registration/login doesn't work:
echo 1. Wait 30 seconds for servers to fully start
echo 2. Refresh the browser page
echo 3. Check the backend terminal for errors
echo 4. Make sure MongoDB is running
echo.
pause
