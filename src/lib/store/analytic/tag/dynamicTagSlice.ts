import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type IDataPoint = [number, number]

export interface Tag {
  name: string
  type: "line"
  data: IDataPoint[]
}

export interface DynamicData {
  pending: boolean
  period: string
  data: Tag[]
}

const initialState: DynamicData = {
  data: [],
  pending: true,
  period: "month",
}

export const dynamicTagSlice = createSlice({
  name: "dynamicTag",
  initialState,
  reducers: {
    // Обновление состояния загрузки
    setDynamicTagPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
    // Обновление периода данных
    setDynamicTagPeriod: (state, action: PayloadAction<string>) => {
      state.period = action.payload
    },
    // Обновление данных авторов
    setDynamicTagData: (state, action: PayloadAction<Tag[]>) => {
      state.data = action.payload
    },
  },
})

export const { setDynamicTagPending, setDynamicTagPeriod, setDynamicTagData } =
  dynamicTagSlice.actions

// Экспорт редьюсера для включения его в основной редьюсер приложения
export default dynamicTagSlice.reducer
