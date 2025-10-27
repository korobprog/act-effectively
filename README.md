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

### 📝 Краткий чеклист

- [ ] Создать `backend/.env` с настройками базы данных и VAPID ключами
- [ ] Создать `frontend/.env.local` с URL API и VAPID публичным ключом
- [ ] Запустить Docker контейнеры
- [ ] Установить зависимости и выполнить миграции
- [ ] Сгенерировать VAPID ключи и добавить в оба .env файла
- [ ] Создать супер-администратора
- [ ] Запустить фронтенд

### ⚙️ Настройка переменных окружения

Перед запуском проекта необходимо настроить переменные окружения для бэкенда и фронтенда.

#### Backend (.env)

Создайте файл `backend/.env` со следующим содержимым:

```env
APP_NAME=Next.js Offline Site
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password

CACHE_STORE=redis
REDIS_HOST=redis
REDIS_PASSWORD=
REDIS_PORT=6379
REDIS_DB=0

# Настройки для супер-администратора
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=change_this_secure_password

# VAPID ключи для push-уведомлений
# Генерация: php artisan webpush:vapid
VAPID_SUBJECT=mailto:admin@example.com
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

**Примечание:** Для генерации VAPID ключей выполните:
```bash
docker-compose exec app php artisan webpush:vapid
```

#### Frontend (.env.local)

Создайте файл `frontend/.env.local`:

```env
# URL API бэкенда
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# VAPID публичный ключ для push-уведомлений (должен совпадать с бэкендом)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
```

**Важно:** 
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` должен совпадать с `VAPID_PUBLIC_KEY` в `backend/.env`
- Переменные с префиксом `NEXT_PUBLIC_` доступны в браузере

> **💡 Совет:** При первом запуске VAPID ключи будут пустыми. Вы сможете их добавить после выполнения команды `php artisan webpush:vapid`

#### Полный пример файлов

**backend/.env (минимальная конфигурация для работы)**

```env
APP_NAME=Next.js Offline Site
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0

SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=change_this_secure_password

VAPID_SUBJECT=mailto:admin@example.com
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

**frontend/.env.local (минимальная конфигурация)**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
```

---

### 1. Запуск бэкенда (Laravel API)

#### Первый запуск (настройка проекта)

**Шаг 1:** Убедитесь, что файлы `.env` созданы (см. раздел выше)

**Шаг 2:** Запустите Docker контейнеры:
```bash
# Запуск через npm (рекомендуется)
npm run backend:start

# Или через docker-compose напрямую
docker-compose up -d
```

**Шаг 3:** Установите зависимости Laravel:
```bash
docker-compose exec app composer install
```

**Шаг 4:** Сгенерируйте ключ приложения:
```bash
docker-compose exec app php artisan key:generate
```

**Шаг 5:** Выполните миграции базы данных:
```bash
docker-compose exec app php artisan migrate
```

**Шаг 6:** Сгенерируйте VAPID ключи для push-уведомлений:
```bash
docker-compose exec app php artisan webpush:vapid
```

Команда выведет что-то вроде:
```
VAPID Keys Generated!

Public Key:  BN7XqFVZp0...
Private Key: QCqN8jH4iL...
PEM File: /path/to/vapid-keys.pem
```

**Обновите файлы:**
1. Откройте `backend/.env` и добавьте ключи:
   ```env
   VAPID_PUBLIC_KEY=BN7XqFVZp0...
   VAPID_PRIVATE_KEY=QCqN8jH4iL...
   ```

2. Откройте `frontend/.env.local` и добавьте публичный ключ:
   ```env
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=BN7XqFVZp0...
   ```

> **⚠️ Важно:** Публичный и приватный ключи должны оставаться в секрете! Не коммитьте `.env` файлы в git.

**После обновления .env файлов перезапустите контейнеры:**
```bash
docker-compose restart app
```

**Шаг 7:** Создайте супер-администратора:
```bash
docker-compose exec app php artisan admin:create-super
```

Или с указанием параметров:
```bash
docker-compose exec app php artisan admin:create-super \
  --email=admin@example.com \
  --password=secure_password \
  --name="Super Admin"
```

