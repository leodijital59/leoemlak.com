import sehirlerData from './sehirler.json';
import ilcelerData from './ilceler.json';
import mahalleler1Data from './mahalleler-1.json';
import mahalleler2Data from './mahalleler-2.json';
import mahalleler3Data from './mahalleler-3.json';
import mahalleler4Data from './mahalleler-4.json';

// Type definitions for raw JSON data
interface SehirRaw {
  sehir_id: string;
  sehir_adi: string;
}

interface IlceRaw {
  ilce_id: string;
  ilce_adi: string;
  sehir_id: string;
}

interface MahalleRaw {
  mahalle_id: string;
  mahalle_adi: string;
  ilce_id: string;
  sehir_id: string;
}

// Cast imported data to proper types
const sehirler = sehirlerData as SehirRaw[];
const ilceler = ilcelerData as IlceRaw[];
const mahalleler = [
  ...mahalleler1Data,
  ...mahalleler2Data,
  ...mahalleler3Data,
  ...mahalleler4Data,
] as MahalleRaw[];

// Export provinces as simple string array
export const provinces: string[] = sehirler.map((s) => s.sehir_adi);

// Build sehir_id to sehir_adi map for lookups
const sehirIdToName = new Map<string, string>(
  sehirler.map((s) => [s.sehir_id, s.sehir_adi])
);

// Build ilce_id to ilce_adi map for lookups
const ilceIdToName = new Map<string, string>(
  ilceler.map((i) => [i.ilce_id, i.ilce_adi])
);

// Group districts by province (sehir_adi -> ilce_adi[])
export const districtsByProvince: Record<string, string[]> = ilceler.reduce(
  (acc, ilce) => {
    const sehirAdi = sehirIdToName.get(ilce.sehir_id);
    if (sehirAdi) {
      if (!acc[sehirAdi]) {
        acc[sehirAdi] = [];
      }
      acc[sehirAdi].push(ilce.ilce_adi);
    }
    return acc;
  },
  {} as Record<string, string[]>
);

// Mahalle type with unique id
export interface Neighborhood {
  id: string;
  name: string;
}

// Build ilce_id to full info map for lookups
const ilceIdToInfo = new Map<string, { ilce_adi: string; sehir_id: string }>(
  ilceler.map((i) => [i.ilce_id, { ilce_adi: i.ilce_adi, sehir_id: i.sehir_id }])
);

// Group neighborhoods by province+district (sehir_adi|ilce_adi -> Neighborhood[])
// Using combined key to handle duplicate district names across provinces
export const neighborhoodsByProvinceAndDistrict: Record<string, Neighborhood[]> = mahalleler.reduce(
  (acc, mahalle) => {
    const ilceInfo = ilceIdToInfo.get(mahalle.ilce_id);
    if (ilceInfo) {
      const sehirAdi = sehirIdToName.get(ilceInfo.sehir_id);
      if (sehirAdi) {
        const key = `${sehirAdi}|${ilceInfo.ilce_adi}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({
          id: mahalle.mahalle_id,
          name: mahalle.mahalle_adi,
        });
      }
    }
    return acc;
  },
  {} as Record<string, Neighborhood[]>
);
