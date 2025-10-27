import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Неверный формат email"),
  password: z
    .string()
    .min(1, "Пароль обязателен")
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

// Register validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(255, "Имя слишком длинное"),
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Неверный формат email"),
  password: z
    .string()
    .min(1, "Пароль обязателен")
    .min(8, "Пароль должен содержать минимум 8 символов")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
    .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
    .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
  confirmPassword: z.string().min(1, "Подтвердите пароль"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

