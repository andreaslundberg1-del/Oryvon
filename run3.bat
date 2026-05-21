@echo off
cd /d %~dp0

echo Installing dependencies...
call npm install

echo Starting Next.js dev server...
call npm run dev

pause