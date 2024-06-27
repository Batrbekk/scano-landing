import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type IDataPoint = [number, number]

export interface ISeries {
  name: string // Name of the series
  type: "line" // Type of chart (assumed to be always 'line' in this context)
  data: IDataPoint[]
  color: string
}

type SeriesData = {
  data: ISeries[]
  pending: boolean
  period: string
}

const initialState: SeriesData = {
  data: [],
  pending: true,
  period: "month",
}

export const mainChartSlice = createSlice({
  name: "mainChartSlice",
  initialState,
  reducers: {
    setMainChartPending: (
      state,
      action: PayloadAction<{ pending: boolean }>
    ) => {
      const { pending } = action.payload
      state.pending = pending
    },
    setMainChartData: (state, action: PayloadAction<{ data: ISeries[] }>) => {
      state.data = action.payload.data
    },
    setMainChartPeriod: (state, action: PayloadAction<{ period: string }>) => {
      const { period } = action.payload
      state.period = period
    },
  },
})

export const { setMainChartPending, setMainChartPeriod, setMainChartData } =
  mainChartSlice.actions

export const mainChartReducer = mainChartSlice.reducer
