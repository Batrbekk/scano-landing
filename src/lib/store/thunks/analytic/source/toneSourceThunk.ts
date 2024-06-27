import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setToneSourceData,
  setToneSourceList,
  setToneSourcePending,
  SourceData,
} from "@/lib/store/analytic/source/toneSourceSlice"
import { RootState } from "@/lib/store/store"

export const fetchToneSource =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setToneSourceList([]))
    dispatch(setToneSourceData([]))
    dispatch(setToneSourcePending(true))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/sources/source_sentiments_analytics`
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
        dispatch(setToneSourceList(rawData.sources))
        const formattedData: SourceData[] = rawData.data.map((item: any) => ({
          source: item.source,
          sentiment: [
            {
              name: "Позитивный",
              y: item.sentiment.Позитивный,
              color: "#0FAF62",
            },
            {
              name: "Негативный",
              y: item.sentiment.Негативный,
              color: "#EB5757",
            },
            {
              name: "Нейтральный",
              y: item.sentiment.Нейтральный,
              color: "#005CE8",
            },
          ],
        }))
        dispatch(setToneSourceData(formattedData))
      }
    } catch (err) {
      console.error("Error fetching source analytics:", err)
    } finally {
      dispatch(setToneSourcePending(false))
    }
  }
