# 🚀 Laravel 12 Update Guide

## ✅ Обновление завершено!

Ваш Laravel проект успешно обновлен с версии 10.x до **Laravel 12** с **PHP 8.3**.

## 🆕 Новые возможности Laravel 12

### 🎯 **Laravel Pennant** - Feature Flags
- **Управление функциями** - включайте/выключайте функции для разных пользователей
- **A/B тестирование** - тестируйте новые функции на части пользователей
- **Постепенный rollout** - постепенно внедряйте новые функции

### 🔧 **Улучшенная архитектура**
- **Новый bootstrap/app.php** - упрощенная конфигурация приложения
- **Middleware в bootstrap** - настройка middleware в одном месте
- **Улучшенная производительность** - быстрее загрузка и выполнение

### 🛡️ **Безопасность**
- **Обновленные зависимости** - последние версии всех пакетов
- **Улучшенная аутентификация** - новые возможности Sanctum 4.0
- **Безопасность по умолчанию** - улучшенные настройки безопасности

## 📋 Новые API Endpoints

### `/api/health` - Проверка состояния
```json
{
  "status": "ok",
  "message": "Laravel API is running",
  "version": "12.0.0",
  "php_version": "8.3.x",
  "laravel_version": "12.x"
}
```

### `/api/test` - Тест с feature flags
```json
{
  "message": "Test endpoint working",
  "data": {
    "version": "12.0.0",
    "features": {
      "new_api": false,
      "pennant_enabled": true
    }
  }
}
```

### `/api/features` - Feature flags
```json
{
  "features": {
    "site-redesign": true,
    "billing-v2": false,
    "App\\Features\\NewApi": false
  },
  "new_api_active": false
}
```

## 🔧 Как использовать Feature Flags

### В контроллерах:
```php
use Laravel\Pennant\Feature;

// Проверить активность функции
if (Feature::active('new-api', $user)) {
    // Новая логика
} else {
    // Старая логика
}

// Условное выполнение
Feature::when('new-api', 
    fn() => $this->newApiResponse(),
    fn() => $this->oldApiResponse()
);
```

### В Blade шаблонах:
```blade
@feature('site-redesign')
    <!-- Новый дизайн -->
@else
    <!-- Старый дизайн -->
@endfeature

@featureany(['new-api', 'beta'])
    <!-- Если любая функция активна -->
@endfeatureany
```

### В моделях:
```php
// Если модель использует HasFeatures trait
if ($user->features()->active('new-api')) {
    // Логика для пользователя с активной функцией
}
```

## 🚀 Запуск обновленного проекта

### Автоматический запуск:
```bash
cd backend
./update-laravel.sh
```

### Ручной запуск:
```bash
cd backend
docker-compose down
docker-compose run --rm app composer install
docker-compose run --rm app php artisan key:generate
docker-compose run --rm app php artisan migrate --force
docker-compose up -d
```

## 🧪 Тестирование обновления

### Проверка API:
```bash
# Health check
curl http://localhost:8000/api/health

# Test endpoint
curl http://localhost:8000/api/test

# Feature flags
curl http://localhost:8000/api/features
```

### Проверка в браузере:
- **Главная страница**: http://localhost:8000
- **API Health**: http://localhost:8000/api/health
- **Feature Flags**: http://localhost:8000/api/features
- **PhpMyAdmin**: http://localhost:8080

## 📊 Что изменилось

### Файлы обновлены:
- ✅ `composer.json` - Laravel 12, PHP 8.2+, Sanctum 4.0
- ✅ `Dockerfile` - PHP 8.3
- ✅ `bootstrap/app.php` - новая архитектура Laravel 12
- ✅ `app/Http/Kernel.php` - middleware перенесены в bootstrap
- ✅ `app/Providers/AppServiceProvider.php` - Laravel Pennant
- ✅ `app/Http/Controllers/ApiController.php` - новые endpoints

### Новые файлы:
- ✅ `app/Features/NewApi.php` - пример feature flag
- ✅ `app/Http/Middleware/EnsureEmailIsVerified.php` - middleware
- ✅ `update-laravel.sh` - скрипт обновления

## 🎉 Готово!

Ваш Laravel проект теперь использует:
- **Laravel 12** - последняя версия фреймворка
- **PHP 8.3** - последняя версия PHP
- **Laravel Pennant** - система feature flags
- **Sanctum 4.0** - обновленная аутентификация
- **Все зависимости** - последние стабильные версии

Проект готов к разработке с новыми возможностями Laravel 12!
