import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { format } from "date-fns"

interface ITimeFilterState {
  startDate: string | null
  endDate: string | null
  rangeData: number
}

const initialState: ITimeFilterState = {
  startDate: `${format(new Date(), "yyyy-MM-dd") + "T" + "00:00"}`,
  endDate: `${format(new Date(), "yyyy-MM-dd") + "T" + "23:59"}`,
  rangeData: 0,
}

export const timeFilterSlice = createSlice({
  name: "timeFilter",
  initialState,
  reducers: {
    setStartDateStore: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload
    },
    setEndDateStore: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload
    },
    setRangeData: (state, action: PayloadAction<number>) => {
      state.rangeData = action.payload
    },
  },
})

export const { setStartDateStore, setEndDateStore, setRangeData } =
  timeFilterSlice.actions
export default timeFilterSlice.reducer
