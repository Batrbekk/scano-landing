import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface MaterialData {
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

export interface MaterialsState {
  materials: MaterialData[]
  pending: boolean
  pageCount: number
  materialsTotal: number
}

const initialState: MaterialsState = {
  materials: [],
  pending: true,
  pageCount: 0,
  materialsTotal: 0,
}

export const materialTrashSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {
    getTrashMaterials: (
      state,
      action: PayloadAction<{ materials: MaterialData[]; pageCount: number }>
    ) => {
      const { materials, pageCount } = action.payload
      return {
        materials: state.materials,
        pending: state.pending,
        pageCount: state.pageCount,
        materialsTotal: state.materialsTotal,
      }
    },
    setTrashMaterials: (
      state,
      action: PayloadAction<{ materials: MaterialData[] }>
    ) => {
      const { materials } = action.payload
      state.materials = materials
    },
    setTrashPending: (state, action: PayloadAction<{ pending: boolean }>) => {
      const { pending } = action.payload
      state.pending = pending
    },
    setTrashPageCount: (
      state,
      action: PayloadAction<{ pageCount: number }>
    ) => {
      const { pageCount } = action.payload
      state.pageCount = pageCount
    },
    setTrashMaterialsTotal: (
      state,
      action: PayloadAction<{ materialsTotal: number }>
    ) => {
      const { materialsTotal } = action.payload
      state.materialsTotal = materialsTotal
    },
  },
})

export const {
  getTrashMaterials,
  setTrashMaterials,
  setTrashMaterialsTotal,
  setTrashPending,
  setTrashPageCount,
} = materialTrashSlice.actions
export default materialTrashSlice.reducer