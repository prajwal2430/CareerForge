@echo off
echo Starting CareerForge (LearnHub) Platform...

echo Starting Backend Server...
start "CareerForge Backend" cmd /k "cd server && npm run dev"

echo Starting Frontend Development Server...
start "CareerForge Frontend" cmd /k "cd client && npm run dev"

echo Both servers are starting up in separate windows!
