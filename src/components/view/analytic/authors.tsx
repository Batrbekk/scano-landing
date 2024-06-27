import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { useAppDispatch } from "@/lib/store/store"
import { fetchDynamicAuthor } from "@/lib/store/thunks/analytic/author/dynamicAuthorThunk"
import { fetchTableAuthor } from "@/lib/store/thunks/analytic/author/tableAuthorThunk"
import { AuthorAge } from "@/components/authors/author-age"
import { AuthorDynamic } from "@/components/authors/author-dynamic"
import { AuthorGender } from "@/components/authors/author-gender"
import { AuthorType } from "@/components/authors/author-type"
import { AuthorsTable } from "@/components/authors/authors-table"

const Authors = () => {
  const params = useParams()
  const dispatch = useAppDispatch()
  const [themeId, setThemeId] = useState<string>("")

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    if (themeId) {
      dispatch(fetchDynamicAuthor(themeId))
      dispatch(fetchTableAuthor(themeId, 1))
    }
  }, [dispatch, themeId])

  return (
    <div className="mb-20 flex flex-col gap-8">
      <AuthorType />
      <AuthorDynamic />
      <AuthorGender />
      <AuthorAge />
      <AuthorsTable />
    </div>
  )
}

export { Authors }
