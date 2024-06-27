import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Tag {
  created_at: string
  updated_at: string
  _id: string
  name: string
  tag_color: string
  parsing_period: string
  organization_id: string
  keywords: string[]
  minus_keywords: string[]
  themes: any[]
  materials: any[]
}

interface TagsState {
  pending: boolean
  data: Tag[]
}

const initialState: TagsState = {
  pending: true,
  data: [],
}

export const tagSlice = createSlice({
  name: "tagSlice",
  initialState,
  reducers: {
    setTagData: (state, action: PayloadAction<Tag[]>) => {
      state.data = action.payload
    },
    setTagPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

export const { setTagPending, setTagData } = tagSlice.actions
export default tagSlice.reducer
