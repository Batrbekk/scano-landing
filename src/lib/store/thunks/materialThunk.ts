import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setMaterials,
  setMaterialsTotal,
  setPageCount,
  setPending,
} from "@/lib/store/materialSlice"
import { RootState } from "@/lib/store/store"

export const fetchMaterials =
  (size: string, page: number, theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setMaterials({ materials: [] }))
    dispatch(setPending({ pending: true }))
    dispatch(setMaterialsTotal({ materialsTotal: 0 }))

    try {
      const state = getState() // Получаем текущее состояние
      const token = state.auth.token // Извлекаем токен
      const materialFilter = state.materialFilter // Извлекаем фильтры
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate
      const sort_by = state.sortMaterial.sort_by

      // Создаем объект URL для динамического формирования запроса
      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${theme_id}/filtered_materials`
      )
      if (startDate) {
        url.searchParams.append("start_date", startDate)
      }
      if (endDate) {
        url.searchParams.append("end_date", endDate)
      }
      if (sort_by) {
        url.searchParams.append("sort_by", sort_by)
      }
      url.searchParams.append("page", page.toString())
      url.searchParams.append("size", size)

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
        const data = await res.json()
        dispatch(setMaterials({ materials: data.items }))
        dispatch(setPageCount({ pageCount: data.pages }))
        dispatch(setMaterialsTotal({ materialsTotal: data.total }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      dispatch(setPending({ pending: false }))
    }
  }
