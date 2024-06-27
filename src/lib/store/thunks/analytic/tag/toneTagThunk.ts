import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setToneTagData,
  setToneTagList,
  setToneTagPending,
  Tag,
  TagData,
} from "@/lib/store/analytic/tag/toneTagSlice"
import { RootState } from "@/lib/store/store"

export const fetchToneTag =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setToneTagData([]))
    dispatch(setToneTagPending(true))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/tags_materials_sentiment_chart`
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
        const formattedData: TagData[] = rawData.map((item: any) => ({
          name: item.name,
          sentiment: [
            {
              name: "Позитивный",
              y: item.sentiment.positive,
              color: "#0FAF62",
            },
            {
              name: "Негативный",
              y: item.sentiment.negative,
              color: "#EB5757",
            },
            {
              name: "Нейтральный",
              y: item.sentiment.neutral,
              color: "#005CE8",
            },
          ],
        }))
        const formattedList: Tag[] = rawData.map((item: any) => ({
          name: item.name,
          id: item.id,
        }))
        dispatch(setToneTagData(formattedData))
        dispatch(setToneTagList(formattedList))
      }
    } catch (err) {
      console.error("Error fetching source analytics:", err)
    } finally {
      dispatch(setToneTagPending(false))
    }
  }
