import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface TableSource {
  name: string
  count: string
  percentage: string
  sentiment: {
    Позитивный: number
    Негативный: number
    Нейтральный: number
  }
}

export interface TableSourceState {
  pages: number
  pending: boolean
  data: TableSource[]
}

const initialState: TableSourceState = {
  pages: 0,
  pending: true,
  data: [],
}

export const tableSourceSlice = createSlice({
  name: "tableSource",
  initialState,
  reducers: {
    setTableSourceData: (state, action: PayloadAction<TableSource[]>) => {
      state.data = action.payload
    },
    setTableSourcePending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
    setTableSourcePages: (state, action: PayloadAction<number>) => {
      state.pages = action.payload
    },
  },
})

export const {
  setTableSourcePages,
  setTableSourceData,
  setTableSourcePending,
} = tableSourceSlice.actions
export default tableSourceSlice.reducer
