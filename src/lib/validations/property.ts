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

export const buildingAgeOptions = [
  { value: "0", label: "0 (Sıfır)" },
  { value: "1-5", label: "1-5 Yıl" },
  { value: "6-10", label: "6-10 Yıl" },
  { value: "11-15", label: "11-15 Yıl" },
  { value: "16-20", label: "16-20 Yıl" },
  { value: "21+", label: "21+ Yıl" },
] as const;

const listingTypes = ["sold", "rented"] as const;
const listingStatuses = ["active", "passive"] as const;
const heatingTypes = ["Yok", "Soba", "Dogalgaz", "Klima", "Merkezi", "Kombi", "Yerden", "Elektrik"] as const;
const buildingAges = ["0", "1-5", "6-10", "11-15", "16-20", "21+"] as const;

export const propertyFormSchema = z.object({
  // Temel Bilgiler
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  categoryId: z.string().uuid({ message: "Kategori seçiniz" }),
  listingType: z.enum(listingTypes, { message: "İlan türü seçiniz" }),
  listingStatus: z.enum(listingStatuses).default("active"),

  // Fiyat
  price: z.coerce.number().positive("Fiyat pozitif bir sayı olmalıdır"),
  pricePerSqm: z.coerce.number().positive().optional().nullable(),

  // Konum
  province: z.string().min(1, "İl zorunludur"),
  district: z.string().min(1, "İlçe zorunludur"),
  neighborhood: z.string().min(1, "Mahalle zorunludur"),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),

  // Metrekare
  grossArea: z.coerce.number().int().positive().optional().nullable(),
  netArea: z.coerce.number().int().positive().optional().nullable(),
  landArea: z.coerce.number().int().positive().optional().nullable(),

  // Oda
  rooms: z.coerce.number().int().positive().optional().nullable(),
  bathrooms: z.coerce.number().int().positive().optional().nullable(),

  // Bina
  buildingAge: z.enum(buildingAges).optional().nullable(),
  totalFloors: z.coerce.number().int().positive().optional().nullable(),
  floorNumber: z.coerce.number().int().optional().nullable(),
  heatingType: z.enum(heatingTypes).optional().nullable(),

  // Boolean özellikler
  hasBalconies: z.boolean().default(false),
  hasElevator: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasSecurity: z.boolean().default(false),
  isFurnished: z.boolean().default(false),
  isWithinSite: z.boolean().default(false),

  // Medya
  videoUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
