"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi, userHelpers, type User } from "@/lib/api/auth";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authApi.getCurrentUser().then((userData) => {
        setIsAuthenticated(userData !== null);
        setUser(userData);
      });
    }
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🌐 Добро пожаловать!
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Этот сайт работает <strong>офлайн</strong> 🚀
          </p>

          {isAuthenticated && user ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-left mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Добро пожаловать, {user.name}!
                </h2>
                <p className="text-gray-600 mb-1">Email: {user.email}</p>
                <p className="text-gray-600 mb-4">Роль: {user.role}</p>
                
                {/* Показать бейдж роли */}
                <div className="inline-block">
                  {userHelpers.isSuperAdmin(user) && (
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      🔐 Супер-Администратор
                    </span>
                  )}
                  {userHelpers.isAdmin(user) && !userHelpers.isSuperAdmin(user) && (
                    <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      👨‍💼 Администратор
                    </span>
                  )}
                  {userHelpers.isUser(user) && (
                    <span className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      👤 Пользователь
                    </span>
                  )}
                </div>
              </div>

              {/* Показать панель администратора */}
              {userHelpers.isSuperAdmin(user) && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xl font-bold text-red-900 mb-3">
                    🔐 Панель супер-администратора
                  </h3>
                  <p className="text-red-700 mb-3">
                    У вас есть полные права доступа к системе
                  </p>
                  <Link
                    href="/admin"
                    className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Управление администраторами
                  </Link>
                </div>
              )}

              {userHelpers.isAdmin(user) && !userHelpers.isSuperAdmin(user) && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xl font-bold text-purple-900 mb-2">
                    👨‍💼 Панель администратора
                  </h3>
                  <p className="text-purple-700">
                    У вас есть права администратора
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Выйти
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔐 Авторизация
              </h2>
              <p className="text-gray-600 mb-6">
                Войдите или зарегистрируйтесь для доступа к функциям
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Войти
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📱 Попробуйте офлайн режим
            </h2>
            <p className="text-gray-600 mb-6">
              Перейдите на специальную страницу для работы без интернета
            </p>
            <Link
              href="/offline-fallback"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              🚀 Перейти в офлайн режим
            </Link>
          </div>

          <div className="bg-green-50 rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4">
              💡 Как использовать:
            </h3>
            <ul className="text-left max-w-2xl mx-auto space-y-2 text-green-800">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Нажмите кнопку выше для перехода в офлайн режим
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Отключите интернет и попробуйте добавить данные
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Данные сохранятся локально в браузере
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                При восстановлении интернета данные останутся
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}