#!/bin/bash

# Start Backend and Web Client Together (macOS/Linux)
echo "🚀 Starting Grump Platform..."
echo ""

# Start Backend in background
echo "Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start Web Client
echo "Starting Web Client..."
cd web
npm run dev &
WEB_PID=$!
cd ..

echo ""
echo "✓ Backend: http://localhost:3000"
echo "✓ Web Client: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $BACKEND_PID $WEB_PID 2>/dev/null; exit" INT
wait

