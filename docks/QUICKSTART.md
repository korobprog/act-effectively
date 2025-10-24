# 🚀 Быстрый запуск проекта

## Автоматический запуск (рекомендуется)

```bash
./start.sh
```

Этот скрипт автоматически:
- Запустит Docker контейнеры для Laravel
- Установит зависимости
- Настроит базу данных
- Запустит Next.js фронтенд

## Ручной запуск

### 1. Запуск бэкенда (Laravel)

```bash
cd backend
docker-compose up -d
docker-compose exec app composer install
docker-compose exec app cp .env.example .env
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
```

### 2. Запуск фронтенда (Next.js)

```bash
cd my-offline-site
npm install
npm run dev
```

## 📋 Доступные URL

После запуска будут доступны:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Health**: http://localhost:8000/api/health
- **API Test**: http://localhost:8000/api/test
- **PhpMyAdmin**: http://localhost:8080

## 🔧 Полезные команды

### Остановка сервисов
```bash
# Остановить Docker контейнеры
cd backend && docker-compose down

# Остановить Next.js (Ctrl+C в терминале)
```

### Перезапуск
```bash
# Перезапустить Docker
cd backend && docker-compose restart

# Перезапустить Next.js
cd my-offline-site && npm run dev
```

### Просмотр логов
```bash
# Логи Laravel
docker-compose exec app tail -f storage/logs/laravel.log

# Логи Docker контейнеров
docker-compose logs -f
```

## 🚨 Устранение неполадок

### Проблемы с портами
Убедитесь, что порты свободны:
- 3000 (Next.js)
- 8000 (Laravel)
- 8080 (PhpMyAdmin)
- 3306 (MySQL)
- 6379 (Redis)

### Очистка и перезапуск
```bash
# Полная очистка
cd backend
docker-compose down -v
docker-compose up -d --build
```

### Проблемы с правами доступа
```bash
docker-compose exec app chmod -R 775 storage
docker-compose exec app chmod -R 775 bootstrap/cache
```
