import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { setUser, setUserPending } from "@/lib/store/userSlice"

export const fetchUser =
  () =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setUserPending(true))
    dispatch(setUser(null))

    try {
      const state = getState()
      const token = state.auth.token

      const url = new URL(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/me`)

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const rawData = await res.json()
        dispatch(setUser(rawData))
      }
    } catch (e) {
      console.error("Error fetch userData:", e)
    } finally {
      dispatch(setUserPending(false))
    }
  }
