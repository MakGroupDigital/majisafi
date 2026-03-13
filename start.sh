#!/bin/bash

# 🔐 Better Auth Quick Start
# Démarre les deux serveurs (Auth + Vite) en parallèle

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  🔐 Maji Safi Ya Kwetu - Better Auth Setup       ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""
echo "🚀 Starting servers..."
echo ""
echo "   Terminal 1: Auth Server (port 5000)"
echo "   Terminal 2: Vite Frontend (port 3010)"
echo ""
echo "⏳ Starting in 5 seconds..."
sleep 5

# Start auth server
echo "[1/2] Starting Auth Server..."
npm run auth:server &
AUTH_PID=$!

sleep 3

# Start dev server
echo "[2/2] Starting Vite Frontend..."
npm run dev &
DEV_PID=$!

echo ""
echo "✅ Both servers started!"
echo ""
echo "📱 Open: http://localhost:3010/?admin=true"
echo ""
echo "⚡ Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $AUTH_PID $DEV_PID
