@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Oncology Print Agent

echo ====================================================
echo     ติดตั้งและเปิดใช้งาน Print Agent (แบบย่อหน้าต่าง)
echo ====================================================
echo.

echo [1/3] กำลังเช็คส่วนประกอบที่จำเป็น...
call npm install

echo.
echo [2/3] กำลังตั้งค่าให้เปิดอัตโนมัติเมื่อเริ่มคอมพิวเตอร์...
call node setup-startup.js

echo.
echo [3/3] กำลังเริ่มทำงาน Print Agent...
:: ใช้ start /min เพื่อย่อหน้าต่างไปที่ Taskbar แทนการซ่อน 100% เพื่อหลบแอนตี้ไวรัส
start "Oncology Print Agent" /min node agent.js

echo.
echo ====================================================
echo ✅ สำเร็จ! Print Agent เปิดทำงานแล้ว (ถูกย่อไว้ที่ด้านล่างจอ)
echo.
echo สามารถกดกากบาท (X) หน้าต่างติดตั้งนี้ทิ้งไปได้เลยครับ
echo ====================================================
timeout /t 5 >nul
exit
