import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setFilterCount,
  setFilterCountPending,
} from "@/lib/store/filterCountSlice"
// Импортируйте экшены, которые вам нужны
import { RootState } from "@/lib/store/store"

export const fetchFilterCountThunk =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(
      setFilterCount({
        filter_count_pending: true,
        source_type: {
          social_network: 0,
          video: 0,
          messenger_chanel: 0,
          messenger_group: 0,
          news: 0,
        },
        sentiment: {
          negative: 0,
          neutral: 0,
          positive: 0,
        },
        language: {
          en: 0,
          ru: 0,
          kk: 0,
          unknown: 0,
        },
        material_type: {
          post: 0,
          comment: 0,
          repost: 0,
          stories: 0,
          news: 0,
          unknown: 0,
        },
        material_count: 0,
        tags: {},
      })
    )
    dispatch(setFilterCountPending(true)) // Установите начальное состояние загрузки

    try {
      const state = getState() // Получаем текущее состояние
      const token = state.auth.token // Извлекаем токен
      const materialFilter = state.materialFilter // Извлекаем фильтры
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      // Создаем URL для запроса, используя переменную окружения
      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/list_materials_info/`
      )
      if (startDate) {
        url.searchParams.append("start_date", startDate)
      }
      if (endDate) {
        url.searchParams.append("end_date", endDate)
      }

      // Дополнительные параметры для URL не указаны, так как в вашем CURL они не используются
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
        const data = await res.json()
        dispatch(setFilterCount(data)) // Предполагается, что API возвращает данные в формате, подходящем для вашего состояния
      } else {
        throw new Error("Failed to fetch data")
      }
    } catch (err) {
      console.error("Fetch Filter Count Error:", err)
    } finally {
      dispatch(setFilterCountPending(false)) // Сброс состояния загрузки
    }
  }
