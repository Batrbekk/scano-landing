import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SortMaterialType {
  sort_by:
    | "real_created_at"
    | "comments_number"
    | "likes_number"
    | "reposts_number"
    | "views_number"
    | null
}

const initialState: SortMaterialType = {
  sort_by: "real_created_at",
}

export const sortMaterialSlice = createSlice({
  name: "sortMaterial",
  initialState,
  reducers: {
    setSortMaterialType: (
      state,
      action: PayloadAction<
        | "real_created_at"
        | "comments_number"
        | "likes_number"
        | "reposts_number"
        | "views_number"
        | null
      >
    ) => {
      state.sort_by = action.payload
    },
  },
})

export const { setSortMaterialType } = sortMaterialSlice.actions
export default sortMaterialSlice.reducer
