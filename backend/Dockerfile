FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libgd-dev \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . /var/www

# Set permissions for storage and cache directories
RUN mkdir -p /var/www/storage/logs && \
    mkdir -p /var/www/storage/framework/cache && \
    mkdir -p /var/www/storage/framework/sessions && \
    mkdir -p /var/www/storage/framework/views && \
    chmod -R 775 /var/www/storage && \
    chmod -R 775 /var/www/bootstrap/cache

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Fix permissions on storage directories\n\
chmod -R 775 /var/www/storage 2>/dev/null || true\n\
chmod -R 775 /var/www/bootstrap/cache 2>/dev/null || true\n\
\n\
# Start Laravel server\n\
exec php artisan serve --host=0.0.0.0 --port=8000\n' > /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Expose port 8000
EXPOSE 8000

# Use entrypoint script
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
