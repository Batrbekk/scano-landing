import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type IDataPoint = [number, number]

export interface Source {
  name: string
  type: "line"
  data: IDataPoint[]
}

export interface DynamicData {
  data: Source[]
  pending: boolean
  period: string
}

const initialState: DynamicData = {
  data: [],
  pending: true,
  period: "month",
}

export const dynamicSourceSlice = createSlice({
  name: "dynamicSource",
  initialState,
  reducers: {
    // Редьюсер для установки данных
    setDynamicSourceData: (state, action: PayloadAction<Source[]>) => {
      state.data = action.payload
    },
    // Редьюсер для установки состояния загрузки
    setDynamicSourcePending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
    setDynamicSourcePeriod: (state, action: PayloadAction<string>) => {
      state.period = action.payload
    },
  },
})

export const {
  setDynamicSourceData,
  setDynamicSourcePeriod,
  setDynamicSourcePending,
} = dynamicSourceSlice.actions

export default dynamicSourceSlice.reducer
