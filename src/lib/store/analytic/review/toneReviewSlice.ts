import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Sentiment {
  name: string
  y: number
  color: string
}

export interface ReviewData {
  pending: boolean
  data: Sentiment[]
}

const initialState: ReviewData = {
  pending: true,
  data: [],
}

export const toneReviewSlice = createSlice({
  name: "toneReview",
  initialState,
  reducers: {
    setToneReviewData: (state, action: PayloadAction<Sentiment[]>) => {
      state.data = action.payload
    },
    setToneReviewPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

export const { setToneReviewData, setToneReviewPending } =
  toneReviewSlice.actions

export default toneReviewSlice.reducer
