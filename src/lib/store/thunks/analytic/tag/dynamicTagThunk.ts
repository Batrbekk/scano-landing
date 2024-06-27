import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setDynamicTagData,
  setDynamicTagPending,
} from "@/lib/store/analytic/tag/dynamicTagSlice"
import { RootState } from "@/lib/store/store"

export const fetchDynamicTag =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setDynamicTagData([]))
    dispatch(setDynamicTagPending(true))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate
      const chartPeriod = state.chartPeriod.period

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/dynamics_of_tags_chart`
      )
      if (startDate) {
        url.searchParams.append("start_date", startDate)
      }
      if (endDate) {
        url.searchParams.append("end_date", endDate)
      }
      if (chartPeriod) {
        url.searchParams.append("period", chartPeriod)
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
        dispatch(
          setDynamicTagData([
            {
              name: "authorCount",
              type: "line",
              data: rawData.data,
            },
          ])
        )
      }
    } catch (err) {
      console.error("Error fetching source analytics:", err)
    } finally {
      dispatch(setDynamicTagPending(false))
    }
  }
