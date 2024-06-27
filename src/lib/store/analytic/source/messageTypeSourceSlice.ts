import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SourceData {
  name: string // Название платформы
  y: number // Численное значение, ассоциированное с платформой
}

export interface ISourceData {
  pending: boolean
  data: SourceData[]
}

const initialState: ISourceData = {
  pending: true,
  data: [],
}

export const messageTypeSourceSlice = createSlice({
  name: "messageSource",
  initialState,
  reducers: {
    // Редьюсер для установки данных
    setMessageTypeSourceData: (state, action: PayloadAction<SourceData[]>) => {
      state.data = action.payload
    },
    // Редьюсер для установки состояния загрузки
    setMessageTypeSourcePending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

// Экспорт экшенов
export const { setMessageTypeSourceData, setMessageTypeSourcePending } =
  messageTypeSourceSlice.actions

// Экспорт редьюсера
export default messageTypeSourceSlice.reducer
