#!/bin/bash

# Generate Laravel APP_KEY for production
# Run this before deploying to production

cd backend

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env 2>/dev/null || echo "Note: .env.example does not exist"
fi

# Generate APP_KEY
php artisan key:generate

echo ""
echo "✅ APP_KEY generated successfully!"
echo ""
echo "Generated key:"
grep "APP_KEY=" .env

echo ""
echo "Copy this key to your production environment variables:"
echo ""

