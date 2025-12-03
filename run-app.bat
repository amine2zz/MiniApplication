@echo off
echo ========================================
echo    Mini Application Immobiliere
echo ========================================
echo.

echo Arret des processus Node.js existants...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Installation Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Erreur installation backend
    pause
    exit /b 1
)

echo Installation Frontend...
cd ..\frontend
call npm install
call npm install eslint-plugin-react-hooks --save-dev
if %errorlevel% neq 0 (
    echo Erreur installation frontend
    pause
    exit /b 1
)

echo.
echo Demarrage Backend (Port 3001)...
start "Backend API" cmd /k "cd /d %~dp0backend && npm run dev"

echo Attente 5 secondes...
timeout /t 5 /nobreak >nul

echo Demarrage Frontend (Port 3000)...
start "Frontend React" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo Application demarree avec succes!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Gardez cette fenetre ouverte
pause