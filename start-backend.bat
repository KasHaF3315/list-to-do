@echo off
echo Starting TodoApp Backend Server...
cd backend
copy .env.example .env
npm install
npm run dev
pause
