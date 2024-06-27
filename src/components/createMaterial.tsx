import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ThemeData } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"
import { z } from "zod"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// const countries = [
//   {
//     name: "Россия",
//     value: "ru",
//   },
//   {
//     name: "США",
//     value: "us",
//   },
//   {
//     name: "Китай",
//     value: "cn",
//   },
//   {
//     name: "Япония",
//     value: "jp",
//   },
//   {
//     name: "Германия",
//     value: "de",
//   },
//   {
//     name: "Франция",
//     value: "fr",
//   },
//   {
//     name: "Великобритания",
//     value: "gb",
//   },
//   {
//     name: "Индия",
//     value: "in",
//   },
//   {
//     name: "Канада",
//     value: "ca",
//   },
//   {
//     name: "Бразилия",
//     value: "br",
//   },
// ]

interface CreateMaterialProps {
  onMaterialCreated?: () => void // функция без аргументов и возвращаемого значения
}

export const CreateMaterial = ({ onMaterialCreated }: CreateMaterialProps) => {
  const { toast } = useToast()
  const t = useTranslations()
  const params = useParams()
  const token = useSelector((state: RootState) => state.auth.token)

  const [date, setDate] = React.useState<Date>()
  const [themes, setThemes] = useState<ThemeData[]>([])
  const [showFull, setShowFull] = useState(false)

  const FormSchema = z.object({
    theme_id: z.string().min(1, {
      message: t("inputError"),
    }),
    url: z.string().min(3, {
      message: t("inputError"),
    }),
    materialType: z.enum(["comment", "repost", "stories"]),
    materialSource: z.string().min(1, {
      message: t("inputError"),
    }),
    title: z.string().min(3, {
      message: t("inputError"),
    }),
    description: z.string().min(1, {
      message: t("inputError"),
    }),
    author_name: z.string(),
    author_url: z.string(),
    time: z.string().min(3, {
      message: t("inputError"),
    }),
    country: z.string(),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      theme_id: "",
      url: "",
      materialSource: "news",
      materialType: "comment",
      title: "",
      description: "",
      author_name: "",
      author_url: "",
      time: "",
      country: "",
    },
  })
  const { control, getValues, setValue } = form
  const urlWatcher = useWatch({ control, name: "url" })
  const idWatcher = useWatch({ control, name: "theme_id" })

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value
    value = value.replace(/[^0-9:]/g, "")

    const numbersOnly = value.replace(/:/g, "")
    if (numbersOnly.length <= 2) {
      value = numbersOnly.slice(0, 2)
    } else {
      value = numbersOnly.slice(0, 2) + ":" + numbersOnly.slice(2, 4)
    }

    if (/^(\d{0,2}):?(\d{0,2})?$/.test(value) || value === "") {
      form.setValue("time", value)
    }
  }

  async function getMaterialByUrl(url: string) {
    const data = getValues()
    if (!data.theme_id) {
      toast({
        className: "bg-white",
        variant: "error",
        title: `${t("alert.error")}!`,
        description: t("alert.chooseTheme"),
      })
      return
    }
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${data.theme_id}/get_material_by_url?url=${url}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const result = await res.json()
    setShowFull(true)
    if (result.material || result.author) {
      setValue("materialSource", result.material?.source?.source_type)
      setValue("materialType", result.material?.material_type)
      setValue("title", result.material?.title)
      setValue("description", result.material?.description)
      setValue(
        "author_name",
        `${result.author?.first_name} ${result.author?.last_name}`
      )
      setValue("author_url", result.author?.avatar_url)
      setDate(result.material?.real_created_at)
      setValue("time", format(result.material?.real_created_at, "HH:mm"))
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    const partsName = data.author_name.split(" ")
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${data.theme_id}/materials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            material: {
              title: data.title,
              description: data.description,
              language: "unknown",
              url: data.url,
              comments_number: 0,
              likes_number: 0,
              reposts_number: 0,
              views_number: 0,
              sentiment: "positive",
              material_type:
                data.materialSource === "social_network"
                  ? data.materialType
                  : "news",
              real_created_at: date
                ? format(date, "yyyy-MM-dd") +
                  "T" +
                  (data.time ? data.time : "00:00")
                : format(new Date(), "yyyy-MM-dd") +
                  "T" +
                  new Date().getHours() +
                  ":" +
                  new Date().getMinutes(),
              source: {
                source_type: data.materialSource,
                url: data.author_url,
              },
              img_url: "",
              tags: [],
            },
            author: {
              first_name: partsName[0],
              last_name: partsName[1],
              age: 0,
              gender: "unknown",
              username: "",
              avatar_url: "",
              author_type: "unknown",
              subscriber_count: 0,
            },
          }),
        }
      )
      if (res.ok) {
        toast({
          className: "bg-white",
          variant: "success",
          title: `${t("alert.success")}!`,
          description: `${t("alert.successAddMaterial")}!`,
        })
        if (onMaterialCreated) {
          onMaterialCreated()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const themes = localStorage.getItem("themeList")
    if (themes) {
      setThemes(JSON.parse(themes))
    }
  }, [])

  useEffect(() => {
    if (urlWatcher.length > 3) {
      getMaterialByUrl(urlWatcher)
    }
  }, [urlWatcher, idWatcher])

  useEffect(() => {
    if (!params.theme_id || !themes.length) {
      return
    }
    setValue("theme_id", params?.theme_id as string)
  }, [themes])
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded border p-4"
        >
          <div className="flex flex-col gap-y-6">
            <FormField
              name="theme_id"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("theme")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("chooseTheme")}
                          className="uppercase"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {themes.map((item) => (
                          <SelectItem value={item._id} key={item._id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name="url"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid w-full items-center gap-1.5">
                  <FormLabel>{t("link")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      className="!mt-0"
                      placeholder={t("linkPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showFull && (
              <>
                <FormField
                  name="materialSource"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid w-full items-center gap-3">
                      <FormLabel>{t("srcType")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center gap-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="news" id="r1" />
                            </FormControl>
                            <FormLabel className="!mt-0">
                              {t("onlineSMI")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="social_network" id="r1" />
                            </FormControl>
                            <FormLabel className="!mt-0">
                              {t("social")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.getValues("materialSource") === "social_network" && (
                  <FormField
                    name="materialType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid w-full items-center gap-3">
                        <FormLabel>{t("materialType")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center gap-x-4"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="comment" id="r1" />
                              </FormControl>
                              <FormLabel className="!mt-0">
                                {t("comment")}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="post" id="r1" />
                              </FormControl>
                              <FormLabel className="!mt-0">
                                {t("post")}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="repost" id="r1" />
                              </FormControl>
                              <FormLabel className="!mt-0">
                                {t("repost")}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="stories" id="r1" />
                              </FormControl>
                              <FormLabel className="!mt-0">
                                {t("stories")}
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid w-full items-center gap-1.5">
                      <FormLabel>{t("header")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="!mt-0"
                          placeholder={t("header")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid w-full items-center gap-1.5">
                      <FormLabel>{t("text")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t("text")}
                          className="resize-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.getValues("materialSource") === "social_network" && (
                  <div className="flex items-center gap-x-4">
                    <FormField
                      name="author_name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="grid w-1/2 items-center gap-1.5">
                          <FormLabel>{t("authorName")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="!mt-0"
                              placeholder={t("authorName")}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="author_url"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="grid w-1/2 items-center gap-1.5">
                          <FormLabel>{t("linkProfileAuthor")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="!mt-0"
                              placeholder={t("linkProfileAuthor")}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <div className="flex items-center gap-x-4">
                  <div className="grid w-1/2 items-center gap-1.5">
                    <Label htmlFor="picture">{t("datePublish")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "justify-between text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {date ? (
                            <>{format(date, "dd-MM-yyyy")}</>
                          ) : (
                            <>
                              <span className="text-muted-foreground">
                                {t("chooseDate")}
                              </span>
                              <CalendarIcon className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={ru}
                          initialFocus
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormField
                    name="time"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grid w-1/2 items-center gap-1.5">
                        <FormLabel className="!mt-0">{t("time")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoComplete="off"
                            onChange={handleTimeChange}
                            className="!mt-0"
                            placeholder="00:00"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            <Button
              variant="outline"
              className="w-fit border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              {t("save")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
