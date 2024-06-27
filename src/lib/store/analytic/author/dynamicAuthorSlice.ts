import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type IDataPoint = [number, number]

export interface Author {
  name: string
  type: "line"
  data: IDataPoint[]
}

export interface DynamicData {
  pending: boolean
  period: string
  data: Author[]
}

const initialState: DynamicData = {
  data: [],
  pending: true,
  period: "month",
}

export const dynamicAuthorSlice = createSlice({
  name: "dynamicAuthor",
  initialState,
  reducers: {
    // Обновление состояния загрузки
    setDynamicAuthorPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
    // Обновление периода данных
    setDynamicAuthorPeriod: (state, action: PayloadAction<string>) => {
      state.period = action.payload
    },
    // Обновление данных авторов
    setDynamicAuthorData: (state, action: PayloadAction<Author[]>) => {
      state.data = action.payload
    },
  },
})

export const {
  setDynamicAuthorPending,
  setDynamicAuthorPeriod,
  setDynamicAuthorData,
} = dynamicAuthorSlice.actions

// Экспорт редьюсера для включения его в основной редьюсер приложения
export default dynamicAuthorSlice.reducer
