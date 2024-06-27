import React, { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "@/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { getCookie } from "cookies-next"
import { format } from "date-fns"
import {
  Check,
  ChevronDown,
  Frown,
  Meh,
  Pencil,
  Plus,
  Smile,
  Star,
  Trash2,
  X,
} from "lucide-react"
import { isMobile } from "react-device-detect"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"
import { z } from "zod"

import { env } from "@/env.mjs"
import { FormValues } from "@/types/filter"
import {
  setTableTagData,
  setTableTagPending,
} from "@/lib/store/analytic/tag/tableTagSlice"
import { setSources } from "@/lib/store/materialFilterSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
import { fetchMaterials } from "@/lib/store/thunks/materialThunk"
import { Permission } from "@/lib/store/userSlice"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  id: string
  author_id: string | null
  title: string
  date: string
  text: string
  tags: any
  img: string | null | undefined
  url: string
  src_name: string
  source_type: "social_network" | "news" | "all"
  updateTags: () => void
  sentiment: string
  is_favourite: boolean
  is_processed: boolean
  is_added_manually: boolean
  material_type: string
  onUpdate?: () => void
}

const MaterialCard: React.FC<Props> = ({
  material_type,
  id,
  author_id,
  sentiment,
  title,
  date,
  text,
  tags,
  img,
  url,
  src_name,
  source_type,
  updateTags,
  is_favourite,
  is_processed,
  is_added_manually,
  onUpdate,
}) => {
  const t = useTranslations()

  const dispatch = useAppDispatch()

  const path = usePathname()
  const token = getCookie("scano_acess_token")
  const [themeId, setThemeId] = useState<string>("")
  const [pending, setPending] = useState<boolean>(false)
  const [tone, setTone] = useState<string | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isProcessed, setIsProcessed] = useState<boolean>(false)

  const [open, setOpen] = useState(false)
  const [openTags, setOpenTags] = useState(false)
  const tagsData = useSelector((state: RootState) => state.tagList.data)
  const userPermission = useSelector(
    (state: RootState) => state.userData.user?.permissions
  )

  async function getPhoto(img: string) {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/files/${img}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        setPhoto(res.url)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setPending(false)
    }
  }

  async function isFavouriteCard(id: string, state: boolean) {
    try {
      if (state) {
        await fetch(
          `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}/set_as_not_favourite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } else {
        await fetch(
          `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}/set_as_favourite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      updateTags()
    }
  }

  async function isProcessedCard(id: string, state: boolean) {
    try {
      if (state) {
        await fetch(
          `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}/set_as_not_proccessed`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } else {
        await fetch(
          `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}/set_as_processed`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      updateTags()
    }
  }

  async function changeSent(id: string, sent: string) {
    try {
      await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}/update_sentiment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sentiment: sent,
          }),
        }
      )
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteCard(id: string) {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/trash_bucket/materials/move_material_to_trash`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([id]),
        }
      )
      if (res.ok) {
        updateTags()
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function addTags() {
    try {
      await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}/add_tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tags: form.getValues("tags"),
          }),
        }
      )
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteTag(name: string) {
    try {
      await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/materials/${id}/delete_tags`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tags: [name],
          }),
        }
      )
    } catch (e) {
      console.error(e)
    } finally {
      updateTags()
    }
  }

  async function deleteFullTag(id: string) {
    dispatch(setTableTagPending(true))
    dispatch(setTableTagData([]))
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/tags/${id}/${themeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (res.ok) {
      updateTags()
    }
  }

  async function deleteAuthorById() {
    if (!author_id) {
      return
    }
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${themeId}/analytics/authors/${author_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (res.ok) {
      updateTags()
    }
  }

  async function deleteSourceById() {
    if (!src_name) {
      return
    }
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${themeId}/sources/${src_name}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (res.ok) {
      updateTags()
    }
  }

  const FormSchema = z.object({
    tags: z.array(z.string()),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tags: tags.map((tag: any) => tag.name),
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addTags().then(() => {
      updateTags()
    })
    setOpenTags(false)
  }

  useEffect(() => {
    setThemeId(path.split("/")[1])
  }, [path])

  useEffect(() => {
    setIsFavorite(is_favourite)
    setIsProcessed(is_processed)
    setTone(sentiment)
    if (img) {
      getPhoto(img)
    }
  }, [sentiment, img])

  const changeTone = (tone: string) => {
    setTone(tone)
  }

  return isMobile ? (
    <div className="flex h-fit flex-col gap-y-2">
      <div className="flex items-center gap-x-2">
        {material_type && <Badge>{t(material_type)}</Badge>}
        <small>{format(new Date(date), "dd.MM.yyyy HH:mm")}</small>
      </div>
      <div className="flex flex-col gap-y-1">
        <h4 className="text-md font-semibold">
          {is_added_manually && `[${t("addedManually")}]`} {title}
        </h4>
        <small className="two-line-clamp">{text}</small>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="w-fit p-0 text-sm underline">
              {t("showAllText")}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="h-dvh max-w-screen-md overflow-y-scroll"
            onInteractOutside={() => {
              setOpen(false)
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-x-2 border-b">
                <h4 className="scroll-m-20 text-xl font-medium tracking-tight">
                  {t("allText")}
                </h4>
                <Badge className="!mt-0">{t(material_type)}</Badge>
              </div>
              <>
                <div className="mb-2 flex flex-col border-b py-2">
                  <small>
                    {t("source")}:{" "}
                    <span className="text-blue-500 underline">{src_name}</span>
                  </small>
                  <small>
                    {t("time")}:{" "}
                    <span className="">
                      {format(new Date(date), "dd.MM.yyyy HH:mm")}
                    </span>
                  </small>
                  <small className="flex items-center gap-x-1">
                    {t("link")}:{" "}
                    <a
                      href={url}
                      target="_blank"
                      className="flex h-fit w-36 truncate p-0 text-right text-blue-500 underline"
                    >
                      {url}
                    </a>
                  </small>
                </div>
                {img ? (
                  photo ? (
                    <div className="h-fit w-fit overflow-hidden rounded border border-black">
                      <Image
                        src={photo}
                        alt="material img"
                        width={200}
                        height={150}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )
                ) : pending ? (
                  <Skeleton className="h-[100px] w-[200px]" />
                ) : (
                  <div></div>
                )}
                <div className="mt-4 h-1/2">
                  <p className="text-sm">{text}</p>
                </div>
              </>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-x-2">
        <small className="flex truncate text-blue-500 underline">
          {src_name}
        </small>{" "}
        |
        <small>
          <a
            href={url}
            target="_blank"
            className="flex w-32 truncate text-right text-blue-500 underline"
          >
            {url}
          </a>
        </small>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((item: any) => (
          <Badge
            style={{ backgroundColor: item.tag_color, color: "white" }}
            variant="outline"
            className={cn(
              item.tag_color ? "" : "border-blue-500 text-blue-500",
              "z-50"
            )}
            key={item.id}
            onClick={() => {
              if (userPermission?.includes(Permission.DeleteTags)) {
                deleteTag(item.name)
              }
            }}
          >
            {item.name}
            {userPermission?.includes(Permission.DeleteTags) && <X size={14} />}
          </Badge>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex cursor-pointer items-start gap-x-2">
      <div className="flex w-full items-start justify-between gap-x-4">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-4">
            {material_type && <Badge>{t(material_type)}</Badge>}
            <Popover>
              <PopoverTrigger>
                <small className="flex items-center">
                  {t("source")}:{" "}
                  <span className="flex truncate text-blue-500 underline">
                    {src_name}
                  </span>
                  <ChevronDown size={16} className="hover:stroke-blue-500" />
                </small>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="flex justify-start"
                    onClick={() => {
                      dispatch(setSources([src_name]))
                      dispatch(fetchMaterials("20", 1, themeId))
                      dispatch(fetchFilterCountThunk(themeId))
                    }}
                  >
                    {t("filterBySource")}
                  </Button>
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        variant="ghost"
                        className="mt-2 flex justify-start"
                      >
                        {source_type === "social_network"
                          ? t("deleteAuthor")
                          : t("deleteSource")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader className="flex flex-row items-center justify-between">
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                          {t("confirmDelete", {
                            item:
                              source_type === "social_network"
                                ? t("author's")
                                : t("source"),
                          })}
                        </h4>
                      </DialogHeader>
                      <DialogFooter className="flex items-center gap-x-4">
                        <DialogClose>{t("no")}</DialogClose>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={
                            source_type === "social_network"
                              ? deleteAuthorById
                              : deleteSourceById
                          }
                        >
                          {t("yes")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </PopoverContent>
            </Popover>
            <small>
              {t("time")}:{" "}
              <span>{format(new Date(date), "dd.MM.yyyy HH:mm")}</span>
            </small>
            <small className="flex items-center gap-x-1">
              {t("link")}:{" "}
              <a
                href={url}
                target="_blank"
                className="flex h-fit w-32 truncate p-0 text-right text-blue-500 underline"
              >
                {url}
              </a>
            </small>
          </div>
          <div className="flex w-full flex-col items-start gap-y-2">
            <h4 className="text-lg font-semibold">
              {is_added_manually && `[${t("addedManually")}]`} {title}
            </h4>
            <small className="two-line-clamp">{text}</small>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 underline">
                  {t("showAllText")}
                </Button>
              </DialogTrigger>
              <DialogContent
                className="h-1/2 max-w-screen-md"
                onInteractOutside={() => {
                  setOpen(false)
                }}
              >
                <DialogHeader className="flex w-full flex-row items-center gap-x-4">
                  <h4 className="scroll-m-20 text-xl font-medium tracking-tight">
                    {t("allText")}
                  </h4>
                  <Badge className="!mt-0">{t(material_type)}</Badge>
                </DialogHeader>
                <DialogDescription>
                  <ScrollArea className="h-[300px]">
                    <div className="mb-2 flex gap-x-2 border-b pb-2">
                      <small>
                        {t("source")}:{" "}
                        <span className="text-blue-500 underline">
                          {src_name}
                        </span>
                      </small>
                      <small>
                        {t("time")}:{" "}
                        <span className="">
                          {format(new Date(date), "dd.MM.yyyy HH:mm")}
                        </span>
                      </small>
                      <small className="flex items-center gap-x-1">
                        {t("link")}:{" "}
                        <a
                          href={url}
                          target="_blank"
                          className="flex h-fit w-32 truncate p-0 text-right text-blue-500 underline"
                        >
                          {url}
                        </a>
                      </small>
                    </div>
                    {img ? (
                      photo ? (
                        <div className="h-fit w-fit overflow-hidden rounded border border-black">
                          <Image
                            src={photo}
                            alt="material img"
                            width={200}
                            height={150}
                          />
                        </div>
                      ) : (
                        <div></div>
                      )
                    ) : pending ? (
                      <Skeleton className="h-[100px] w-[200px]" />
                    ) : (
                      <div></div>
                    )}
                    <p className="mt-4">{text}</p>
                  </ScrollArea>
                </DialogDescription>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-x-2">
              {tags.map((item: any) => (
                <Badge
                  style={{ backgroundColor: item.tag_color, color: "white" }}
                  variant="outline"
                  className={cn(
                    item.tag_color ? "" : "border-blue-500 text-blue-500",
                    "z-50"
                  )}
                  key={item.id}
                  onClick={() => {
                    if (userPermission?.includes(Permission.DeleteTags)) {
                      deleteTag(item.name)
                    }
                  }}
                >
                  {item.name}
                  {userPermission?.includes(Permission.DeleteTags) && (
                    <X size={14} />
                  )}
                </Badge>
              ))}
              {userPermission?.includes(Permission.EditMaterials) && (
                <Dialog open={openTags} onOpenChange={setOpenTags}>
                  <DialogTrigger>
                    <Button
                      variant="link"
                      className="flex items-center gap-x-1 p-0"
                    >
                      <Plus size={12} />
                      {t("addTag")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="h-1/2 max-w-screen-md"
                    onInteractOutside={() => {
                      setOpenTags(false)
                    }}
                  >
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h4 className="scroll-m-20 text-xl font-medium tracking-tight">
                          {t("addTagTitle")}
                        </h4>
                        <div className="mt-4 flex flex-col gap-y-4 rounded">
                          <FormField
                            name="tags"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem
                                className="w-full"
                                id="tags"
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={field.value.join(", ")}
                                    className="pointer-events-none"
                                  />
                                </FormControl>
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                                  {tagsData.map((item: any) => (
                                    <Badge
                                      style={{
                                        backgroundColor:
                                          !field.value.includes(item.name) &&
                                          item.tag_color,
                                      }}
                                      variant="outline"
                                      className={cn(
                                        !field.value.includes(item.name) &&
                                          item.tag_color
                                          ? "text-white"
                                          : "border-blue-500 text-blue-500",
                                        "z-50 mr-2 cursor-pointer"
                                      )}
                                      key={item.id}
                                      onClick={() =>
                                        field.value.includes(item.name)
                                          ? field.onChange(
                                              field.value.filter(
                                                (f) => f !== item.name
                                              )
                                            )
                                          : field.onChange([
                                              ...field.value,
                                              item.name,
                                            ])
                                      }
                                    >
                                      {item.name}
                                      {field.value.includes(item.name) && (
                                        <X size={14} />
                                      )}
                                    </Badge>
                                  ))}
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          variant="default"
                          className="mt-4 flex items-center"
                        >
                          {t("save")}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-1/4 flex-col items-end gap-y-4">
          <div className="flex items-center gap-x-2">
            {userPermission?.includes(Permission.EditMaterials) && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        isProcessedCard(id, isProcessed)
                        onUpdate && onUpdate()
                      }}
                    >
                      {isProcessed ? (
                        <Check size={20} className={cn("stroke-green-500")} />
                      ) : (
                        <Check size={20} className={cn("stroke-gray-500")} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isProcessed
                      ? t("processedMaterial")
                      : t("unprocessedMaterial")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {tone && userPermission?.includes(Permission.EditMaterials) && (
              <Popover>
                <PopoverTrigger>
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger>
                        <Button variant="outline" size="sm">
                          {tone === "negative" && (
                            <Frown className="stroke-red-500" size={20} />
                          )}
                          {tone === "neutral" && (
                            <Meh className="stroke-blue-500" size={20} />
                          )}
                          {tone === "positive" && (
                            <Smile className="stroke-primeGreen" size={20} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t(tone)}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex items-center gap-x-4">
                    <Button
                      onClick={() => {
                        changeTone("negative")
                        changeSent(id, "negative")
                        dispatch(fetchFilterCountThunk(themeId))
                        onUpdate && onUpdate()
                      }}
                      variant="outline"
                      size="sm"
                      className={cn(
                        tone === "negative"
                          ? "border-red-500 bg-red-500 text-white hover:bg-red-500 hover:text-white"
                          : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      )}
                    >
                      <Frown size={20} />
                    </Button>
                    <Button
                      onClick={() => {
                        changeTone("neutral")
                        changeSent(id, "neutral")
                        dispatch(fetchFilterCountThunk(themeId))
                        onUpdate && onUpdate()
                      }}
                      variant="outline"
                      size="sm"
                      className={cn(
                        tone === "neutral"
                          ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-500 hover:text-white"
                          : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                      )}
                    >
                      <Meh size={20} />
                    </Button>
                    <Button
                      onClick={() => {
                        changeTone("positive")
                        changeSent(id, "positive")
                        dispatch(fetchFilterCountThunk(themeId))
                        onUpdate && onUpdate()
                      }}
                      variant="outline"
                      size="sm"
                      className={cn(
                        tone === "positive"
                          ? "border-primeGreen bg-primeGreen text-white hover:bg-primeGreen hover:text-white"
                          : "border-primeGreen text-primeGreen hover:bg-primeGreen hover:text-white"
                      )}
                    >
                      <Smile size={20} />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {userPermission?.includes(Permission.EditMaterials) && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        isFavouriteCard(id, isFavorite)
                        onUpdate && onUpdate()
                      }}
                    >
                      <Star
                        className={cn(
                          isFavorite ? "fill-amber-300 stroke-amber-300" : ""
                        )}
                        size={16}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("saved")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {/*<TooltipProvider delayDuration={200}>*/}
            {/*  <Tooltip>*/}
            {/*    <TooltipTrigger>*/}
            {/*      <Button variant="outline" size="sm">*/}
            {/*        <Share size={16}/>*/}
            {/*      </Button>*/}
            {/*    </TooltipTrigger>*/}
            {/*    <TooltipContent>*/}
            {/*      {t('share')}*/}
            {/*    </TooltipContent>*/}
            {/*  </Tooltip>*/}
            {/*</TooltipProvider>*/}
            {userPermission?.includes(Permission.DeleteMaterials) && (
              <Dialog>
                <DialogTrigger>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="outline" size="sm">
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
                      {t("confirmDelete", { item: t("material") })}
                    </h4>
                  </DialogHeader>
                  <DialogFooter className="flex items-center gap-x-4">
                    <DialogClose>{t("no")}</DialogClose>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        deleteCard(id)
                        onUpdate && onUpdate()
                      }}
                    >
                      {t("yes")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {img ? (
            photo ? (
              <div className="h-28 w-fit overflow-hidden rounded border border-black">
                <Image
                  src={photo}
                  alt="material img"
                  width={200}
                  height={150}
                />
              </div>
            ) : (
              <div></div>
            )
          ) : pending ? (
            <Skeleton className="h-[100px] w-[200px]" />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  )
}

export { MaterialCard }
