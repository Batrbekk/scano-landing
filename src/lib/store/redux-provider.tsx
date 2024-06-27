"use client"

import React from "react"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist"

import { store } from "@/lib/store/store"

persistStore(store)
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider store={store}>{children}</Provider>
}
