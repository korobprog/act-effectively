"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";

interface UserData {
  name: string;
  email: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

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
          <p className="text-lg text-gray-600 mb-12">
            Вы можете добавить его на главный экран и использовать без интернета.
          </p>

          {isAuthenticated && user ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Добро пожаловать, {user.name}!
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
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
