@echo off
echo ========================================
echo IMMEDIATE TodoApp Registration Fix
echo ========================================
echo.

echo Stopping any existing servers...
taskkill /F /IM node.exe 2>nul

echo.
echo Step 1: Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && echo Backend Starting... && npm run dev"

timeout /t 5

echo.
echo Step 2: Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && echo Frontend Starting... && set NEXT_PUBLIC_API_URL=http://192.168.43.236:5000 && npm run dev -- --hostname 0.0.0.0"

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
echo REGISTRATION SHOULD NOW WORK!
echo ========================================
echo.
echo If you still get "Load failed":
echo 1. Wait 30 seconds for servers to fully start
echo 2. Refresh the browser page
echo 3. Try creating account again
echo.
echo Keep both terminal windows open!
echo.
pause
