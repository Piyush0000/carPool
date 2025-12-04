@echo off
echo Starting Campus Cab Pool Development Servers...
echo.

echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers should now be running:
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul