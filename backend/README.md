# Laravel Backend API

Этот проект представляет собой Laravel API бэкенд с поддержкой Docker и MySQL.

## 🚀 Быстрый старт

### Предварительные требования
- Docker и Docker Compose
- PHP 8.2+ (для локальной разработки)

### Установка и запуск

1. **Клонируйте репозиторий и перейдите в папку backend:**
   ```bash
   cd backend
   ```

2. **Запустите Docker контейнеры:**
   ```bash
   docker-compose up -d
   ```

3. **Установите зависимости Laravel:**
   ```bash
   docker-compose exec app composer install
   ```

4. **Настройте окружение:**
   ```bash
   docker-compose exec app cp .env.example .env
   docker-compose exec app php artisan key:generate
   ```

5. **Запустите миграции:**
   ```bash
   docker-compose exec app php artisan migrate
   ```

## 📋 Доступные сервисы

- **Laravel API**: http://localhost:8000
- **PhpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## 🔗 API Endpoints

### Основные endpoints:
- `GET /api/health` - Проверка состояния API
- `GET /api/test` - Тестовый endpoint
- `GET /api/user` - Информация о пользователе (требует аутентификации)

## 🛠 Разработка

### Полезные команды:

```bash
# Запуск миграций
docker-compose exec app php artisan migrate

# Создание новой миграции
docker-compose exec app php artisan make:migration create_example_table

# Создание контроллера
docker-compose exec app php artisan make:controller ExampleController

# Создание модели
docker-compose exec app php artisan make:model Example

# Очистка кэша
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
```

### Структура проекта:
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   ├── Models/
│   └── Providers/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── web.php
├── storage/
└── resources/
    └── views/
```

## 🐳 Docker контейнеры

- **app**: Laravel приложение (PHP 8.2-FPM)
- **db**: MySQL 8.0 база данных
- **redis**: Redis для кэширования и сессий
- **phpmyadmin**: Веб-интерфейс для управления MySQL

## 🔧 Конфигурация

Основные настройки находятся в файле `.env`:
- `DB_HOST=db` - хост базы данных
- `DB_DATABASE=laravel_db` - имя базы данных
- `DB_USERNAME=laravel_user` - пользователь БД
- `DB_PASSWORD=laravel_password` - пароль БД
- `REDIS_HOST=redis` - хост Redis

## 📝 Логи

Логи приложения доступны в:
```bash
docker-compose exec app tail -f storage/logs/laravel.log
```

## 🚨 Устранение неполадок

### Проблемы с правами доступа:
```bash
docker-compose exec app chmod -R 775 storage
docker-compose exec app chmod -R 775 bootstrap/cache
```

### Перезапуск контейнеров:
```bash
docker-compose down
docker-compose up -d
```

### Очистка всех данных:
```bash
docker-compose down -v
docker-compose up -d
```
