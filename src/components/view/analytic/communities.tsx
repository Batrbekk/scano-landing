import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSelector } from "react-redux"

import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchToneCommunity } from "@/lib/store/thunks/analytic/community/toneCommunityThunk"
import CommunityTone from "@/components/community/community-tone"

const Communities = () => {
  const params = useParams()
  const dispatch = useAppDispatch()
  const [themeId, setThemeId] = useState<string>("")

  const startDate = useSelector(
    (state: RootState) => state.timeFilter.startDate
  )
  const endDate = useSelector((state: RootState) => state.timeFilter.endDate)

  const fetchPage = () => {
    if (themeId) {
      dispatch(fetchToneCommunity(themeId))
    }
  }

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    fetchPage()
  }, [dispatch, startDate, endDate, themeId])
  return (
    <div className="mb-20 flex flex-col gap-8">
      <CommunityTone />
    </div>
  )
}

export { Communities }
