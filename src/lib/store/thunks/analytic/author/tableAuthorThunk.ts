import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setTableAuthorData,
  setTableAuthorPages,
  setTableAuthorPending,
} from "@/lib/store/analytic/author/tableAuthorSlice"
import { RootState } from "@/lib/store/store"

export const fetchTableAuthor =
  (themeId: string, currentPage: number) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setTableAuthorPages(0))
    dispatch(setTableAuthorPending(true))
    dispatch(setTableAuthorData([]))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${themeId}/analytics/authors/author_analytics_table?page=${currentPage}&size=50`
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
        dispatch(setTableAuthorData(rawData.items))
        dispatch(setTableAuthorPages(rawData.pages))
      }
    } catch (err) {
      console.error("FETCH TABLE SOURCE ERROR", err)
    } finally {
      dispatch(setTableAuthorPending(false))
    }
  }
