@echo off
echo Starting QuantVista AI...

echo Starting Backend Server...
cd backend
start cmd /k "python -m uvicorn app.main:app --reload --port 8000"
cd ..

echo Starting Frontend Server...
cd frontend
start cmd /k "npm run dev"
cd ..

echo Waiting for servers to initialize...
timeout /t 5 /nobreak > nul

echo Opening QuantVista AI in your default browser...
start http://localhost:3000

echo Done!
