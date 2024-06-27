import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface TableAuthor {
  name: string
  count: string
  percentage: string
  subscribers: string
  sentiment: {
    positive: string
    neutral: string
    negative: string
  }
}

export interface TableAuthorState {
  pages: number
  pending: boolean
  data: TableAuthor[]
}

const initialState: TableAuthorState = {
  pages: 0,
  pending: true,
  data: [],
}

export const tableAuthorSlice = createSlice({
  name: "tableAuthor",
  initialState,
  reducers: {
    setTableAuthorData: (state, action: PayloadAction<TableAuthor[]>) => {
      state.data = action.payload
    },
    setTableAuthorPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
    setTableAuthorPages: (state, action: PayloadAction<number>) => {
      state.pages = action.payload
    },
  },
})

export const {
  setTableAuthorData,
  setTableAuthorPending,
  setTableAuthorPages,
} = tableAuthorSlice.actions

export default tableAuthorSlice.reducer
