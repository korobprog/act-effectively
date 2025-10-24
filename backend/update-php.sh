#!/bin/bash

# PHP 8.4 Update Script

echo "🚀 Updating PHP to version 8.4..."

# Stop Docker containers
echo "📦 Stopping Docker containers..."
docker-compose down

# Remove old images to force rebuild
echo "🗑️  Removing old PHP images..."
docker rmi $(docker images "php:8.3*" -q) 2>/dev/null || true

# Pull latest PHP 8.4 image
echo "📥 Pulling PHP 8.4 image..."
docker pull php:8.4-fpm

# Rebuild containers with new PHP version
echo "🔨 Rebuilding containers with PHP 8.4..."
docker-compose build --no-cache app

# Start containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Check PHP version
echo "🔍 Checking PHP version..."
docker-compose exec app php -v

# Install dependencies
echo "📦 Installing dependencies..."
docker-compose exec app composer install

# Clear caches
echo "🧹 Clearing caches..."
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear

# Run migrations
echo "🗄️  Running migrations..."
docker-compose exec app php artisan migrate --force

echo ""
echo "✅ PHP 8.4 update completed!"
echo ""
echo "📋 What's new in PHP 8.4:"
echo "   🆕 Improved performance and memory usage"
echo "   🆕 New language features and syntax improvements"
echo "   🆕 Enhanced security features"
echo "   🆕 Better error handling and debugging"
echo "   🆕 Updated extensions and libraries"
echo ""
echo "🌐 Your application is now running on:"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/api/health"
echo "   PhpMyAdmin: http://localhost:8080"
echo ""
echo "🔧 To test the update:"
echo "   curl http://localhost:8000/api/health"
echo "   curl http://localhost:8000/api/test"
echo ""
echo "📊 PHP Version Info:"
docker-compose exec app php -v
