@echo off
echo ========================================
echo TodoApp Tunnel Connection Debug
echo ========================================
echo.

echo Step 1: Checking if backend server is running...
echo.
echo Testing local backend connection...
curl -s http://localhost:5000/api/health
if %errorlevel% equ 0 (
    echo ✓ Backend is running locally
) else (
    echo ✗ Backend is NOT running locally
    echo Please start backend: cd backend && npm run dev
    pause
    exit /b 1
)

echo.
echo Step 2: Checking VS Code port forwarding...
echo.
echo Open VS Code and check the Ports panel:
echo 1. Press Ctrl+Shift+P
echo 2. Type "Ports: Focus on Ports View"
echo 3. Verify these ports are forwarded and PUBLIC:
echo    - Port 3000 (Frontend)
echo    - Port 5000 (Backend)
echo.
echo If ports are not forwarded:
echo 1. Click "Forward a Port" in Ports panel
echo 2. Add port 5000
echo 3. Right-click port 5000 → Change Port Visibility → Public
echo.

echo Step 3: Testing tunnel URLs...
echo.
echo Your tunnel URLs should look like:
echo Frontend: https://dwj7zvc-3000.inc1.devtunnels.ms
echo Backend:  https://dwj7zvc-5000.inc1.devtunnels.ms
echo.
echo Testing backend tunnel (if available)...
echo Replace YOUR-BACKEND-TUNNEL-URL with your actual backend tunnel URL:
echo curl -s https://YOUR-BACKEND-TUNNEL-URL/api/health
echo.

echo Step 4: Common Issues and Solutions...
echo.
echo Issue 1: Backend tunnel not accessible
echo Solution: Ensure port 5000 is forwarded and public in VS Code
echo.
echo Issue 2: CORS errors
echo Solution: Backend is configured to allow all devtunnels.ms origins
echo.
echo Issue 3: Registration fails with "invalid error"
echo Solution: Check browser console (F12) for detailed error messages
echo.
echo Issue 4: Network connectivity
echo Solution: Ensure both devices are on same network or use tunnels
echo.

echo ========================================
echo Debug Instructions:
echo ========================================
echo.
echo 1. Open browser console (F12) on the device with registration issues
echo 2. Try to register a user
echo 3. Check console for error messages
echo 4. Look for API request failures or CORS errors
echo 5. Verify the backend URL being used in the console logs
echo.
echo Common error patterns:
echo - "Failed to fetch" = Network connectivity issue
echo - "CORS error" = Backend not allowing the origin
echo - "404 Not Found" = Backend tunnel not accessible
echo - "500 Internal Server Error" = Backend server issue
echo.
pause
