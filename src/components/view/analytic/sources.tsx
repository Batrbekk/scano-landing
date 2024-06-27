import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { useAppDispatch } from "@/lib/store/store"
import { fetchDynamicSource } from "@/lib/store/thunks/analytic/source/dynamicSourceThunk"
import { fetchMessageSource } from "@/lib/store/thunks/analytic/source/messageSourceThunk"
import { fetchMessageTypeSource } from "@/lib/store/thunks/analytic/source/messageTypeSourceThunk"
import { fetchTableSource } from "@/lib/store/thunks/analytic/source/tableSourceThunk"
import { fetchToneSource } from "@/lib/store/thunks/analytic/source/toneSourceThunk"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
import { DynamicSource } from "@/components/sources/dynamic-source"
import { MessageSource } from "@/components/sources/message-source"
import { SourceTable } from "@/components/sources/source-table"
import { ToneSource } from "@/components/sources/tone-source"
import { TypeSource } from "@/components/sources/type-source"

const Sources = () => {
  const params = useParams()
  const dispatch = useAppDispatch()
  const [themeId, setThemeId] = useState<string>("")

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    if (themeId) {
      dispatch(fetchMessageSource(themeId))
      dispatch(fetchDynamicSource(themeId))
      dispatch(fetchMessageTypeSource(themeId))
      dispatch(fetchToneSource(themeId))
      dispatch(fetchFilterCountThunk(themeId))
      dispatch(fetchTableSource(themeId, 1))
    }
  }, [dispatch, themeId])

  return (
    <div className="mb-20 flex flex-col gap-8">
      <MessageSource />
      <DynamicSource />
      <TypeSource />
      <ToneSource />
      <SourceTable />
    </div>
  )
}

export { Sources }
