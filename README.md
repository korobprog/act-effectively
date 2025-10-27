# 📱 Next.js Offline Site with Laravel Backend

Полнофункциональное веб-приложение с Next.js фронтендом и Laravel API бэкендом, поддерживающее офлайн режим.

## 🏗 Архитектура проекта

```
next-offline/
├── frontend/          # Next.js фронтенд (PWA)
├── backend/           # Laravel API бэкенд
├── docks/            # Документация
└── docker-compose.yml # Docker конфигурация
```

## 🚀 Возможности

### Frontend (Next.js PWA):
- **PWA функциональность** - установка как приложение на мобильные устройства
- **Офлайн режим** - работа без подключения к интернету
- **Локальное хранилище** - сохранение данных в браузере
- **Автоматическое кэширование** - ресурсы кэшируются автоматически
- **Responsive дизайн** - адаптивный интерфейс для всех устройств

### Backend (Laravel API):
- **REST API** - полнофункциональный API
- **Feature Flags** - система управления функциями
- **Database** - MySQL с миграциями
- **Caching** - Redis для кэширования
- **Docker** - контейнеризация
- **Система ролей** - три уровня доступа с безопасной иерархией

## 👥 Система ролей и доступа

Проект использует трёхуровневую систему ролей с иерархией доступа.

### 🎭 Типы пользователей

| Роль | Уровень доступа | Способ создания | Возможности |
|------|----------------|-----------------|-------------|
| **user** | 1 | Регистрация через API | Базовый доступ к приложению |
| **admin** | 2 | Создаётся супер-админом | Управление пользователями |
| **super_admin** | 3 | Только из .env | Управление администраторами |

### 🔑 Создание супер-администратора

Супер-администратор создаётся через консольную команду с данными из `.env`:

**Шаг 1:** Добавьте в `.env`:
```env
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your_secure_password
```

**Шаг 2:** Выполните команду:
```bash
php artisan admin:create-super
```

**Что происходит:**
- ✅ Email берётся из `SUPER_ADMIN_EMAIL`
- ✅ Пароль берётся из `SUPER_ADMIN_PASSWORD`
- ✅ Пароль хешируется и сохраняется в БД
- ✅ Роль устанавливается как `super_admin`

**Альтернатива:** Создание с параметрами:
```bash
php artisan admin:create-super \
  --email=admin@example.com \
  --password=secure123 \
  --name="Super Admin"
```

### 👨‍💼 Создание администраторов

Только супер-администратор может создавать других администраторов через API:

**Endpoint:** `POST /api/admin/create`

**Заголовки:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Тело запроса:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "secure_password",
  "password_confirmation": "secure_password"
}
```

**Успешный ответ:**
```json
{
  "message": "Администратор успешно создан",
  "admin": {
    "id": 2,
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 🔒 Система безопасности

**Проверка прав доступа:**
```php
// В User модели определены методы:
$user->isSuperAdmin();      // Проверка супер-админа
$user->isAdmin();           // Проверка админа (включая супер-админа)
$user->hasAdminAccess();    // Проверка доступа к админ панели
$user->canManageAdmins();   // Только для супер-админа
```

**Иерархия доступа:**
```
super_admin → может управлять admin и user
admin       → может управлять user
user        → базовый доступ
```

**Middleware:** Все администраторские маршруты защищены:
- `auth:sanctum` - проверка аутентификации
- Дополнительные проверки прав в контроллерах

### 📝 Примеры использования API

**Получение списка администраторов:**
```bash
GET /api/admin/list
Authorization: Bearer {super_admin_token}
```

**Удаление администратора:**
```bash
DELETE /api/admin/{id}
Authorization: Bearer {super_admin_token}
```

**Важно:** Супер-администратор не может удалить свой собственный аккаунт
## 🚀 Быстрый старт

### 1. Запуск бэкенда (Laravel API)

**Вариант 1: Через npm (самый простой)**
```bash
npm run backend:start
```

**Вариант 2: Через скрипт**
```bash
./start-backend.sh
```

**Вариант 3: Ручной запуск**
```bash
docker-compose up -d
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
```

**Другие полезные команды для бэкенда:**
```bash
npm run backend:stop      # Остановить бэкенд
npm run backend:logs      # Просмотр логов
npm run backend:restart   # Перезапустить бэкенд
npm run backend:status    # Статус контейнеров
```

### 2. Запуск фронтенда (Next.js)

```bash
cd frontend
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

## 🛠 Технологический стек

### Фронтенд:
- **Next.js 15** - React фреймворк
- **next-pwa** - PWA функциональность
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Service Worker** - офлайн кэширование

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
cd frontend
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен сборки
npm run lint         # Проверка кода
```

#### Бэкенд:
```bash
# Управление бэкендом через npm:
npm run backend:start     # Запустить бэкенд
npm run backend:stop      # Остановить бэкенд
npm run backend:logs      # Просмотр логов
npm run backend:restart   # Перезапустить
npm run backend:status    # Статус

# Или через Docker напрямую:
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

- [📋 Чек-лист реализации](./IMPLEMENTATION_CHECKLIST.md) - полный список реализованного функционала
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Docks](./docks/) - дополнительная документация

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
cd frontend && npm run build

# Backend
docker-compose exec app php artisan cache:clear
```

## 📄 Лицензия

MIT License