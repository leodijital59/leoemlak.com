import { z } from "zod";

// Create user form schema
export const createUserFormSchema = z.object({
  email: z.email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  role: z.enum(["user", "admin"], {
    error: "Rol seçiniz",
  }),
});

// Update user form schema
export const updateUserFormSchema = z.object({
  userId: z.string(),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  role: z.enum(["user", "admin"], {
    error: "Rol seçiniz",
  }),
});

// Ban user form schema
export const banUserFormSchema = z.object({
  userId: z.string(),
  banReason: z.string().min(5, "Yasaklama nedeni en az 5 karakter olmalıdır"),
  banExpiresIn: z.number().optional(), // Duration in seconds
});

// Unban user schema
export const unbanUserFormSchema = z.object({
  userId: z.string(),
});

// TypeScript types
export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;
export type BanUserFormData = z.infer<typeof banUserFormSchema>;
export type UnbanUserFormData = z.infer<typeof unbanUserFormSchema>;
