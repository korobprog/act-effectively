"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminApi, authApi, userHelpers, type User } from "@/lib/api/auth";

export default function UsersManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changingRoles, setChangingRoles] = useState<Set<number>>(new Set());

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

  const loadUsers = useCallback(async () => {
    try {
      const usersList = await adminApi.listUsers();
      setUsers(usersList || []);
      setError(null);
    } catch {
      setError("Ошибка загрузки пользователей");
    }
  }, []);

  useEffect(() => {
    checkAuth();
    if (user && userHelpers.isSuperAdmin(user)) {
      loadUsers();
    }
  }, [user, checkAuth, loadUsers]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      return;
    }

    try {
      await adminApi.deleteUser(id);
      loadUsers();
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Ошибка удаления пользователя");
      } else {
        setError("Ошибка удаления пользователя");
      }
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
    setChangingRoles(prev => new Set(prev).add(userId));
    try {
      await adminApi.updateUserRole(userId, newRole);
      loadUsers();
      setError(null);
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Ошибка изменения роли");
      } else {
        setError("Ошибка изменения роли");
      }
    } finally {
      setChangingRoles(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeText = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Супер-администратор';
      case 'admin':
        return 'Администратор';
      case 'user':
        return 'Пользователь';
      default:
        return role;
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">👥 Управление пользователями</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => router.push("/admin/notifications")}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 whitespace-nowrap text-sm"
              >
                📢 Push
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 whitespace-nowrap text-sm"
              >
                Админ-панель
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap text-sm"
              >
                🏠 Главная
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Все пользователи ({users.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Имя
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата регистрации
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Нет пользователей
                    </td>
                  </tr>
                ) : (
                  users.map((targetUser) => {
                    const isSuperAdmin = targetUser.role === 'super_admin';
                    const isCurrentUser = targetUser.id === user.id;
                    const isChanging = changingRoles.has(targetUser.id);

                    return (
                      <tr key={targetUser.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {targetUser.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {targetUser.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {targetUser.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(targetUser.role)}`}>
                            {getRoleBadgeText(targetUser.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          —
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {!isSuperAdmin && !isCurrentUser && (
                              <select
                                value={targetUser.role}
                                onChange={(e) => handleRoleChange(targetUser.id, e.target.value as 'admin' | 'user')}
                                disabled={isChanging}
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-900 bg-white"
                              >
                                <option value="user">Пользователь</option>
                                <option value="admin">Администратор</option>
                              </select>
                            )}
                            {!isSuperAdmin && !isCurrentUser && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(targetUser.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Удалить
                              </button>
                            )}
                            {(isSuperAdmin || isCurrentUser) && (
                              <span className="text-xs text-gray-500 italic">
                                {isSuperAdmin ? 'Нельзя изменять' : 'Нельзя удалить себя'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

