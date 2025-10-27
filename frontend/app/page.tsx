"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi, type User, userHelpers } from "@/lib/api/auth";
import { subscribeToPushNotifications } from "@/lib/push-notifications";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("");

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

  const handleSubscribeToPush = async () => {
    try {
      setSubscriptionStatus("Подписка...");
      const success = await subscribeToPushNotifications();
      if (success) {
        setSubscriptionStatus("✓ Подписка успешна!");
      } else {
        setSubscriptionStatus("Ошибка подписки");
      }
    } catch (error) {
      console.error("Ошибка подписки:", error);
      setSubscriptionStatus(`Ошибка: ${(error as Error).message}`);
    }
  };

  const renderRoleBadge = (currentUser: User) => {
    if (userHelpers.isSuperAdmin(currentUser)) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-red-600/90 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
          🔐 Супер-администратор
        </span>
      );
    }

    if (userHelpers.isAdmin(currentUser)) {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-purple-600/90 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
          👨‍💼 Администратор
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-gray-800/90 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
        👤 Пользователь
      </span>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100">
      <div className="pointer-events-none absolute inset-x-0 top-[-18rem] -z-10 flex justify-center blur-3xl sm:top-[-12rem]">
        <div className="aspect-[1155/678] w-[72rem] bg-gradient-to-r from-sky-200 via-indigo-200 to-purple-200 opacity-50" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start">
          <section className="flex flex-col gap-10 text-center lg:text-left">
            <div className="space-y-6">
              <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700 shadow-sm backdrop-blur lg:mx-0">
                Онлайн и офлайн доступность
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
                  Управляйте процессами{" "}
                  <span className="text-indigo-600">эффективно</span>
                </h1>
                <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
                  Платформа сохраняет данные даже без интернета, а при
                  подключении продолжает работу без потерь. Получайте
                  уведомления, контролируйте роли и оставайтесь на связи с
                  командой.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/offline-fallback"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
                >
                  🚀 Попробовать офлайн режим
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                {!isAuthenticated && (
                  <Link
                    href="/auth/register"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
                  >
                    ✨ Создать аккаунт
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur-sm sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                  📡
                </span>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Работает всегда
                  </h3>
                  <p className="text-sm text-slate-600">
                    Оставайтесь продуктивными даже без подключения к сети.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                  🔔
                </span>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Push-уведомления
                  </h3>
                  <p className="text-sm text-slate-600">
                    Моментально получайте важные события и обновления.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur">
              {isAuthenticated && user ? (
                <div className="space-y-6 text-left">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Привет, {user.name}!
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {renderRoleBadge(user)}
                    </div>
                    <p className="text-sm text-slate-500">
                      Email: {user.email}
                    </p>
                    <p className="text-sm text-slate-500">
                      Роль в системе: {user.role}
                    </p>
                  </div>

                  {userHelpers.isSuperAdmin(user) && (
                    <div className="space-y-3 rounded-2xl border border-red-100 bg-red-50/70 p-4">
                      <h3 className="text-lg font-semibold text-red-900">
                        🔐 Панель супер-администратора
                      </h3>
                      <p className="text-sm text-red-700">
                        Полный контроль над доступом и пользователями.
                      </p>
                      <Link
                        href="/admin"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        Управление администраторами
                      </Link>
                    </div>
                  )}

                  {userHelpers.isAdmin(user) &&
                    !userHelpers.isSuperAdmin(user) && (
                      <div className="space-y-2 rounded-2xl border border-purple-100 bg-purple-50/70 p-4">
                        <h3 className="text-lg font-semibold text-purple-900">
                          👨‍💼 Панель администратора
                        </h3>
                        <p className="text-sm text-purple-700">
                          Управляйте задачами и помогайте команде.
                        </p>
                      </div>
                    )}

                  {!userHelpers.isSuperAdmin(user) && (
                    <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
                          🔔
                        </span>
                        <h3 className="text-lg font-semibold text-blue-900">
                          Push-уведомления
                        </h3>
                      </div>
                      <p className="text-sm text-blue-700">
                        Подпишитесь, чтобы сразу узнавать о важных действиях и
                        уведомлениях.
                      </p>
                      <button
                        type="button"
                        onClick={handleSubscribeToPush}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        🔔 Подписаться на уведомления
                      </button>
                      {subscriptionStatus && (
                        <p className="text-xs text-slate-500">
                          {subscriptionStatus}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      🔐 Начните работу
                    </h2>
                    <p className="text-sm text-slate-600">
                      Создайте аккаунт или войдите, чтобы открыть
                      персонализированный доступ и уведомления.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/auth/login"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Войти в систему
                    </Link>
                    <Link
                      href="/auth/register"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:text-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Зарегистрироваться
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="mt-16 grid gap-6 rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur-sm sm:grid-cols-2 lg:mt-20">
          <article className="space-y-3 rounded-2xl border border-slate-100 bg-white/80 p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              📱 Быстрый доступ офлайн
            </h3>
            <p className="text-sm text-slate-600">
              Мы подготовили специальную страницу, которая продолжит работать
              даже без подключения. Загрузите её заранее и оставайтесь в курсе.
            </p>
            <Link
              href="/offline-fallback"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
            >
              Перейти к офлайн режиму →
            </Link>
          </article>
          <article className="space-y-3 rounded-2xl border border-slate-100 bg-white/80 p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              ⚙️ Гибкая система ролей
            </h3>
            <p className="text-sm text-slate-600">
              Управляйте командой, назначайте роли и разрешения, быстро
              реагируйте на изменения и уведомления.
            </p>
            <p className="text-sm font-medium text-slate-700">
              Администраторы получают расширенный доступ, а супер-админы —
              полный контроль.
            </p>
          </article>
        </section>

        <section className="mt-14 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-8 shadow-md backdrop-blur-sm sm:p-10">
          <h3 className="text-2xl font-bold text-emerald-900">
            💡 Советы по работе в офлайне
          </h3>
          <ul className="mt-6 space-y-3 text-left text-sm text-emerald-800 sm:text-base">
            <li className="flex gap-3">
              <span className="text-lg">✓</span>
              Сохраните офлайн-страницу заранее и убедитесь, что данные доступны
              без сети.
            </li>
            <li className="flex gap-3">
              <span className="text-lg">✓</span>
              Работайте автономно: задачи и заметки сохраняются локально в
              браузере.
            </li>
            <li className="flex gap-3">
              <span className="text-lg">✓</span>
              После подключения к интернету продолжайте работу — данные
              останутся на месте.
            </li>
            <li className="flex gap-3">
              <span className="text-lg">✓</span>
              Подписывайтесь на уведомления, чтобы ничего не пропустить, когда
              сеть вернётся.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
