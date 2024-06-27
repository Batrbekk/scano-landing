import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SourceData {
  name: string
  y: number
}

export interface ISourceData {
  pending: boolean
  data: SourceData[]
}

const initialState: ISourceData = {
  pending: true,
  data: [],
}

export const messageTagSlice = createSlice({
  name: "messageSource",
  initialState,
  reducers: {
    // Редьюсер для установки данных
    setMessageTagData: (state, action: PayloadAction<SourceData[]>) => {
      state.data = action.payload
    },
    // Редьюсер для установки состояния загрузки
    setMessageTagPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

// Экспорт экшенов
export const { setMessageTagData, setMessageTagPending } =
  messageTagSlice.actions

// Экспорт редьюсера
export default messageTagSlice.reducer
