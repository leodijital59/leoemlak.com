export interface BlogDate {
  month: string
  day: string
}

export interface Blog {
  id: number
  image: string
  date: BlogDate
  tag: string
  title: string
  text?: string
  author?: string
  comments?: number
  views?: number
}

export interface BlogComment {
  id: number
  author: string
  date: string
  text: string
  avatar?: string
}