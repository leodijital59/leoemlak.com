export interface Property {
  id: number
  image: string
  title: string
  city: string
  location: string
  bed: string
  bath: string
  sqft: number
  price: string
  forRent: boolean
  tags: string[]
  propertyType: string
  yearBuilding: number
  featured?: boolean
  lat: number
  long: number
  features: string[]
}

export interface PropertyFilter {
  location?: string
  propertyType?: string
  priceRange?: {
    min: number
    max: number
  }
  bedrooms?: string
  bathrooms?: string
  forRent?: boolean
  featured?: boolean
}

export interface PropertyCity {
  city: string
  count: number
  image?: string
}