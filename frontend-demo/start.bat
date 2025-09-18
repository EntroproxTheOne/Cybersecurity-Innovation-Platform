@echo off
echo.
echo ========================================
echo   THINK AI 3.0 Frontend Demo Server
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Start the server
echo 🚀 Starting server on port 4050...
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
