import { ThunkDispatch } from "redux-thunk"

import { env } from "@/env.mjs"
import {
  setTrashMaterials,
  setTrashMaterialsTotal,
  setTrashPageCount,
  setTrashPending,
} from "@/lib/store/materialTrashSlice"
import { RootState } from "@/lib/store/store"

export const fetchTrashMaterials =
  (size: string, page: number, theme_id: string) =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(setTrashMaterials({ materials: [] }))
    dispatch(setTrashPending({ pending: true }))
    dispatch(setTrashMaterialsTotal({ materialsTotal: 0 }))

    try {
      const state = getState() // Получаем текущее состояние
      const token = state.auth.token // Извлекаем токен
      const materialFilter = state.materialFilter // Извлекаем фильтры
      const startDate = state.timeFilter.startDate
      const endDate = state.timeFilter.endDate
      const sort_by = state.sortMaterial.sort_by

      // Создаем объект URL для динамического формирования запроса
      const url = new URL(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/trash_bucket/trash/list_trashes?theme_id=${theme_id}`
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
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        dispatch(setTrashMaterials({ materials: data.items }))
        dispatch(setTrashPageCount({ pageCount: data.pages }))
        dispatch(setTrashMaterialsTotal({ materialsTotal: data.total }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      dispatch(setTrashPending({ pending: false }))
    }
  }
