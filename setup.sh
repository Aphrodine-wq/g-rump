#!/bin/bash

# Grump Platform - Complete Setup Script for macOS/Linux
echo "🎭 Grump Platform Setup"
echo "========================"
echo ""

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js $NODE_VERSION found"
else
    echo "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "✗ Backend setup failed"
        exit 1
    fi
else
    echo "✓ Backend dependencies already installed"
fi

# Check for .env
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠ Please add your ANTHROPIC_API_KEY to backend/.env"
else
    echo "✓ .env file exists"
fi

cd ..

# Setup Web Client
echo ""
echo "🌐 Setting up Web Client..."
cd web

if [ ! -d "node_modules" ]; then
    echo "Installing web dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "✗ Web setup failed"
        exit 1
    fi
else
    echo "✓ Web dependencies already installed"
fi

# Check for .env
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
else
    echo "✓ .env file exists"
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Add your ANTHROPIC_API_KEY to backend/.env"
echo "2. Start backend: cd backend && npm start"
echo "3. Start web client: cd web && npm run dev"
echo "4. Or run Electron: cd web && npm run electron:dev"
echo ""

