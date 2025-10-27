#!/bin/bash

# Quick Start Script for Laravel Backend

echo "🚀 Starting Laravel Backend..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start Docker containers
echo "🐳 Starting Docker containers..."
cd /home/maxim/next-offline && docker-compose up -d

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 5

# Check if containers are running
if docker ps | grep -q laravel_app; then
    echo ""
    echo "✅ Laravel Backend is ready!"
    echo ""
    echo "📋 Available URLs:"
    echo "   🌐 Laravel API:      http://localhost:8000"
    echo "   🔍 Health Check:     http://localhost:8000/api/health"
    echo "   🧪 Test Endpoint:    http://localhost:8000/api/test"
    echo "   🗄️  PhpMyAdmin:       http://localhost:8080"
    echo ""
    echo "🔧 To stop backend:"
    echo "   docker-compose down"
    echo ""
else
    echo "❌ Failed to start backend containers"
    exit 1
fi

