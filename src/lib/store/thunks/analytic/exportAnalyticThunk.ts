import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"

export const fetchAnalyticExport =
  (theme_id: string, type: string, format: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate
      const chartPeriod = state.chartPeriod.period

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/${type !== "excel" ? "analytics/" : ""}download_${type}_report`
      )
      if (chartPeriod) {
        url.searchParams.append("period", chartPeriod)
      }
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
        .then((res) => res.blob())
        .then((blob) => {
          try {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `report.${format}`
            document.body.appendChild(a)
            a.click()
            a.remove()
          } catch (e) {
            console.log(e)
          }
        })
    } catch (err) {
      console.error("FETCH EXPORT ERROR", err)
    }
  }
