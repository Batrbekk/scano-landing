import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  ISeries,
  setMainChartData,
  setMainChartPending,
} from "@/lib/store/mainChartSlice"
import { RootState } from "@/lib/store/store"

export const fetchMainChart =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setMainChartData({ data: [] }))
    dispatch(setMainChartPending({ pending: true }))

    try {
      const state = getState() // Получаем текущее состояние
      const token = state.auth.token // Извлекаем токен
      const materialFilter = state.materialFilter // Извлекаем фильтры
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate
      const chartPeriod = state.chartPeriod.period

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/general_analytics`
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

        // Предполагается, что данные уже в формате, ожидаемом массивом ISeries
        const dataWithColors: ISeries[] = rawData.map((series: ISeries) => {
          let color = "#000000" // Дефолтный цвет, если не совпадает ни с одним условием
          if (series.name === "positive") {
            color = "#0FAF62" // Зеленый для положительных данных
          } else if (series.name === "negative") {
            color = "#EB5757" // Красный для отрицательных данных
          } else if (series.name === "neutral") {
            color = "#005CE8" // Синий для нейтральных данных
          } else if (series.name === "total") {
            color = "#e8b200"
          }

          return { ...series, color }
        })

        dispatch(setMainChartData({ data: dataWithColors }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      dispatch(setMainChartPending({ pending: false }))
    }
  }
