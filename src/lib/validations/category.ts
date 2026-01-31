import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır"),
  parentId: z.uuid().nullable().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
