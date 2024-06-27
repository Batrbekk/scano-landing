import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IAuthState {
  authState: boolean
  token: string
}

const initialState: IAuthState = {
  authState: false,
  token: "",
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{ authState: boolean; token: string }>
    ) => {
      state.authState = action.payload.authState
      state.token = action.payload.token
    },
  },
})

export const { setAuthState } = authSlice.actions
export const authReducer = authSlice.reducer
