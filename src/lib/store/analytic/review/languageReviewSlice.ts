import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Sentiment {
  name: string
  y: number
  color: string
}

export interface LanguageData {
  pending: boolean
  data: Sentiment[]
}

const initialState: LanguageData = {
  pending: true,
  data: [],
}

export const languageReviewSlice = createSlice({
  name: "languageReview",
  initialState,
  reducers: {
    setLanguageReviewData: (state, action: PayloadAction<Sentiment[]>) => {
      state.data = action.payload
    },
    setLanguageReviewPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

export const { setLanguageReviewData, setLanguageReviewPending } =
  languageReviewSlice.actions

export default languageReviewSlice.reducer
