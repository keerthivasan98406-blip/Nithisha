@echo off
title Nithisha Collection Server
cd /d "%~dp0"

echo ======================================================
echo    Nithisha Collection - Premium Fancy Jewellery Boutique
echo ======================================================
echo.
echo Starting full-stack server on http://localhost:5000...
echo.

:: Launch the browser after a brief delay
start /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"

:: Start the Node Express server serving API and built frontend
cd server
node src/index.js

pause
