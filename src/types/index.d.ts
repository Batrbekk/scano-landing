export type SiteConfig = {
  name: string
  author: string
  description: string
  keywords: Array<string>
  url: {
    base: string
    author: string
  }
  links: {
    github: string
  }
  ogImage: string
}

export type ThemeInUser = {
  id: string
  name: string
}

export type UserData = {
  full_name?: string
  created_at: string
  updated_at: string
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
  is_active: boolean
  organization_id: string
  company_name: string
  photo_url: string
  timezone: string
  interface_language: string | null
  themes: ThemeInUser[]
}

export type ThemeData = {
  created_at: string
  updated_at: string
  _id: string
  name: string
  group_id: string
  user_id: string
  organization_id: string | null
  keywords: Array<string>
  minus_keywords: Array<string>
  source_types: Array<string>
  language: string
  exclude_sources: Array<string>
  theme_type: string
  material_types: Array<string>
  search_domains: Array<string>
  tags: Array<string>
  is_active: boolean
  materials_count_percent: number
  materials_count: number
  materials_count_max: number
  today: {
    positive: number
    negative: number
    neutral: number
    total: number
  }
  week: {
    positive: number
    negative: number
    neutral: number
    total: number
  }
  total: {
    positive: number
    negative: number
    neutral: number
    total: number
  }
  countries: Array<string>
}

export type TagData = {
  created_at: string
  updated_at: string
  _id: string
  name: string
  keywords: string[]
  minus_keywords: string[]
  tag_color: string
  parsing_period: string
  organization_id: string
  themes: any[]
  materials: any[]
}

export type MaterialData = {
  title: string
  description: string
  created_at: string
  updated_at: string
  _id: string
  language: string
  url: string
  comments_number: number
  material_type: string
  likes_number: number
  reposts_number: number
  views_number: number
  source: {
    source_type: string
    name: string
    url: string
  }
  country_id: string
  city_id: string | null
  author_id: string
  theme_id: string
  sentiment: string
  subscriber_count: number
  real_created_at: string
  img_url: string
  tags: string[]
  is_processed: boolean
  is_favourite: boolean
}

export type NotificationData = {
  created_at: string
  updated_at: string
  _id: string
  telegram_channels: any[]
  email_list: string[]
  theme_id: string
  organization_id: string
  is_email: boolean
  is_telegram: boolean
  theme: {
    id: string
    name: string
  }
}

export type SubscribeData = {
  id: string
  theme: {
    id: string
    name: string
  }
  file_format_types: string[]
  emails: string[]
  header: string
  subheader: string
}

export type SubsData = {
  theme: {
    id: string
    name: string
  }
  file_format_types: string[]
  emails: string[]
  header: string
  subheader: string
}

export type TelegramsData = {
  id: string
  chat_id: string
  name: string
}
