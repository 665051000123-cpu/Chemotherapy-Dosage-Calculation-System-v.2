@echo off
chcp 65001 >nul
title Clinical API Bridge - oncology-backend (Auto Restart)
color 0a
cd /d "%~dp0"

echo ===========================================================
echo     Clinical API Bridge - Oncology Backend (Port 5004)
echo ===========================================================
echo.
echo [INFO] Starting with nodemon (auto-restart on file change)...
echo -----------------------------------------------------------
echo.

npx nodemon server.js

echo.
echo [WARN] nodemon exited. Press any key to close...
pause
