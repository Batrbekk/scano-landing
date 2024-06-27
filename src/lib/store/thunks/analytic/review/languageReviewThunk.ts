import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setLanguageReviewData,
  setLanguageReviewPending,
} from "@/lib/store/analytic/review/languageReviewSlice"
import { RootState } from "@/lib/store/store"

export const fetchLanguageReview =
  (theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setLanguageReviewData([]))
    dispatch(setLanguageReviewPending(true))

    try {
      const state = getState()
      const token = state.auth.token
      const materialFilter = state.materialFilter
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate

      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/analytics/language_analytics_donut`
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
          name: data.language,
          y: data.percentage, // Замена 'percentage' на 'y'
          color: getColorForLanguage(data.language), // Добавление цвета
        }))
        dispatch(setLanguageReviewData(dataWithColorsAndModifiedKeys))
      }
    } catch (e) {
      console.error(e)
    } finally {
      dispatch(setLanguageReviewPending(false))
    }
  }

function getColorForLanguage(language: string) {
  switch (language) {
    case "ru":
      return "#1C88BF" // Синий для русского языка, символизирующий глубину и стабильность
    case "en":
      return "#F4A460" // Светло-коричневый для английского языка, ассоциирующийся с традициями и элегантностью
    case "kk":
      return "#FFD700" // Золотой для казахского языка, символизирующий богатство и культурное наследие
    default:
      return "#808080" // Серый по умолчанию, если язык не соответствует ни одному из вышеуказанных
  }
}
