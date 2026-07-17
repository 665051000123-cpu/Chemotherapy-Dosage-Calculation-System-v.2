Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run "cmd.exe /c cd /d """ & WScript.Arguments(0) & """ & node agent.js", 0, False 
