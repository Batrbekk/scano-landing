import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Source {
  name: string
  id: string
}

export interface Sentiment {
  name: string
  y: number
  color: string
}

export interface SourceData {
  sentiment: Sentiment[]
  source: string
}

export interface ISourceData {
  pending: boolean
  data: SourceData[]
  sources: Source[]
}

const initialState: ISourceData = {
  pending: true,
  data: [],
  sources: [],
}

export const toneSourceSlice = createSlice({
  name: "messageSource",
  initialState,
  reducers: {
    // Редьюсер для установки данных
    setToneSourceData: (state, action: PayloadAction<SourceData[]>) => {
      state.data = action.payload
    },
    // Редьюсер для установки состояния загрузки
    setToneSourcePending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
    setToneSourceList: (state, action: PayloadAction<Source[]>) => {
      state.sources = action.payload
    },
  },
})

// Экспорт экшенов
export const { setToneSourceData, setToneSourceList, setToneSourcePending } =
  toneSourceSlice.actions

// Экспорт редьюсера
export default toneSourceSlice.reducer
