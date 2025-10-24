#!/bin/bash

# Laravel Backend Setup Script

echo "🚀 Setting up Laravel Backend..."

# Create necessary directories
mkdir -p storage/app/public
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Copy .env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "⚠️  .env file already exists"
fi

# Generate application key
php artisan key:generate

echo "✅ Laravel backend setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Run: docker-compose up -d"
echo "2. Run: docker-compose exec app php artisan migrate"
echo "3. Visit: http://localhost:8000"
echo "4. API Health: http://localhost:8000/api/health"
echo "5. PhpMyAdmin: http://localhost:8080"
