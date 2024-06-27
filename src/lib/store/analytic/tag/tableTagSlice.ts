import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { tagSlice } from "@/lib/store/tagSlice"

export interface tagRow {
  id: string
  name: string
  materials_count: number
}

export interface tagTableState {
  pending: boolean
  data: tagRow[]
}

const initialState: tagTableState = {
  pending: true,
  data: [],
}

export const tagTableSlice = createSlice({
  name: "tagTable",
  initialState,
  reducers: {
    setTableTagData: (state, action: PayloadAction<tagRow[]>) => {
      state.data = action.payload
    },
    setTableTagPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

export const { setTableTagData, setTableTagPending } = tagTableSlice.actions

export default tagTableSlice.reducer
