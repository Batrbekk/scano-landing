import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Period {
  period: "month" | "week" | "day" | "hour" | "half_an_hour" | "quarter_an_hour"
}

const initialState: Period = {
  period: "hour",
}

export const chartPeriodSlice = createSlice({
  name: "chartPeriodSlice",
  initialState,
  reducers: {
    setChartPeriod: (
      state,
      action: PayloadAction<
        "month" | "week" | "day" | "hour" | "half_an_hour" | "quarter_an_hour"
      >
    ) => {
      state.period = action.payload
    },
  },
})

export const { setChartPeriod } = chartPeriodSlice.actions

export default chartPeriodSlice.reducer
