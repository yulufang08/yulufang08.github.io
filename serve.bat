@echo off
chcp 65001 >nul
echo Starting local server for yulufang.com
echo Open in browser: http://localhost:8080  or  http://yulufang.com:8080
echo (Add "127.0.0.1 yulufang.com" to hosts to use yulufang.com)
echo Press Ctrl+C to stop.
echo.
cd /d "%~dp0"
python -m http.server 8080
if errorlevel 1 (
  echo.
  echo Python not found. Try: npx serve -p 8080
  pause
)
