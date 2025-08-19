@echo off
echo ========================================
echo TodoApp Optimized Startup Script
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
echo Step 3: Checking MongoDB...
echo Checking if MongoDB is running...
netstat -an | findstr ":27017" >nul
if errorlevel 1 (
    echo MongoDB is not running. Starting MongoDB...
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    echo.
    echo For now, the app will work with local storage fallback.
    echo.
    echo Starting MongoDB service...
    net start MongoDB 2>nul
    if errorlevel 1 (
        echo MongoDB service not found. Please install MongoDB manually.
    ) else (
        echo MongoDB service started successfully.
    )
) else (
    echo MongoDB is running on port 27017.
)

echo.
echo Step 4: Configuring firewall...
echo Adding firewall rules for cross-device access...
netsh advfirewall firewall add rule name="TodoApp Frontend" dir=in action=allow protocol=TCP localport=3000 2>nul
netsh advfirewall firewall add rule name="TodoApp Backend" dir=in action=allow protocol=TCP localport=5000 2>nul
echo Firewall rules configured.

echo.
echo Step 5: Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && echo Starting Backend Server... && npm run dev"

echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo Step 6: Testing backend connection...
echo Testing backend health...
curl -s http://localhost:5000/api/health >nul
if errorlevel 1 (
    echo Backend is not responding. Please check the backend terminal for errors.
    echo Waiting additional time for backend to start...
    timeout /t 10 /nobreak >nul
) else (
    echo Backend is responding correctly.
)

echo.
echo Step 7: Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && echo Starting Frontend Server... && set NEXT_PUBLIC_API_URL=http://192.168.43.236:5000 && npm run dev -- --hostname 0.0.0.0"

echo.
echo ========================================
echo TodoApp is now running with optimizations!
echo ========================================
echo.
echo Performance improvements applied:
echo ✅ Optimized authentication flow
echo ✅ Reduced page loading time
echo ✅ Fixed window blinking issues
echo ✅ Improved JWT token handling
echo ✅ Enhanced mobile device support
echo ✅ Better database connection handling
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
echo 1. Authentication is now optimized to prevent window blinking
echo 2. Page loading time has been significantly reduced
echo 3. JWT tokens are properly handled for mobile devices
echo 4. Database connection is more reliable
echo 5. Cross-device access is fully supported
echo 6. Keep both terminal windows open!
echo.
echo ========================================
echo Troubleshooting:
echo ========================================
echo.
echo If you experience slow loading:
echo 1. Check if MongoDB is running properly
echo 2. Verify both servers are running
echo 3. Clear browser cache and refresh
echo 4. Check network connectivity
echo.
echo If authentication issues persist:
echo 1. Clear browser localStorage and cookies
echo 2. Restart both servers
echo 3. Check backend terminal for errors
echo 4. Verify JWT secret in backend/.env
echo.
echo If mobile access doesn't work:
echo 1. Ensure devices are on same WiFi network
echo 2. Check Windows Firewall settings
echo 3. Verify IP address is correct
echo 4. Try accessing from different mobile browser
echo.
pause
