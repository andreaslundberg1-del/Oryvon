@echo off
title Start Localhost
cd /d "%~dp0"

echo Folder:
cd
echo.

if not exist package.json (
  echo ERROR: package.json hittades inte.
  echo Lägg denna .bat fil i samma mapp som package.json
  pause
  exit
)

echo Startar projekt...
cmd /k "npm install && npm run dev"