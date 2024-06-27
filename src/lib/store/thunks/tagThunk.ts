import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { setTagData, setTagPending } from "@/lib/store/tagSlice"

export const fetchTags =
  (themeId: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setTagPending(true))
    dispatch(setTagData([]))

    try {
      const state = getState()
      const token = state.auth.token
      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/tags/?theme_id=${themeId}`
      )

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
        dispatch(setTagData(rawData))
      }
    } catch (e) {
      console.error(e)
    } finally {
      dispatch(setTagPending(false))
    }
  }
