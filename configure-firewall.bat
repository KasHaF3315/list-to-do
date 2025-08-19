@echo off
echo ========================================
echo TodoApp Firewall Configuration
echo ========================================
echo.

echo This script will configure Windows Firewall to allow
echo connections on ports 3000 and 5000 for cross-device access.
echo.

echo Step 1: Adding inbound rule for port 3000 (Frontend)...
netsh advfirewall firewall add rule name="TodoApp Frontend" dir=in action=allow protocol=TCP localport=3000
if errorlevel 1 (
    echo ❌ Failed to add rule for port 3000
) else (
    echo ✅ Successfully added rule for port 3000
)

echo.
echo Step 2: Adding inbound rule for port 5000 (Backend)...
netsh advfirewall firewall add rule name="TodoApp Backend" dir=in action=allow protocol=TCP localport=5000
if errorlevel 1 (
    echo ❌ Failed to add rule for port 5000
) else (
    echo ✅ Successfully added rule for port 5000
)

echo.
echo Step 3: Adding outbound rules...
netsh advfirewall firewall add rule name="TodoApp Frontend Out" dir=out action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="TodoApp Backend Out" dir=out action=allow protocol=TCP localport=5000

echo.
echo ========================================
echo Firewall Configuration Complete!
echo ========================================
echo.
echo Your computer should now accept connections from other devices.
echo.
echo To verify the configuration:
echo 1. Start the TodoApp servers
echo 2. Try accessing from another device
echo 3. Use the test-connection.js script to verify backend
echo.
echo If you still have issues:
echo 1. Check Windows Defender settings
echo 2. Verify your network is set to "Private"
echo 3. Try temporarily disabling firewall for testing
echo.
pause
