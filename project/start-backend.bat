@echo off
echo Starting EchoLock Backend Server...
echo.
cd backend
echo Installing dependencies...
npm install
echo.
echo Starting server on http://localhost:3001
echo Health check: http://localhost:3001/api/health
echo.
npm run dev
pause 