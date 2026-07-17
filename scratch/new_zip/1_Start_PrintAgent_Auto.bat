@echo off
chcp 65001 >nul
title Oncology Print Agent Setup

echo ====================================================
echo     ติดตั้งและเปิดใช้งาน Print Agent (แบบซ่อนหน้าจอ)
echo ====================================================
echo.

echo [1/3] กำลังติดตั้งส่วนประกอบที่จำเป็น (รอสักครู่)...
call npm install >nul 2>&1

echo [2/3] กำลังตั้งค่าให้เปิดอัตโนมัติเมื่อเริ่มคอมพิวเตอร์...
call node setup-startup.js >nul 2>&1

echo [3/3] กำลังเริ่มทำงาน Print Agent แบบซ่อนหน้าต่าง CMD...
:: สร้างไฟล์ VBScript ชั่วคราวเพื่อรัน Node แบบซ่อนหน้าต่าง
echo Set WshShell = CreateObject("WScript.Shell") > run_silent_temp.vbs
echo WshShell.Run "cmd.exe /c node agent.js", 0, False >> run_silent_temp.vbs
cscript run_silent_temp.vbs >nul 2>&1
del run_silent_temp.vbs

echo.
echo ====================================================
echo สำเร็จ! Print Agent กำลังทำงานอยู่เบื้องหลัง
echo และจะเปิดตัวเองอัตโนมัติแบบซ่อนหน้าต่างทุกครั้งที่เปิดเครื่อง
echo หน้าต่างนี้จะปิดตัวเองใน 5 วินาที...
echo ====================================================
timeout /t 5 >nul
exit
