import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setTableTagData,
  setTableTagPending,
} from "@/lib/store/analytic/tag/tableTagSlice"
import { RootState } from "@/lib/store/store"

export const fetchTagTable =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setTableTagPending(true))
    dispatch(setTableTagData([]))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/tags_materials_table`
      )
      if (startDate) {
        url.searchParams.append("start_date", startDate)
      }
      if (endDate) {
        url.searchParams.append("end_date", endDate)
      }

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          material_filter: materialFilter.material_filter,
          author_filter: materialFilter.author_filter,
        }),
      })

      if (res.ok) {
        const rawData = await res.json()
        dispatch(setTableTagData(rawData))
      }
    } catch (e) {
      console.error(e)
    } finally {
      dispatch(setTableTagPending(false))
    }
  }
