import { ReactNode } from 'react'

export interface NavItem {
  id: number
  label: string
  href: string
  subMenu?: NavItem[]
}

export interface Tab {
  id: string
  label: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface Testimonial {
  id: number
  name: string
  role: string
  image: string
  rating: number
  text: string
}

export interface PageMeta {
  title: string
  description?: string
  keywords?: string[]
}

export interface LayoutProps {
  children: ReactNode
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}