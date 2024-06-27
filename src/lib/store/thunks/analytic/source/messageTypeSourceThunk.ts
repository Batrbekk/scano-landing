import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setMessageTypeSourceData,
  setMessageTypeSourcePending,
} from "@/lib/store/analytic/source/messageTypeSourceSlice"
import { RootState } from "@/lib/store/store"

export const fetchMessageTypeSource =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setMessageTypeSourceData([]))
    dispatch(setMessageTypeSourcePending(true))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/sources/source_type_analytics`
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
        const formattedData = rawData.map(
          (item: { source_type: string; percentage: number }) => ({
            name: item.source_type,
            y: item.percentage,
          })
        )
        dispatch(setMessageTypeSourceData(formattedData))
      }
    } catch (err) {
      console.error("Error fetching source analytics:", err)
    } finally {
      dispatch(setMessageTypeSourcePending(false))
    }
  }
