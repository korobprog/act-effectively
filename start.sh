#!/bin/bash

# Quick Start Script for Next.js Offline Site with Laravel Backend

echo "🚀 Starting Next.js Offline Site with Laravel Backend..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start Laravel Backend
echo "📦 Starting Laravel Backend..."
cd backend

# Check if .env exists, if not create it
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Install dependencies if vendor doesn't exist
if [ ! -d "vendor" ]; then
    echo "📦 Installing Laravel dependencies..."
    docker-compose exec app composer install
fi

# Generate app key if not set
if ! grep -q "APP_KEY=" .env || grep -q "APP_KEY=$" .env; then
    echo "🔑 Generating application key..."
    docker-compose exec app php artisan key:generate
fi

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec app php artisan migrate --force

echo ""
echo "✅ Laravel Backend is ready!"
echo "   🌐 API: http://localhost:8000"
echo "   🔍 Health: http://localhost:8000/api/health"
echo "   🗄️  PhpMyAdmin: http://localhost:8080"
echo ""

# Start Next.js Frontend
echo "⚛️  Starting Next.js Frontend..."
cd ../my-offline-site

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Next.js dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting Next.js development server..."
echo "   🌐 Frontend: http://localhost:3000"
echo "   📱 Offline: http://localhost:3000/offline"
echo ""

# Start Next.js in background
npm run dev &

# Wait a moment for Next.js to start
sleep 5

echo ""
echo "🎉 All services are running!"
echo ""
echo "📋 Available URLs:"
echo "   Frontend:     http://localhost:3000"
echo "   Backend API:  http://localhost:8000"
echo "   PhpMyAdmin:   http://localhost:8080"
echo ""
echo "🔧 To stop all services:"
echo "   Ctrl+C (to stop Next.js)"
echo "   cd backend && docker-compose down (to stop Docker)"
echo ""

# Keep script running
wait
