import type { propertiesTable, propertyImagesTable } from '@/schema'

export type PropertyData = typeof propertiesTable.$inferSelect

export type PropertyImage = typeof propertyImagesTable.$inferSelect

export type PropertyFeature = {
  featureId: string
  value: boolean
  featureName: string
}

export type PropertyDetailData = {
  property: PropertyData
  images: PropertyImage[]
  features: PropertyFeature[]
}
