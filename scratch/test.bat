@echo off
echo Set WshShell = CreateObject("WScript.Shell") > run_silent_temp.vbs
echo WshShell.Run "cmd.exe /c cd /d """ ^& WScript.Arguments(0) ^& """ & node agent.js", 0, False >> run_silent_temp.vbs
type run_silent_temp.vbs
