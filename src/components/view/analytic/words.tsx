import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSelector } from "react-redux"

import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchCloudWord } from "@/lib/store/thunks/analytic/word/cloudWordThunk"
import WordCloud from "@/components/word/word-cloud"

const Words = () => {
  const params = useParams()
  const dispatch = useAppDispatch()
  const [themeId, setThemeId] = useState<string>("")

  const startDate = useSelector(
    (state: RootState) => state.timeFilter.startDate
  )
  const endDate = useSelector((state: RootState) => state.timeFilter.endDate)

  const fetchPage = () => {
    if (themeId) {
      dispatch(fetchCloudWord(themeId))
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
      <WordCloud />
    </div>
  )
}

export { Words }
