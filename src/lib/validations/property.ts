import { z } from "zod";

export const listingTypeOptions = [
  { value: "sold", label: "Satılık" },
  { value: "rented", label: "Kiralık" },
] as const;

export const listingStatusOptions = [
  { value: "active", label: "Aktif" },
  { value: "passive", label: "Pasif" },
] as const;

export const heatingTypeOptions = [
  { value: "Yok", label: "Yok" },
  { value: "Soba", label: "Soba" },
  { value: "Dogalgaz", label: "Doğalgaz" },
  { value: "Klima", label: "Klima" },
  { value: "Merkezi", label: "Merkezi" },
  { value: "Kombi", label: "Kombi" },
  { value: "Yerden", label: "Yerden Isıtma" },
  { value: "Elektrik", label: "Elektrikli" },
] as const;

const listingTypes = ["sold", "rented"] as const;
const listingStatuses = ["active", "passive"] as const;
const heatingTypes = ["Yok", "Soba", "Dogalgaz", "Klima", "Merkezi", "Kombi", "Yerden", "Elektrik"] as const;

export const propertyFormSchema = z.object({
  // Temel Bilgiler
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  categoryId: z.uuid({ message: "Kategori seçiniz" }),
  listingType: z.enum(listingTypes, { message: "İlan türü seçiniz" }),
  listingStatus: z.enum(listingStatuses),

  // Fiyat
  price: z.number().positive("Fiyat pozitif bir sayı olmalıdır"),
  pricePerSqm: z.number().positive().optional().nullable(),

  // Konum
  province: z.string().min(1, "İl zorunludur"),
  district: z.string().min(1, "İlçe zorunludur"),
  neighborhood: z.string().min(1, "Mahalle zorunludur"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

  // Metrekare
  grossArea: z.number().int().positive().optional().nullable(),
  netArea: z.number().int().positive().optional().nullable(),
  landArea: z.number().int().positive().optional().nullable(),

  // Oda
  rooms: z.number().int().positive().optional().nullable(),
  bathrooms: z.number().int().positive().optional().nullable(),

  // Bina
  buildingAge: z.number().int().positive().optional().nullable(),
  totalFloors: z.number().int().positive().optional().nullable(),
  floorNumber: z.number().int().optional().nullable(),
  heatingType: z.enum(heatingTypes).optional().nullable(),

  // Medya
  videoUrl: z.url("Geçerli bir URL giriniz").optional().nullable(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
