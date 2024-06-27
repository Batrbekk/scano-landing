import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { useAppDispatch } from "@/lib/store/store"
import { fetchDynamicTag } from "@/lib/store/thunks/analytic/tag/dynamicTagThunk"
import { fetchMessageTag } from "@/lib/store/thunks/analytic/tag/messageTagThunk"
import { fetchTagTable } from "@/lib/store/thunks/analytic/tag/tableTagThunk"
import { fetchToneTag } from "@/lib/store/thunks/analytic/tag/toneTagThunk"
import { TagDynamic } from "@/components/tags/tag-dynamic"
import { TagMessage } from "@/components/tags/tag-message"
import { TagMessageTable } from "@/components/tags/tag-message-table"
import { TagTone } from "@/components/tags/tag-tone"

const Tags = () => {
  const params = useParams()
  const dispatch = useAppDispatch()
  const [themeId, setThemeId] = useState<string>("")

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    if (themeId) {
      dispatch(fetchMessageTag(themeId))
      dispatch(fetchToneTag(themeId))
      dispatch(fetchTagTable(themeId))
      dispatch(fetchDynamicTag(themeId))
    }
  }, [dispatch, themeId])

  return (
    <div className="mb-20 flex w-full flex-col gap-8">
      <TagMessage />
      <TagTone />
      <TagDynamic />
      <TagMessageTable />
      {/*  <TagTable />*/}
    </div>
  )
}

export { Tags }
