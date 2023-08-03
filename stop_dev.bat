@echo off
start /B docker compose stop

start /WAIT taskkill /F /FI "WINDOWTITLE eq Windows PowerShell" /T
exit