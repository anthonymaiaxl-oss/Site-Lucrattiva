@echo off
setlocal
cd /d "%~dp0"
echo.
echo LUCRATTIVA - TESTE LOCAL
where py >nul 2>nul
if %errorlevel%==0 (
  echo Abra http://localhost:8080/ no navegador.
  py -m http.server 8080
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  echo Abra http://localhost:8080/ no navegador.
  python -m http.server 8080
  goto :eof
)
echo Python nao encontrado. Instale Python 3 e execute novamente.
pause
