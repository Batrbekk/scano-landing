import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IMaterialFilterSlice {
  material_filter: {
    [key: string]: string[] | boolean | string
    sentiment: string[]
    material_type: string[]
    is_processed: boolean
    is_not_processed: boolean
    is_favourite: boolean
    language: string[]
    source_type: string[]
    sources: string[]
    views_number: string[]
    tags: string[]
    description: string
  }
  author_filter: {
    author_type: string[]
    age: number[][]
    gender: string[]
    subscriber_count: number[]
  }
  allFiltersArray: { filterName: string; value: string }[]
}

const initialState: IMaterialFilterSlice = {
  material_filter: {
    sentiment: [],
    material_type: [],
    is_processed: false,
    is_not_processed: false,
    is_favourite: false,
    language: [],
    source_type: [],
    sources: [],
    views_number: [],
    tags: [],
    description: "",
  },
  author_filter: {
    author_type: [],
    age: [],
    gender: [],
    subscriber_count: [],
  },
  allFiltersArray: [], // Тип автоматически выводится как { filterName: string; value: string; }[]
}

export const materialFilterSlice = createSlice({
  name: "materialFilter",
  initialState,
  reducers: {
    removeFilter: (
      state,
      action: PayloadAction<{ filterName: string; value: string }>
    ) => {
      const filterArray =
        state.material_filter[
          action.payload.filterName as keyof typeof state.material_filter
        ]
      if (Array.isArray(filterArray)) {
        state.material_filter[
          action.payload.filterName as keyof typeof state.material_filter
        ] = filterArray.filter((item) => item !== action.payload.value)
      }
      updateAllFiltersArray(state)
    },
    setSentiment: (state, action: PayloadAction<string[]>) => {
      state.material_filter.sentiment = action.payload
      updateAllFiltersArray(state)
    },
    setMaterialType: (state, action: PayloadAction<string[]>) => {
      state.material_filter.material_type = action.payload
      updateAllFiltersArray(state)
    },
    setIsProcessed: (state, action: PayloadAction<boolean>) => {
      state.material_filter.is_processed = action.payload
      updateAllFiltersArray(state)
    },
    setIsNotProcessed: (state, action: PayloadAction<boolean>) => {
      state.material_filter.is_not_processed = action.payload
      updateAllFiltersArray(state)
    },
    setIsFavourite: (state, action: PayloadAction<boolean>) => {
      state.material_filter.is_favourite = action.payload
      updateAllFiltersArray(state)
    },
    setLanguage: (state, action: PayloadAction<string[]>) => {
      state.material_filter.language = action.payload
      updateAllFiltersArray(state)
    },
    setSourceType: (state, action: PayloadAction<string[]>) => {
      state.material_filter.source_type = action.payload
      updateAllFiltersArray(state)
    },
    setSources: (state, action: PayloadAction<string[]>) => {
      state.material_filter.sources = action.payload
      updateAllFiltersArray(state)
    },
    setViewsNumber: (state, action: PayloadAction<any[]>) => {
      state.material_filter.views_number = action.payload
      updateAllFiltersArray(state)
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.material_filter.tags = action.payload
      updateAllFiltersArray(state)
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.material_filter.description = action.payload
    },
    // Reducers for author_filter
    setAuthorType: (state, action: PayloadAction<any[]>) => {
      state.author_filter.author_type = action.payload
      updateAllFiltersArray(state)
    },
    setAge: (state, action: PayloadAction<any[]>) => {
      state.author_filter.age = action.payload
      updateAllFiltersArray(state)
    },
    setGender: (state, action: PayloadAction<string[]>) => {
      state.author_filter.gender = action.payload
      updateAllFiltersArray(state)
    },
    setSubscriberCount: (state, action: PayloadAction<any[]>) => {
      state.author_filter.subscriber_count = action.payload
    },
  },
})

function updateAllFiltersArray(state: typeof initialState) {
  state.allFiltersArray = [
    ...state.material_filter.sentiment.map((value) => ({
      filterName: "sentiment",
      value,
    })),
    ...state.material_filter.material_type.map((value) => ({
      filterName: "material_type",
      value,
    })),
    ...state.material_filter.language.map((value) => ({
      filterName: "language",
      value,
    })),
    ...state.material_filter.source_type.map((value) => ({
      filterName: "source_type",
      value,
    })),
    ...state.material_filter.sources.map((value) => ({
      filterName: "sources",
      value,
    })),
    ...state.material_filter.tags.map((value) => ({
      filterName: "tags",
      value,
    })),
    ...state.author_filter.gender.map((value) => ({
      filterName: "gender",
      value,
    })),
    ...state.author_filter.author_type.map((value) => ({
      filterName: "author_type",
      value: String(value),
    })),
    ...state.author_filter.age.map((value) => ({
      filterName: "age",
      value: String(value),
    })),
  ]
}

export const {
  setDescription,
  removeFilter,
  setSentiment,
  setMaterialType,
  setIsProcessed,
  setIsNotProcessed,
  setIsFavourite,
  setLanguage,
  setSourceType,
  setSources,
  setViewsNumber,
  setTags,
  // Actions for author_filter
  setAuthorType,
  setAge,
  setGender,
  setSubscriberCount,
} = materialFilterSlice.actions

export default materialFilterSlice.reducer
