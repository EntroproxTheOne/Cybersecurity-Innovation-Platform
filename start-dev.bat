@echo off
echo Starting THINK AI 3.0 Development Servers...

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "npm run server"

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
