"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminApi, authApi, userHelpers, type User } from "@/lib/api/auth";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Admin registration form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAdmin, setCreatedAdmin] = useState<{ email: string; password: string } | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }
      if (!userHelpers.isSuperAdmin(currentUser)) {
        router.push("/");
        return;
      }
      setUser(currentUser);
    } catch {
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const loadAdmins = useCallback(async () => {
    try {
      const adminsList = await adminApi.listAdmins();
      setAdmins(adminsList || []);
      setError(null);
    } catch {
      setError("Ошибка загрузки администраторов");
    }
  }, []);

  const generatePassword = (): string => {
    const length = 16;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    const allChars = uppercase + lowercase + numbers + symbols;
    
    let password = "";
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split("").sort(() => Math.random() - 0.5).join("");
  };

  const handleGeneratePassword = () => {
    setFormData({ ...formData, password: generatePassword() });
  };

  const handleCopyCredentials = async () => {
    if (createdAdmin) {
      const text = `Логин: ${createdAdmin.email}\nПароль: ${createdAdmin.password}`;
      await navigator.clipboard.writeText(text);
      alert("Учетные данные скопированы в буфер обмена!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await adminApi.createAdmin(formData.name, formData.email, formData.password);
      setCreatedAdmin({ email: formData.email, password: response.password });
      setFormData({ name: "", email: "", password: "" });
      setShowForm(false);
      loadAdmins();
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Ошибка создания администратора");
      } else {
        setError("Ошибка создания администратора");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого администратора?")) {
      return;
    }

    try {
      await adminApi.deleteAdmin(id);
      loadAdmins();
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Ошибка удаления администратора");
      } else {
        setError("Ошибка удаления администратора");
      }
    }
  };

  useEffect(() => {
    checkAuth();
    if (user && userHelpers.isSuperAdmin(user)) {
      loadAdmins();
    }
  }, [user, checkAuth, loadAdmins]);

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
            <h1 className="text-2xl font-bold text-gray-900">🔐 Панель супер-администратора</h1>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push("/admin/users")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Управление пользователями
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

        {createdAdmin && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
            <p className="font-semibold mb-2">✅ Администратор успешно создан!</p>
            <p className="mb-2">Логин: <strong>{createdAdmin.email}</strong></p>
            <p className="mb-2">Пароль: <strong>{createdAdmin.password}</strong></p>
            <button
              type="button"
              onClick={handleCopyCredentials}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              📋 Копировать учетные данные
            </button>
            <button
              type="button"
              onClick={() => setCreatedAdmin(null)}
              className="ml-2 text-green-700 hover:text-green-800 text-sm underline"
            >
              Скрыть
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Создать нового администратора</h2>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                {showForm ? "Скрыть форму" : "Показать форму"}
              </button>
            </div>
          </div>
          {showForm && (
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="admin-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Имя
                  </label>
                  <input
                    id="admin-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="admin-password"
                      type="text"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 whitespace-nowrap"
                    >
                      Генерировать
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Создание..." : "Создать администратора"}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Список администраторов</h2>
          </div>
          <div className="p-6">
            {admins.length === 0 ? (
              <p className="text-gray-600">Нет зарегистрированных администраторов</p>
            ) : (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{admin.name}</p>
                      <p className="text-sm text-gray-700">{admin.email}</p>
                      <p className="text-xs font-medium text-gray-800">Роль: {admin.role}</p>
                    </div>
                    {admin.id !== user.id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}