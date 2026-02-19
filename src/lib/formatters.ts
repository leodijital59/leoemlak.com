import { formatCapitilized } from "@/lib/format";

/**
 * Format numeric price as Turkish Lira with thousands separator
 */
export function formatPrice(price: string | number | null | undefined): string {
  if (!price) return '0 ₺'

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice)
}

/**
 * Format area with m² suffix
 */
export function formatArea(area: number | null | undefined): string {
  if (!area) return '-'
  return `${area} m²`
}

/**
 * Convert 'sold'/'rented' to 'Satılık'/'Kiralık'
 */
export function translateListingType(type: 'sold' | 'rented'): string {
  const translations = {
    sold: 'Satılık',
    rented: 'Kiralık',
  }
  return translations[type] || type
}

/**
 * Convert 'active'/'passive' to 'Aktif'/'Pasif'
 */
export function translateListingStatus(status: 'active' | 'passive'): string {
  const translations = {
    active: 'Aktif',
    passive: 'Pasif',
  }
  return translations[status] || status
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null

  // Regular YouTube URL
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)

  return match && match[7].length === 11 ? match[7] : null
}

/**
 * Combine province, district, neighborhood into display string
 */
export function formatAddress(
  province: string,
  district: string,
  neighborhood: string
): string {
  return [
    formatCapitilized(neighborhood),
    formatCapitilized(district),
    formatCapitilized(province)
  ]
  .filter(Boolean)
  .join(", ")
}

/**
 * Format floor information
 */
export function formatFloor(
  floorNumber: number | null | undefined,
  totalFloors: number | null | undefined = undefined
): string {
  if (!floorNumber && !totalFloors) return '-'
  if (!totalFloors) return `${floorNumber}. Kat`
  if (!floorNumber) return `${totalFloors} Katlı`
  return `${floorNumber}. Kat / ${totalFloors} Katlı Bina`
}

/**
 * Format building age
 */
export function formatBuildingAge(age: number | null | undefined): string {
  if (!age) return '-'
  if (age === 0) return 'Sıfır Bina'
  return `${age} Yıl`
}

/**
 * Format room count
 */
export function formatRooms(rooms: number | null | undefined): string {
  if (!rooms) return '-'
  return `${rooms}`
}