#### Последующие запуски

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
```

**Другие полезные команды для бэкенда:**
```bash
npm run backend:stop      # Остановить бэкенд
npm run backend:logs      # Просмотр логов
npm run backend:restart   # Перезапустить бэкенд
npm run backend:status    # Статус контейнеров
```

### 2. Запуск фронтенда (Next.js)

#### Первый запуск

**Шаг 1:** Убедитесь, что создан файл `frontend/.env.local` (см. раздел выше)

**Шаг 2:** Установите зависимости:
```bash
cd frontend
npm install
```

**Шаг 3:** Запустите сервер разработки:
```bash
npm run dev
```

#### Последующие запуски

```bash
cd frontend
npm run dev
```

**Другие полезные команды:**
```bash
npm run build    # Сборка для продакшена
npm run start    # Запуск продакшен сборки
npm run lint     # Проверка кода
```

---

### ✅ Проверка работоспособности

После запуска бэкенда и фронтенда проверьте:

1. **Backend API:** http://localhost:8000/api/health
   - Должен вернуть `{"status":"ok"}`

2. **Frontend:** http://localhost:3000
   - Откроется главная страница

3. **Логи бэкенда:**
   ```bash
   docker-compose logs -f app
   ```

4. **Логи фронтенда:**
   - Проверьте консоль браузера (F12)

### 🎉 Вы готовы к работе!

**Следующие шаги:**
- Войдите под супер-администратором на http://localhost:3000/auth/login
- Откройте админ-панель для управления пользователями
- Настройте push-уведомления
- Ознакомьтесь с системой ролей

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

**Проверка занятости портов:**
```bash
# Linux/Mac
lsof -i :8000
netstat -ano | grep 8000

# Windows
netstat -ano | findstr :8000
```

### Проблемы с Docker:
```bash
# Остановить и пересоздать контейнеры
docker-compose down
docker-compose up -d --build

# Очистить все volumes (удалит данные БД)
docker-compose down -v
docker-compose up -d --build
```

### Проблемы с Laravel (.env файл):
```bash
# Если Laravel не видит .env файл
docker-compose exec app php artisan config:clear

# Пересоздать ключ приложения
docker-compose exec app php artisan key:generate

# Очистить кэш конфигурации
docker-compose exec app php artisan config:cache
```

### Проблемы с базой данных:
```bash
# Просмотр логов MySQL
docker-compose logs db

# Подключение к MySQL напрямую
docker-compose exec db mysql -u laravel_user -plaravel_password laravel_db

# Выполнить миграции заново (⚠️ удалит данные)
docker-compose exec app php artisan migrate:fresh
```

### Проблемы с VAPID ключами:
```bash
# Если push-уведомления не работают
# 1. Проверьте, что ключи одинаковые в backend/.env и frontend/.env.local
# 2. Перегенерируйте ключи:
docker-compose exec app php artisan webpush:vapid
# 3. Обновите оба .env файла
# 4. Перезапустите контейнеры:
docker-compose restart app
```

### Проблемы с Frontend:
```bash
# Очистка кэша Next.js
cd frontend
rm -rf .next
npm run dev

# Переустановка зависимостей
rm -rf node_modules package-lock.json
npm install
```

### Очистка кэша:
```bash
# Frontend
cd frontend && rm -rf .next && npm run build

# Backend
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear
```

### Полная переустановка (⚠️ удалит все данные):
```bash
# Остановить все контейнеры
docker-compose down -v

# Удалить все образы
docker-compose down --rmi all

# Запустить заново и следовать инструкциям "Первый запуск"
docker-compose up -d --build
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
```

### Частые ошибки:

**Ошибка: "Connection refused"**
- Проверьте, что Docker контейнеры запущены: `docker-compose ps`
- Убедитесь, что БД доступна: `docker-compose logs db`

**Ошибка: "Class does not exist"**
- Очистите кэш автозагрузки: `docker-compose exec app composer dump-autoload`

**Ошибка: "SQLSTATE[HY000] [1045] Access denied"**
- Проверьте пароль БД в `backend/.env`
- Убедитесь, что `DB_HOST=db` (имя контейнера)

**Ошибка: "Service Worker registration failed"**
- Проверьте, что приложение запущено на http://localhost (не https)
- Очистите кэш браузера
- Проверьте логи в консоли (F12)

## 📄 Лицензия

MIT License