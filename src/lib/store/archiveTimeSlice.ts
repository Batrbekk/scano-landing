import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IArchiveTimeState {
  startDate: string | null
  endDate: string | null
}

const initialState: IArchiveTimeState = {
  startDate: null,
  endDate: null,
}

export const archiveTimeSlice = createSlice({
  name: "archiveTime",
  initialState,
  reducers: {
    setStartDateArchiveStore: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload
    },
    setEndDateArchiveStore: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload
    },
  },
})

export const { setStartDateArchiveStore, setEndDateArchiveStore } =
  archiveTimeSlice.actions
export default archiveTimeSlice.reducer
