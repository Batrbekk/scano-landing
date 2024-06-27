import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setToneCommunityData,
  setToneCommunityPending,
} from "@/lib/store/analytic/community/toneCommunitySlice"
import { RootState } from "@/lib/store/store"

export const fetchToneCommunity =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setToneCommunityData([]))
    dispatch(setToneCommunityPending(true))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/sources/community_sentiments_analytics`
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
        const dataWithColorsAndModifiedKeys = rawData.map((data: any) => ({
          name: data.sentiment,
          y: data.percentage, // Замена 'percentage' на 'y'
          color: getColorForSentiment(data.sentiment), // Добавление цвета
        }))
        dispatch(setToneCommunityData(dataWithColorsAndModifiedKeys))
      }
    } catch (e) {
      console.error(e)
    } finally {
      dispatch(setToneCommunityPending(false))
    }
  }

function getColorForSentiment(sentiment: string) {
  switch (sentiment) {
    case "positive":
      return "#0FAF62"
    case "negative":
      return "#EB5757"
    case "neutral":
      return "#005CE8"
    default:
      return "#000000" // Default color if no sentiment matches
  }
}
