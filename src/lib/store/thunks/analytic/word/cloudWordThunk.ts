import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setCloudWordData,
  setCloudWordPending,
} from "@/lib/store/analytic/word/cloudWordSlice"
import { RootState } from "@/lib/store/store"

export const fetchCloudWord =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setCloudWordData([]))
    dispatch(setCloudWordPending(true))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/download_word_report?period=day`
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
        console.log(rawData)
        // const dataWithColorsAndModifiedKeys = rawData.map((data: any) => ({
        //   name: data.sentiment,
        //   y: data.percentage, // Замена 'percentage' на 'y'
        //   color: getColorForSentiment(data.sentiment), // Добавление цвета
        // }))
        // dispatch(setCloudWordData(dataWithColorsAndModifiedKeys))
      }
    } catch (e) {
      console.error(e)
    } finally {
      dispatch(setCloudWordPending(false))
    }
  }
