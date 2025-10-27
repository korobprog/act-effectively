"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminApi, authApi, userHelpers, type User } from "@/lib/api/auth";
import { notificationApi, type SendNotificationRequest } from "@/lib/api/notifications";

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [formData, setFormData] = useState({
    recipientType: "user" as "user" | "all-users" | "all-admins",
    selectedUserId: "" as string,
    title: "",
    body: "",
    url: ""
  });

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }
      if (!userHelpers.isSuperAdmin(currentUser)) {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);
    } catch {
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const usersList = await adminApi.listUsers();
      setUsers(usersList || []);
      setError(null);
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Ошибка загрузки пользователей");
      } else {
        setError("Ошибка загрузки пользователей");
      }
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user && formData.recipientType === "user") {
      loadUsers();
    }
  }, [user, formData.recipientType, loadUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const notificationData: SendNotificationRequest = {
        title: formData.title,
        body: formData.body,
        url: formData.url || undefined
      };

      let response: { data?: { devices?: number; count?: number; [key: string]: unknown } } | undefined;
      
      if (formData.recipientType === "user") {
        if (!formData.selectedUserId) {
          setError("Пожалуйста, выберите пользователя");
          setSending(false);
          return;
        }
        response = await notificationApi.sendToUser(parseInt(formData.selectedUserId), notificationData);
      } else if (formData.recipientType === "all-users") {
        response = await notificationApi.sendToAllUsers(notificationData);
      } else if (formData.recipientType === "all-admins") {
        response = await notificationApi.sendToAllAdmins(notificationData);
      }

      // Extract device count from response if available
      const data = response?.data;
      const devicesCount = data?.devices || data?.count || "устройств";
      
      let successMessage = "✅ Уведомление успешно отправлено";
      if (devicesCount !== "устройств") {
        successMessage += ` на ${devicesCount} ${devicesCount === 1 ? "устройство" : "устройств"}`;
      } else {
        successMessage += "!";
      }

      setSuccess(successMessage);
      
      // Clear form
      setFormData({
        recipientType: formData.recipientType,
        selectedUserId: "",
        title: "",
        body: "",
        url: ""
      });
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Ошибка отправки уведомления");
      } else {
        setError("Ошибка отправки уведомления");
      }
    } finally {
      setSending(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  if (!user || !userHelpers.isSuperAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">📢 Отправить Push-уведомление</h1>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Админ-панель
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                На главную
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Вы вошли как: <strong>{user.name}</strong> ({user.email})
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Форма отправки уведомления</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="recipient-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Получатель *
                </label>
                <select
                  id="recipient-type"
                  required
                  value={formData.recipientType}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    recipientType: e.target.value as "user" | "all-users" | "all-admins",
                    selectedUserId: ""
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="user">Конкретный пользователь</option>
                  <option value="all-users">Все пользователи</option>
                  <option value="all-admins">Все администраторы</option>
                </select>
              </div>

              {formData.recipientType === "user" && (
                <div>
                  <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Выбор пользователя *
                  </label>
                  {loadingUsers ? (
                    <div className="px-3 py-2 text-sm text-gray-600">Загрузка пользователей...</div>
                  ) : (
                    <select
                      id="user-select"
                      required={formData.recipientType === "user"}
                      value={formData.selectedUserId}
                      onChange={(e) => setFormData({ ...formData, selectedUserId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Выберите пользователя</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Заголовок *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  placeholder="Введите заголовок уведомления"
                />
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                  Сообщение *
                </label>
                <textarea
                  id="body"
                  required
                  rows={4}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 resize-y"
                  placeholder="Введите текст сообщения"
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL (необязательно)
                </label>
                <input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {sending ? "Отправка..." : "Отправить уведомление"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                >
                  Назад
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

