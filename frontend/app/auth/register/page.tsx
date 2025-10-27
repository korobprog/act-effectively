"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authApi } from "@/lib/api/auth";
import { type RegisterInput, registerSchema } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const { name, email, password } = data;
      await authApi.register(name, email, password);
      router.push("/auth/login?registered=true");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error.response?.data?.message ||
          error.message ||
          "Ошибка при регистрации. Попробуйте еще раз.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Регистрация</h1>
          <p className="text-gray-600">Создайте новый аккаунт</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Имя
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Иван Иванов"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-400 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Уже есть аккаунт?{" "}
            <Link
              href="/auth/login"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
