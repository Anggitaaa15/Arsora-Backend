
import { z } from "zod";

// REGISTER VALIDATION
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter"),

  email: z
    .string()
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
});

// LOGIN VALIDATION
export const loginSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(1, "Password wajib diisi"),
});


