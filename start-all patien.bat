@echo off
title Patient System Launcher
echo ==================================================
echo         Patient System Launcher (Antigravity)
echo ==================================================
echo.
echo [1/2] Starting oncology-backend (Port 5004)...
start "Oncology Backend" /d "%~dp0oncology-backend" cmd /k "npm start"

echo [2/2] Starting client (React/Vite)...
start "Oncology Client" /d "%~dp0client" cmd /k "npm run dev"

echo.
echo ==================================================
echo 🚀 Both services are starting in separate windows.
echo - Backend: Port 5004 (or configured port)
echo - Client: Check the URL shown in the Client window (usually http://localhost:5004)
echo ==================================================
echo.
pause
