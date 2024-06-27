import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export enum Permission {
  DeleteModerator = "delete_moderator",
  DeleteUsers = "delete_users",
  NewUser = "new_user",
  EditUser = "edit_user",
  CreateThemes = "create_themes",
  DeleteThemes = "delete_themes",
  EditThemes = "edit_themes",
  ViewThemes = "view_themes",
  CreateMaterials = "create_materials",
  DeleteMaterials = "delete_materials",
  EditMaterials = "edit_materials",
  ViewMaterials = "view_materials",
  DeleteTags = "delete_tags",
  CreateTags = "create_tags",
  EditTags = "edit_tags",
  CreateSubscriptions = "create_subscriptions",
  DeleteSubscriptions = "delete_subscriptions",
  EditSubscriptions = "edit_subscriptions",
  ExportMaterials = "export_materials",
  DeleteTelegramChannels = "delete_telegram_channels",
}

interface User {
  created_at: string
  updated_at: string
  _id: string
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
  is_active: boolean
  organization_id: string
  company_name: string
  photo_url: string
  timezone: string
  interface_language: string | null
  is_superuser: boolean
  themes: string[]
  permissions: Permission[]
}

interface UserState {
  user: User | null
  pending: boolean
}

const initialState: UserState = {
  user: null,
  pending: true,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setUserPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload
    },
  },
})

export const { setUser, setUserPending } = userSlice.actions
export default userSlice.reducer
