import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronsLeft, ChevronsRight, ListX, Trash2, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"
import { z } from "zod"

import { env } from "@/env.mjs"
import {
  setSortMaterialType,
  SortMaterialType,
} from "@/lib/store/sortMaterialSlice"
import { RootState, useAppDispatch, useAppSelector } from "@/lib/store/store"
import { fetchTrashMaterials } from "@/lib/store/thunks/materialTrashThunk"
import { Permission } from "@/lib/store/userSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ResumeMaterialCard } from "@/components/resume-material-card"

export interface Props {
  theme_id: string
  processed?: boolean
  unprocessed?: boolean
  favourite?: boolean
}

const listSize = ["20", "50", "100"]

const ResumeMaterialList: React.FC<Props> = ({
  theme_id,
  processed,
  unprocessed,
  favourite,
}) => {
  const t = useTranslations()
  const dispatch = useAppDispatch()
  const token = useSelector((state: RootState) => state.auth.token)
  const { materials, pageCount, pending, materialsTotal } = useAppSelector(
    (state) => state.trashMaterials
  )

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [count, setCount] = useState<string>("20")

  const sortBy = useSelector((state: RootState) => state.sortMaterial.sort_by)
  const [allChosen, setAllChosen] = useState(false)
  const userPermission = useSelector(
    (state: RootState) => state.userData.user?.permissions
  )

  const sortByList: { key: SortMaterialType["sort_by"]; label: string }[] = [
    {
      key: "real_created_at",
      label: t("sortByCreated"),
    },
    {
      key: "comments_number",
      label: t("sortByComments"),
    },
    {
      key: "likes_number",
      label: t("sortByLikes"),
    },
    {
      key: "reposts_number",
      label: t("sortByReposts"),
    },
    {
      key: "views_number",
      label: t("sortByViews"),
    },
  ]

  const FormSchema = z.object({
    materials_id: z.array(z.string()),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      materials_id: [],
    },
  })

  const selectedMaterials = form.watch("materials_id")

  const onChangePage = (value: number) => {
    dispatch(fetchTrashMaterials(count, value, theme_id))
    setCurrentPage(value)
  }

  const onChangeCount = (value: string) => {
    setCount(value)
    dispatch(fetchTrashMaterials(value, currentPage, theme_id))
  }

  const handleUpdate = () => {
    if (token && theme_id) {
      dispatch(fetchTrashMaterials(count, currentPage, theme_id))
    }
  }

  useEffect(() => {
    if (theme_id) {
      dispatch(fetchTrashMaterials(count, currentPage, theme_id))
    }
  }, [theme_id, dispatch])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  function chooseAll() {
    setAllChosen(true)
    const selectedMaterials = materials
      .slice(0, parseInt(count))
      .map((material: any) => material._id)
    form.setValue("materials_id", selectedMaterials)
  }

  async function resumeMaterials() {
    const materials = form.getValues("materials_id")
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/trash_bucket/restore_materials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(materials),
        }
      )
      if (res.ok) {
        dispatch(fetchTrashMaterials(count, currentPage, theme_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return pending ? (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  ) : materials.length > 0 ? (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-2">
          <p className="text-sm">{t("sortBy")}:</p>
          <div className="flex items-center gap-x-2">
            {sortByList.map((item) => (
              <Badge
                variant="outline"
                onClick={() => {
                  dispatch(setSortMaterialType(item.key))
                  dispatch(fetchTrashMaterials(count, 1, theme_id))
                }}
                className={`flex cursor-pointer gap-x-2 text-sm font-normal ${sortBy === item.key ? "border-blue-500 text-blue-500" : ""}`}
              >
                {t(item.label)}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-md">
            {t("materialCount")}:{" "}
            <span className="text-blue-500">{materialsTotal}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <FormField
                name="materials_id"
                control={form.control}
                render={() => (
                  <FormItem className="grid w-full items-center gap-1.5 ">
                    <div className="flex flex-col gap-4">
                      {materials.map((item: any) => (
                        <FormField
                          key={item._id}
                          name="materials_id"
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item._id}
                                className="flex items-start gap-x-2 rounded border bg-white p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    className="mt-[3px]"
                                    checked={field.value?.includes(item._id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item._id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item._id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="!m-0 w-full font-normal">
                                  <ResumeMaterialCard
                                    material_type={item.material_type}
                                    sentiment={item.sentiment}
                                    key={item._id}
                                    id={item._id}
                                    title={item.title}
                                    date={item.real_created_at}
                                    text={item.description}
                                    tags={item.tags}
                                    img={item.img_url}
                                    url={item.url}
                                    src_name={item.source?.name}
                                    updateTags={handleUpdate}
                                    is_favourite={item.is_favourite}
                                    is_processed={item.is_processed}
                                  />
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-y-2 rounded border bg-white p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-4">
                    {allChosen ? (
                      <Button
                        onClick={() => {
                          form.setValue("materials_id", [])
                          setAllChosen(false)
                        }}
                        variant="outline"
                      >
                        {t("clearFilter")}
                      </Button>
                    ) : (
                      <Button onClick={chooseAll} variant="outline">
                        {t("chooseAll")}
                      </Button>
                    )}
                    {userPermission?.includes(Permission.EditMaterials) && (
                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => {
                          resumeMaterials()
                        }}
                      >
                        {t("restore")}
                      </Button>
                    )}
                    {selectedMaterials.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {selectedMaterials.length}/{materialsTotal}
                      </p>
                    )}
                  </div>
                </div>
                {pageCount > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {t("paginationCount", {
                        currentPage: currentPage,
                        totalPage: pageCount,
                      })}
                    </p>
                    <div className="flex items-center gap-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChangePage(1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChangePage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        {t("back")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChangePage(currentPage + 1)}
                        disabled={currentPage === pageCount}
                      >
                        {t("next")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChangePage(pageCount)}
                        disabled={currentPage === pageCount}
                      >
                        <ChevronsRight size={16} />
                      </Button>
                    </div>
                    <Select value={count} onValueChange={onChangeCount}>
                      <SelectTrigger className="w-[72px]">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {listSize.map((item, index) => (
                            <SelectItem key={index} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded border p-4">
      <ListX size={32} />
      <h4 className="scroll-m-20 text-xl tracking-tight">
        {t("noBasketEmpty")}
      </h4>
    </div>
  )
}

export { ResumeMaterialList }
