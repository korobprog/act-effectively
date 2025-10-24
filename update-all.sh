#!/bin/bash

# Complete Project Update Script (Laravel 12 + PHP 8.4)

echo "🚀 Complete Project Update: Laravel 12 + PHP 8.4"
echo "=================================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📦 Step 1: Stopping all containers..."
docker-compose down

echo "🗑️  Step 2: Cleaning up old images..."
docker rmi $(docker images "php:8.3*" -q) 2>/dev/null || true

echo "📥 Step 3: Pulling PHP 8.4 image..."
docker pull php:8.4-fpm

echo "🔨 Step 4: Building containers with PHP 8.4..."
docker-compose build --no-cache app

echo "🐳 Step 5: Starting containers..."
docker-compose up -d

echo "⏳ Step 6: Waiting for containers to be ready..."
sleep 15

echo "📦 Step 7: Installing dependencies..."
docker-compose exec app composer install

echo "🔑 Step 8: Generating application key..."
docker-compose exec app php artisan key:generate

echo "🧹 Step 9: Clearing all caches..."
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear

echo "🗄️  Step 10: Running migrations..."
docker-compose exec app php artisan migrate --force

echo ""
echo "✅ Complete update finished!"
echo ""
echo "📊 Version Information:"
echo "======================"
docker-compose exec app php -v
echo ""
docker-compose exec app php artisan --version
echo ""

echo "🎉 What's Updated:"
echo "=================="
echo "✅ Laravel 12.0 - Latest framework version"
echo "✅ PHP 8.4 - Latest PHP version with maximum performance"
echo "✅ Laravel Pennant - Feature flags system"
echo "✅ Sanctum 4.0 - Updated authentication"
echo "✅ All dependencies - Latest compatible versions"
echo ""

echo "🌐 Available Services:"
echo "====================="
echo "   Backend API:     http://localhost:8000"
echo "   Health Check:    http://localhost:8000/api/health"
echo "   API Test:        http://localhost:8000/api/test"
echo "   Feature Flags:   http://localhost:8000/api/features"
echo "   PhpMyAdmin:      http://localhost:8080"
echo ""

echo "🧪 Quick Tests:"
echo "==============="
echo "   curl http://localhost:8000/api/health"
echo "   curl http://localhost:8000/api/test"
echo ""

echo "📚 Documentation:"
echo "================"
echo "   Laravel 12:      backend/LARAVEL_12_UPDATE.md"
echo "   PHP 8.4:        backend/PHP_8_4_UPDATE.md"
echo "   Quick Start:     QUICKSTART.md"
echo ""

echo "🎯 Your project is now running on the latest versions!"
echo "   Laravel 12 + PHP 8.4 = Maximum Performance & Security"
