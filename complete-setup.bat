@echo off
echo ========================================
echo TodoApp Complete Setup for New Computer
echo ========================================
echo.

echo Step 1: Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Setting up environment file...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo Environment file created successfully!
    ) else (
        echo WARNING: .env.example not found!
        echo You need to create .env file manually with MongoDB credentials.
    )
) else (
    echo Environment file already exists.
)

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Run 'start-backend.bat' in one terminal
echo 2. Run 'start-frontend.bat' in another terminal
echo.
echo Or use VS Code integrated terminals:
echo Terminal 1: cd backend ^&^& npm run dev
echo Terminal 2: npm run dev
echo.
echo Access the app at: http://localhost:3000
echo.
pause
