# Инструкция по настройке Dokploy для Frontend

## ✅ Что изменилось

Создан Dockerfile в корне проекта специально для Dokploy, который собирает frontend приложение.

## 🎯 Настройки в Dokploy

### Для Frontend приложения:

**Build Settings:**
- **Build Type**: `Dockerfile`
- **Build Path**: `.` (точка, текущая директория)
- **Docker File**: оставьте **пустым** или укажите `Dockerfile`
- **Docker Context Path**: оставьте **пустым** или укажите `.` (корень проекта)
- **Docker Build Stage**: оставьте **пустым**
- **Port**: `3000`

**Environment Variables:**
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://backend:8000/api
# или если backend на отдельном домене:
# NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## 🔄 После настройки

1. Нажмите **Deploy** в Dokploy
2. Дождитесь завершения сборки (может занять 3-5 минут)
3. Добавьте домен в настройках приложения

## ⚠️ Важно

Для полного функционирования приложения нужны также:
- Backend (отдельное приложение)
- База данных (PostgreSQL или MySQL)
- Redis (опционально)

## 📝 Следующие шаги

После успешного деплоя frontend:

1. Создайте второе приложение для backend
2. Настройте переменные окружения для backend
3. Добавьте домены для обоих приложений
4. Настройте CORS в backend для разрешения запросов с frontend домена

