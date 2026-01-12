export interface Agent {
  id: number
  city: string
  category: string
  name: string
  image: string
  email?: string
  phone?: string
  properties?: number
  rating?: number
}

export interface Agency {
  id: number
  name: string
  location: string
  image: string
  agents?: number
  properties?: number
  description?: string
}