import { z } from "zod";

export const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "price_asc", label: "Fiyat (Artan)" },
  { value: "price_desc", label: "Fiyat (Azalan)" },
] as const;

export const propertySearchSchema = z.object({
  q: z.string().optional().catch(undefined),
  listingType: z.enum(["sold", "rented"]).optional().catch(undefined),
  categoryId: z.uuid().optional().catch(undefined),
  priceMin: z.coerce.number().positive().optional().catch(undefined),
  priceMax: z.coerce.number().positive().optional().catch(undefined),
  rooms: z.coerce.number().int().positive().optional().catch(undefined),
  bathrooms: z.coerce.number().int().positive().optional().catch(undefined),
  province: z.string().optional().catch(undefined),
  district: z.string().optional().catch(undefined),
  neighborhood: z.string().optional().catch(undefined),
  grossAreaMin: z.coerce.number().int().positive().optional().catch(undefined),
  grossAreaMax: z.coerce.number().int().positive().optional().catch(undefined),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional().catch(undefined),
  page: z.coerce.number().int().positive().optional().catch(undefined),
});

export type PropertySearchParams = z.infer<typeof propertySearchSchema>;
