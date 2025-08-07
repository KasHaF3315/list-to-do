@echo off
echo Installing TodoApp dependencies...
echo.

echo Cleaning previous installations...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing dependencies...
npm install

echo.
echo Installation complete!
echo.
echo To start the development server, run:
echo npm run dev
echo.
pause
