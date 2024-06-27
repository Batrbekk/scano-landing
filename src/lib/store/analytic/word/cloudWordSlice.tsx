import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Sentiment {
  name: string
  y: number
  color: string
}

export interface WordData {
  pending: boolean
  data: Sentiment[]
}

const initialState: WordData = {
  pending: true,
  data: [],
}

export const cloudWordSlice = createSlice({
  name: "cloudWord",
  initialState,
  reducers: {
    setCloudWordData: (state, action: PayloadAction<Sentiment[]>) => {
      state.data = action.payload
    },
    setCloudWordPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

export const { setCloudWordData, setCloudWordPending } = cloudWordSlice.actions

export default cloudWordSlice.reducer
