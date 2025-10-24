# Next.js Offline Site with Laravel Backend

Полнофункциональное веб-приложение с Next.js фронтендом и Laravel API бэкендом, поддерживающее офлайн режим.

## 🏗 Архитектура проекта

```
next-offline/
├── my-offline-site/     # Next.js фронтенд
├── backend/            # Laravel API бэкенд
└── docker-compose.yml  # Docker конфигурация
```

## 🚀 Быстрый старт

### 1. Запуск бэкенда (Laravel API)

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

## 📋 Доступные сервисы

### Фронтенд:
- **Next.js App**: http://localhost:3000
- **Офлайн страница**: http://localhost:3000/offline
- **Fallback страница**: http://localhost:3000/offline-fallback

### Бэкенд:
- **Laravel API**: http://localhost:8000
- **API Health Check**: http://localhost:8000/api/health
- **API Test**: http://localhost:8000/api/test
- **Feature Flags**: http://localhost:8000/api/features
- **PhpMyAdmin**: http://localhost:8080

## 🔧 Технологический стек

### Фронтенд:
- **Next.js 14** - React фреймворк
- **TypeScript** - типизация
- **Service Worker** - офлайн поддержка
- **PWA** - прогрессивное веб-приложение

### Бэкенд:
- **Laravel 12** - PHP фреймворк (последняя версия!)
- **PHP 8.4** - последняя версия PHP (максимальная производительность!)
- **MySQL 8.0** - база данных
- **Redis** - кэширование
- **Docker** - контейнеризация
- **Laravel Pennant** - система feature flags

## 🛠 Разработка

### Полезные команды:

#### Фронтенд:
```bash
cd my-offline-site
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен сборки
npm run lint         # Проверка кода
```

#### Бэкенд:
```bash
cd backend
docker-compose exec app php artisan migrate
docker-compose exec app php artisan make:controller ExampleController
docker-compose exec app php artisan make:model Example
```

## 📱 PWA функции

- **Service Worker** для офлайн работы
- **Manifest** для установки как приложение
- **Кэширование** ресурсов
- **Офлайн страницы** для лучшего UX

## 🔗 API интеграция

Фронтенд подключается к Laravel API через:
- REST API endpoints
- Асинхронные запросы
- Обработка ошибок сети
- Fallback для офлайн режима

## 🐳 Docker

Все сервисы запускаются через Docker Compose:
- Изолированная среда разработки
- Простое развертывание
- Консистентность между окружениями

## 📝 Документация

- [Frontend README](./my-offline-site/README.md)
- [Backend README](./backend/README.md)

## 🚨 Устранение неполадок

### Проблемы с портами:
Убедитесь, что порты 3000, 8000, 8080, 3306, 6379 свободны.

### Проблемы с Docker:
```bash
docker-compose down
docker-compose up -d --build
```

### Очистка кэша:
```bash
# Frontend
cd my-offline-site && npm run build

# Backend
docker-compose exec app php artisan cache:clear
```

## 📄 Лицензия

MIT License
