import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Tag {
  name: string
  id: string
}

export interface Sentiment {
  name: string
  y: number
  color: string
}

export interface TagData {
  sentiment: Sentiment[]
  name: string
}

export interface ITagData {
  pending: boolean
  data: TagData[]
  tags: Tag[]
}

const initialState: ITagData = {
  pending: true,
  data: [],
  tags: [],
}

export const toneTagSlice = createSlice({
  name: "messageSource",
  initialState,
  reducers: {
    setToneTagData: (state, action: PayloadAction<TagData[]>) => {
      state.data = action.payload
    },
    setToneTagPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
    setToneTagList: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload
    },
  },
})

// Экспорт экшенов
export const { setToneTagData, setToneTagPending, setToneTagList } =
  toneTagSlice.actions

// Экспорт редьюсера
export default toneTagSlice.reducer
