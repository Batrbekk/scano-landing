import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { persistReducer } from "redux-persist"
import createWebStorage from "redux-persist/lib/storage/createWebStorage"

import { dynamicAuthorSlice } from "@/lib/store/analytic/author/dynamicAuthorSlice"
import { tableAuthorSlice } from "@/lib/store/analytic/author/tableAuthorSlice"
import { chartPeriodSlice } from "@/lib/store/analytic/chartPeriodSlice"
import { toneCommunitySlice } from "@/lib/store/analytic/community/toneCommunitySlice"
import { languageReviewSlice } from "@/lib/store/analytic/review/languageReviewSlice"
import { toneReviewSlice } from "@/lib/store/analytic/review/toneReviewSlice"
import { dynamicSourceSlice } from "@/lib/store/analytic/source/dynamicSourceSlice"
import { messageSourceSlice } from "@/lib/store/analytic/source/messageSourceSlice"
import { messageTypeSourceSlice } from "@/lib/store/analytic/source/messageTypeSourceSlice"
import { tableSourceSlice } from "@/lib/store/analytic/source/tableSourceSlice"
import { toneSourceSlice } from "@/lib/store/analytic/source/toneSourceSlice"
import { dynamicTagSlice } from "@/lib/store/analytic/tag/dynamicTagSlice"
import { messageTagSlice } from "@/lib/store/analytic/tag/messageTagSlice"
import { tagTableSlice } from "@/lib/store/analytic/tag/tableTagSlice"
import { toneTagSlice } from "@/lib/store/analytic/tag/toneTagSlice"
import { cloudWordSlice } from "@/lib/store/analytic/word/cloudWordSlice"
import { archiveTimeSlice } from "@/lib/store/archiveTimeSlice"
import { authReducer } from "@/lib/store/authSlice"
import { currentThemeReducer } from "@/lib/store/currentThemeSlice"
import { filterCountSlice } from "@/lib/store/filterCountSlice"
import { mainChartSlice } from "@/lib/store/mainChartSlice"
import { materialFilterSlice } from "@/lib/store/materialFilterSlice"
import { materialSlice } from "@/lib/store/materialSlice"
import { materialTrashSlice } from "@/lib/store/materialTrashSlice"
import { sortMaterialSlice } from "@/lib/store/sortMaterialSlice"
import { tagSlice } from "@/lib/store/tagSlice"
import { timeFilterSlice } from "@/lib/store/timeFilterSlice"
import { userSlice } from "@/lib/store/userSlice"

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value)
    },
    removeItem() {
      return Promise.resolve()
    },
  }
}

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage()

const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["authState", "token"],
}

const currentThemeConfig = {
  key: "currentTheme",
  storage: storage,
  whitelist: ["id"],
}

const persistedReducer = persistReducer(authPersistConfig, authReducer)
const persistedCurrentThemeReducer = persistReducer(
  currentThemeConfig,
  currentThemeReducer
)

const rootReducer = combineReducers({
  auth: persistedReducer,
  currentTheme: persistedCurrentThemeReducer,
  materialFilter: materialFilterSlice.reducer,
  materials: materialSlice.reducer,
  timeFilter: timeFilterSlice.reducer,
  archiveTime: archiveTimeSlice.reducer,
  mainChart: mainChartSlice.reducer,
  filterCount: filterCountSlice.reducer,
  messageSource: messageSourceSlice.reducer,
  dynamicSource: dynamicSourceSlice.reducer,
  messageTypeSource: messageTypeSourceSlice.reducer,
  toneSource: toneSourceSlice.reducer,
  dynamicAuthor: dynamicAuthorSlice.reducer,
  userData: userSlice.reducer,
  chartPeriod: chartPeriodSlice.reducer,
  tableSource: tableSourceSlice.reducer,
  tableAuthor: tableAuthorSlice.reducer,
  messageTag: messageTagSlice.reducer,
  toneTag: toneTagSlice.reducer,
  tagList: tagSlice.reducer,
  tableTag: tagTableSlice.reducer,
  sortMaterial: sortMaterialSlice.reducer,
  trashMaterials: materialTrashSlice.reducer,
  reviewTone: toneReviewSlice.reducer,
  reviewLanguage: languageReviewSlice.reducer,
  dynamicTag: dynamicTagSlice.reducer,
  communityTone: toneCommunitySlice.reducer,
  wordCloud: cloudWordSlice.reducer,
}) as any

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
