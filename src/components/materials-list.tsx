import React, { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Frown,
  ListChecks,
  ListX,
  Meh,
  Smile,
  SmilePlus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react"
import { isMobile } from "react-device-detect"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"
import { z } from "zod"

import { env } from "@/env.mjs"
import {
  setIsFavourite,
  setIsNotProcessed,
  setIsProcessed,
} from "@/lib/store/materialFilterSlice"
import {
  setSortMaterialType,
  SortMaterialType,
} from "@/lib/store/sortMaterialSlice"
import { RootState, useAppDispatch, useAppSelector } from "@/lib/store/store"
import { fetchTagTable } from "@/lib/store/thunks/analytic/tag/tableTagThunk"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
import { fetchMaterials } from "@/lib/store/thunks/materialThunk"
import { Permission } from "@/lib/store/userSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { MaterialCard } from "@/components/material-card"

export interface Props {
  theme_id: string
  processed?: boolean
  unprocessed?: boolean
  favourite?: boolean
  all?: boolean
}

const listSize = ["20", "50", "100"]

const MaterialsList: React.FC<Props> = ({
  theme_id,
  all,
  processed,
  unprocessed,
  favourite,
}) => {
  const t = useTranslations()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const token = useSelector((state: RootState) => state.auth.token)
  const { materials, pageCount, pending } = useAppSelector(
    (state) => state.materials
  )

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [count, setCount] = useState<string>("20")

  const sortBy = useSelector((state: RootState) => state.sortMaterial.sort_by)
  const [allChosen, setAllChosen] = useState(false)

  const listRef = useRef(null) as any
  const [activeMaterialIndex, setActiveMaterialIndex] = useState<number | null>(
    null
  )

  const materialsTotal = useSelector(
    (state: RootState) => state.materials.materialsTotal
  )
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
    dispatch(fetchMaterials(count, value, theme_id))
    dispatch(fetchFilterCountThunk(theme_id))
    setCurrentPage(value)
  }

  const onChangeCount = (value: string) => {
    setCount(value)
    dispatch(fetchMaterials(value, currentPage, theme_id))
    dispatch(fetchFilterCountThunk(theme_id))
  }

  const handleUpdate = () => {
    if (token && theme_id) {
      form.reset()
      dispatch(fetchMaterials(count, currentPage, theme_id))
      dispatch(fetchFilterCountThunk(theme_id))
      dispatch(fetchTagTable(theme_id))
    }
  }

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

  function getMaterials() {
    const values = form.getValues("materials_id") as any
    if (!values?.length) {
      return toast({
        className: "bg-white",
        variant: "error",
        title: `${t("alert.error")}!`,
        description: t("alert.chooseMaterial"),
      })
    }
    return values
  }

  async function deleteMaterial() {
    const materials = getMaterials()
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/trash_bucket/materials/move_material_to_trash`,
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
        dispatch(fetchMaterials(count, currentPage, theme_id))
        dispatch(fetchFilterCountThunk(theme_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function makeProcessedMaterial() {
    const materials = getMaterials()
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/set_as_processed`,
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
        dispatch(fetchMaterials(count, currentPage, theme_id))
        dispatch(fetchFilterCountThunk(theme_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function makeUnProcessedMaterial() {
    const materials = getMaterials()
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/set_as_not_processed`,
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
        dispatch(fetchMaterials(count, currentPage, theme_id))
        dispatch(fetchFilterCountThunk(theme_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function makeFavouriteMaterial() {
    const materials = getMaterials()
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/set_favourite_status_true`,
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
        dispatch(fetchMaterials(count, currentPage, theme_id))
        dispatch(fetchFilterCountThunk(theme_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function makeUnFavouriteMaterial() {
    const materials = getMaterials()
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/set_favourite_status_false`,
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
        dispatch(fetchMaterials(count, currentPage, theme_id))
        dispatch(fetchFilterCountThunk(theme_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function changeTone(tone: string) {
    const materials = getMaterials()
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/update_sentiment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sentiment: tone,
            material_ids: materials,
          }),
        }
      )
      if (res.ok) {
        dispatch(fetchMaterials(count, currentPage, theme_id))
        dispatch(fetchFilterCountThunk(theme_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (unprocessed) {
      dispatch(setIsNotProcessed(true))
      dispatch(setIsProcessed(false))
      dispatch(setIsFavourite(false))
    }
    if (processed) {
      dispatch(setIsProcessed(true))
      dispatch(setIsNotProcessed(false))
      dispatch(setIsFavourite(false))
    }
    if (favourite) {
      dispatch(setIsFavourite(true))
      dispatch(setIsProcessed(false))
      dispatch(setIsNotProcessed(false))
    }
    if (all) {
      dispatch(setIsFavourite(false))
      dispatch(setIsProcessed(false))
      dispatch(setIsNotProcessed(false))
    }
  }, [dispatch, processed, favourite, favourite])

  useEffect(() => {
    if (theme_id) {
      dispatch(fetchMaterials(count, currentPage, theme_id))
      dispatch(fetchFilterCountThunk(theme_id))
    }
  }, [theme_id, count, currentPage, dispatch])

  useEffect(() => {
    if (
      activeMaterialIndex !== null &&
      listRef.current &&
      materials.length > 0
    ) {
      const materialElement = listRef.current.children[activeMaterialIndex]
      materialElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [activeMaterialIndex, materials])

  return pending ? (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  ) : materials.length > 0 ? (
    <div className="flex flex-col gap-y-4">
      <div className="flex w-fit items-center gap-x-2">
        {isMobile ? (
          <div className="flex w-screen flex-col gap-y-2 p-2">
            <p className="text-sm">{t("sortBy")}:</p>
            <div className="flex flex-wrap items-center gap-2">
              {sortByList.map((item) => (
                <Button
                  variant="ghost"
                  onClick={() => {
                    dispatch(setSortMaterialType(item.key))
                    dispatch(fetchMaterials(count, 1, theme_id))
                    dispatch(fetchFilterCountThunk(theme_id))
                  }}
                  className={`flex h-fit cursor-pointer gap-x-2 p-0 text-sm font-normal ${sortBy === item.key ? "rounded-lg border border-blue-500 p-1 !text-blue-500 no-underline" : "underline"}`}
                >
                  <small>{item.label}</small>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm">{t("sortBy")}:</p>
            <div className="flex items-center gap-x-2">
              {sortByList.map((item) => (
                <Badge
                  variant="outline"
                  onClick={() => {
                    dispatch(setSortMaterialType(item.key))
                    dispatch(fetchMaterials(count, 1, theme_id))
                    dispatch(fetchFilterCountThunk(theme_id))
                  }}
                  className={`flex cursor-pointer gap-x-2 text-sm font-normal ${sortBy === item.key ? "border-blue-500 text-blue-500" : ""}`}
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          </>
        )}
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
                  <FormItem className="grid w-full items-center gap-1.5 px-2 md:px-0">
                    <div ref={listRef} className="flex flex-col gap-4">
                      {materials.map((item: any, index: number) => (
                        <FormField
                          key={item._id}
                          name="materials_id"
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item._id}
                                className="flex items-start gap-x-2 rounded border bg-white p-2 md:p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    className="md:mt-[3px]"
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
                                  <MaterialCard
                                    material_type={item.material_type}
                                    sentiment={item.sentiment}
                                    key={item._id}
                                    id={item._id}
                                    author_id={item.author_id}
                                    title={item.title}
                                    date={item.real_created_at}
                                    text={item.description}
                                    tags={item.tags}
                                    img={item.img_url}
                                    url={item.url}
                                    src_name={item.source?.url}
                                    source_type={item.source?.source_type}
                                    updateTags={handleUpdate}
                                    is_added_manually={item.is_added_manually}
                                    is_favourite={item.is_favourite}
                                    is_processed={item.is_processed}
                                    onUpdate={() =>
                                      setActiveMaterialIndex(index)
                                    }
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
              <div className="flex w-screen flex-col gap-y-2 rounded border bg-white p-2 md:w-full">
                <div className="flex items-center justify-between">
                  <div className="flex w-full items-center justify-between">
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
                      {selectedMaterials.length > 0 && !isMobile && (
                        <p className="text-sm text-muted-foreground">
                          {selectedMaterials.length}/{materialsTotal}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-x-4">
                      {userPermission?.includes(Permission.EditMaterials) && (
                        <Popover>
                          <PopoverTrigger>
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger>
                                  <Button variant="outline" size="sm">
                                    <ListChecks size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {t("processedMaterial")} /{" "}
                                  {t("unprocessedMaterial")}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="flex items-center gap-x-4">
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      onClick={makeProcessedMaterial}
                                      variant="outline"
                                    >
                                      <Check
                                        size={16}
                                        className="stroke-green-500"
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {t("processedMaterial")}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      onClick={makeUnProcessedMaterial}
                                      variant="outline"
                                    >
                                      <Check
                                        size={16}
                                        className="stroke-gray-500"
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {t("unprocessedMaterial")}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      {userPermission?.includes(Permission.EditMaterials) && (
                        <Popover>
                          <PopoverTrigger>
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger>
                                  <Button variant="outline" size="sm">
                                    <SmilePlus size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t("tone")}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="flex items-center gap-x-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      onClick={() => {
                                        changeTone("negative")
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                      <Frown size={20} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {t("negative")}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      onClick={() => {
                                        changeTone("neutral")
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                                    >
                                      <Meh size={20} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {t("neutral")}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      onClick={() => {
                                        changeTone("positive")
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="border-primeGreen text-primeGreen hover:bg-primeGreen hover:text-white"
                                    >
                                      <Smile size={20} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {t("positive")}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      {userPermission?.includes(Permission.EditMaterials) && (
                        <Popover>
                          <PopoverTrigger>
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger>
                                  <Button variant="outline" size="sm">
                                    <Star size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {t("saved")} / {t("unsaved")}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="flex items-center gap-x-4">
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={makeFavouriteMaterial}
                                    >
                                      <Star
                                        className="fill-amber-300 stroke-amber-300"
                                        size={16}
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>{t("saved")}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={makeUnFavouriteMaterial}
                                    >
                                      <StarOff
                                        className="stroke-amber-300"
                                        size={16}
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {t("unsaved")}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      {userPermission?.includes(Permission.DeleteMaterials) && (
                        <Dialog>
                          <DialogTrigger>
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger>
                                  <Button variant="outline">
                                    <Trash2 size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t("delete")}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader className="flex flex-row items-center justify-between">
                              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                {t("confirmDelete", {
                                  item: t("materials")?.toLowerCase(),
                                })}
                              </h4>
                            </DialogHeader>
                            <DialogFooter className="flex items-center gap-x-4">
                              <DialogClose>{t("no")}</DialogClose>
                              <Button
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={deleteMaterial}
                              >
                                {t("yes")}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
                {pageCount > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {isMobile
                        ? `${currentPage}/${pageCount}`
                        : t("paginationCount", {
                            currentPage: currentPage,
                            totalPage: pageCount,
                          })}
                    </p>
                    <div className="flex items-center gap-x-2">
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
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChangePage(currentPage + 1)}
                        disabled={currentPage === pageCount}
                      >
                        <ChevronRight size={16} />
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
      <h4 className="scroll-m-20 text-xl tracking-tight">{t("noMaterial")}</h4>
    </div>
  )
}

export { MaterialsList }
