@echo off
echo ========================================
echo TodoApp Dev Tunnel Setup
echo ========================================
echo.

echo This script will help you set up dev tunnels for remote access.
echo.
echo IMPORTANT: Make sure both servers are running first:
echo 1. Backend: cd backend ^&^& npm run dev
echo 2. Frontend: npm run dev
echo.
echo Press any key when both servers are running...
pause

echo.
echo Setting up dev tunnels...
echo.

echo Creating tunnel for Frontend (port 3000)...
start "Frontend Tunnel" cmd /k "echo Frontend Tunnel - Keep this window open && code tunnel --name todoapp-frontend port 3000"

timeout /t 3

echo Creating tunnel for Backend (port 5000)...
start "Backend Tunnel" cmd /k "echo Backend Tunnel - Keep this window open && code tunnel --name todoapp-backend port 5000"

echo.
echo ========================================
echo Dev Tunnels Created!
echo ========================================
echo.
echo Your tunnel URLs will be displayed in the opened windows.
echo They will look like:
echo Frontend: https://todoapp-frontend-XXXXX.devtunnels.ms
echo Backend:  https://todoapp-backend-XXXXX.devtunnels.ms
echo.
echo Use the FRONTEND URL to access your TodoApp remotely.
echo.
echo Alternative: Use VS Code Ports panel to forward ports 3000 and 5000
echo.
pause
