import { z } from "zod";

export const featureFormSchema = z.object({
  name: z.string().min(2, "Özellik adı en az 2 karakter olmalıdır"),
});

export type FeatureFormValues = z.infer<typeof featureFormSchema>;
