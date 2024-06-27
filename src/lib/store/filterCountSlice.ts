// Определение интерфейсов для каждой категории данных

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SourceType {
  social_network: number
  video: number
  messenger_chanel: number
  messenger_group: number
  news: number
}

export interface Sentiment {
  negative: number
  neutral: number
  positive: number
}

export interface Language {
  en: number
  ru: number
  kk: number
  unknown: number
}

export interface Tag {
  [id: string]: number
}

export interface MaterialType {
  post: number
  comment: number
  repost: number
  stories: number
  news: number
  unknown: number
}

interface AnalyticsData {
  filter_count_pending: boolean
  source_type: SourceType
  sentiment: Sentiment
  language: Language
  material_type: MaterialType
  material_count: number
  tags: Tag
}

const initialState: AnalyticsData = {
  filter_count_pending: false,
  source_type: {
    social_network: 0,
    video: 0,
    messenger_chanel: 0,
    messenger_group: 0,
    news: 0,
  },
  sentiment: {
    negative: 0,
    neutral: 0,
    positive: 0,
  },
  language: {
    en: 0,
    ru: 0,
    kk: 0,
    unknown: 0,
  },
  material_type: {
    post: 0,
    comment: 0,
    repost: 0,
    stories: 0,
    news: 0,
    unknown: 0,
  },
  material_count: 0,
  tags: {},
}

// Создание slice для аналитики с названием filterCountSlice
export const filterCountSlice = createSlice({
  name: "filterCount",
  initialState,
  reducers: {
    // Редьюсер setFilterCount для обновления состояния
    setFilterCount: (state, action: PayloadAction<AnalyticsData>) => {
      state.source_type = action.payload.source_type
      state.sentiment = action.payload.sentiment
      state.language = action.payload.language
      state.material_type = action.payload.material_type
      state.material_count = action.payload.material_count
      state.tags = action.payload.tags
    },
    setFilterCountPending: (state, action: PayloadAction<boolean>) => {
      state.filter_count_pending = action.payload
    },
  },
})

// Экспорт экшена setFilterCount для использования в компонентах или других частях приложения
export const { setFilterCount, setFilterCountPending } =
  filterCountSlice.actions

// Экспорт редьюсера для включения в store
export default filterCountSlice.reducer
