@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Oncology Print Agent - Debug Mode

echo ====================================================
echo     [โหมดตรวจสอบปัญหา] Local Print Agent
echo ====================================================
echo.
echo กำลังทดสอบรันโปรแกรมแบบเปิดหน้าต่างค้างไว้...
echo ถ้ามี Error สีแดง กรุณาถ่ายรูปหน้านี้ส่งให้ผมครับ
echo.
node agent.js
pause
