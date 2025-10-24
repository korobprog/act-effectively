#!/bin/bash

# Laravel 12 Update Script

echo "🚀 Updating Laravel to version 12..."

# Stop Docker containers
echo "📦 Stopping Docker containers..."
docker-compose down

# Remove vendor directory to ensure clean install
echo "🗑️  Removing vendor directory..."
rm -rf vendor composer.lock

# Update composer dependencies
echo "📦 Installing Laravel 12 dependencies..."
docker-compose run --rm app composer install

# Generate new application key
echo "🔑 Generating new application key..."
docker-compose run --rm app php artisan key:generate

# Clear all caches
echo "🧹 Clearing caches..."
docker-compose run --rm app php artisan config:clear
docker-compose run --rm app php artisan cache:clear
docker-compose run --rm app php artisan route:clear
docker-compose run --rm app php artisan view:clear

# Run migrations
echo "🗄️  Running migrations..."
docker-compose run --rm app php artisan migrate --force

# Start containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo ""
echo "✅ Laravel 12 update completed!"
echo ""
echo "📋 What's new in Laravel 12:"
echo "   🆕 Laravel Pennant for feature flags"
echo "   🆕 Improved caching system"
echo "   🆕 New Blade directives (@feature, @featureany)"
echo "   🆕 Better performance"
echo "   🆕 Enhanced security features"
echo ""
echo "🌐 Your application is now running on:"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/api/health"
echo "   PhpMyAdmin: http://localhost:8080"
echo ""
echo "🔧 To test the update:"
echo "   curl http://localhost:8000/api/health"
echo "   curl http://localhost:8000/api/test"
