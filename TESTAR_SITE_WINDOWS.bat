@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py scripts\test_static.py
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (python scripts\test_static.py) else (echo Python nao encontrado.)
)
where node >nul 2>nul
if %errorlevel%==0 (
  node scripts\test_interactions.js
) else (
  echo Node.js nao encontrado. Testes de interacao ignorados.
)
pause
