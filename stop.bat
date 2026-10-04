@echo off
title Stopping Nithisha Collection Server
cd /d "%~dp0"

echo Stopping Nithisha Collection server on port 5000...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Terminating PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo Server stopped successfully.
timeout /t 2 >nul
