import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ICurrentTheme {
  id: string
}

const initialState: ICurrentTheme = {
  id: "",
}

export const currentThemeSlice = createSlice({
  name: "currentTheme",
  initialState,
  reducers: {
    setCurrentThemeID: (state, action: PayloadAction<ICurrentTheme>) => {
      state.id = action.payload.id
    },
  },
})

export const { setCurrentThemeID } = currentThemeSlice.actions
export const currentThemeReducer = currentThemeSlice.reducer
