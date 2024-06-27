import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  IDataPoint,
  setDynamicSourceData,
  setDynamicSourcePending,
} from "@/lib/store/analytic/source/dynamicSourceSlice"
import { RootState } from "@/lib/store/store"

export const fetchDynamicSource =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setDynamicSourceData([]))
    dispatch(setDynamicSourcePending(true))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate
      const chartPeriod = state.chartPeriod.period

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/sources/source_analytics_by_period`
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
        const sources = rawData.map(
          (source: { url: string; type: string; data: IDataPoint[] }) => ({
            name: source.url,
            type: source.type,
            data: source.data,
          })
        )

        dispatch(setDynamicSourceData(sources))
      }
    } catch (err) {
      console.error("Error fetching source analytics:", err)
    } finally {
      dispatch(setDynamicSourcePending(false))
    }
  }
