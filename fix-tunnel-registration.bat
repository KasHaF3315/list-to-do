@echo off
echo ========================================
echo TodoApp Tunnel Registration Fix
echo ========================================
echo.

echo This script will fix registration issues when accessing via VS Code dev tunnels.
echo.

echo Step 1: Ensuring backend is running...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ Node.js processes found
) else (
    echo ✗ No Node.js processes found
    echo Starting backend server...
    start "TodoApp Backend" cmd /k "cd /d %~dp0backend && npm run dev"
    timeout /t 5
)

echo.
echo Step 2: Creating tunnel-specific environment configuration...
echo NEXT_PUBLIC_API_URL=auto-detect > .env.local
echo ✓ Environment configured for auto-detection

echo.
echo Step 3: Instructions for VS Code Dev Tunnels:
echo.
echo IMPORTANT: You MUST forward BOTH ports in VS Code:
echo.
echo 1. Open VS Code Command Palette (Ctrl+Shift+P)
echo 2. Type: "Ports: Focus on Ports View"
echo 3. In the Ports panel, click "Forward a Port"
echo 4. Add port 3000 (Frontend)
echo 5. Add port 5000 (Backend)
echo 6. RIGHT-CLICK each port and set to "Public"
echo.
echo Your tunnel URLs will be:
echo Frontend: https://[random]-3000.inc1.devtunnels.ms
echo Backend:  https://[random]-5000.inc1.devtunnels.ms
echo.
echo Step 4: Testing registration:
echo.
echo 1. Access your frontend tunnel URL
echo 2. Open browser console (F12)
echo 3. Try to register a user
echo 4. Check console for API connection logs
echo.
echo If registration still fails:
echo - Verify both ports 3000 and 5000 are forwarded and PUBLIC
echo - Check that backend tunnel URL is accessible
echo - Look for CORS or network errors in browser console
echo.

echo ========================================
echo Alternative: Network Access Method
echo ========================================
echo.
echo If dev tunnels don't work, use network access instead:
echo.
echo 1. Run: start-universal-access.bat
echo 2. Access from other device: http://192.168.43.236:3000
echo 3. This bypasses tunnel issues completely
echo.

pause
