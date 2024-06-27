import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Sentiment {
  name: string
  y: number
  color: string
}

export interface CommunityData {
  pending: boolean
  data: Sentiment[]
}

const initialState: CommunityData = {
  pending: true,
  data: [],
}

export const toneCommunitySlice = createSlice({
  name: "toneCommunity",
  initialState,
  reducers: {
    setToneCommunityData: (state, action: PayloadAction<Sentiment[]>) => {
      state.data = action.payload
    },
    setToneCommunityPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

export const { setToneCommunityData, setToneCommunityPending } =
  toneCommunitySlice.actions

export default toneCommunitySlice.reducer
