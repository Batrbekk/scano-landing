"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { getCookie } from "cookies-next"
import { Filter, FilterX } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"
import { z } from "zod"

import { env } from "@/env.mjs"
import { FormSchema, FormValues } from "@/types/filter"
import {
  Language,
  MaterialType,
  Sentiment,
  SourceType,
} from "@/lib/store/filterCountSlice"
import {
  setAge,
  setAuthorType,
  setGender,
  setLanguage,
  setMaterialType,
  setSentiment,
  setSources,
  setSourceType,
  setSubscriberCount,
  setTags,
} from "@/lib/store/materialFilterSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchDynamicAuthor } from "@/lib/store/thunks/analytic/author/dynamicAuthorThunk"
import { fetchTableAuthor } from "@/lib/store/thunks/analytic/author/tableAuthorThunk"
import { fetchLanguageReview } from "@/lib/store/thunks/analytic/review/languageReviewThunk"
import { fetchToneReview } from "@/lib/store/thunks/analytic/review/toneReviewThunk"
import { fetchDynamicSource } from "@/lib/store/thunks/analytic/source/dynamicSourceThunk"
import { fetchMessageSource } from "@/lib/store/thunks/analytic/source/messageSourceThunk"
import { fetchMessageTypeSource } from "@/lib/store/thunks/analytic/source/messageTypeSourceThunk"
import { fetchTableSource } from "@/lib/store/thunks/analytic/source/tableSourceThunk"
import { fetchToneSource } from "@/lib/store/thunks/analytic/source/toneSourceThunk"
import { fetchDynamicTag } from "@/lib/store/thunks/analytic/tag/dynamicTagThunk"
import { fetchMessageTag } from "@/lib/store/thunks/analytic/tag/messageTagThunk"
import { fetchTagTable } from "@/lib/store/thunks/analytic/tag/tableTagThunk"
import { fetchToneTag } from "@/lib/store/thunks/analytic/tag/toneTagThunk"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
import { fetchMainChart } from "@/lib/store/thunks/mainChartThunk"
import { fetchMaterials } from "@/lib/store/thunks/materialThunk"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComboboxSource, ExcludedSource } from "@/components/combobox-source"

const FilterSide = () => {
  const t = useTranslations()
  const params = useParams()
  const dispatch = useAppDispatch()
  const token = getCookie("scano_acess_token")
  const materialsTotal = useSelector(
    (state: RootState) => state.materials.materialsTotal
  )
  const filterValues = useSelector((state: RootState) => state.materialFilter)
  const authorFilterValues = useSelector(
    (state: RootState) => state.materialFilter.author_filter
  )
  const filterCount = useSelector((state: RootState) => state.filterCount)
  const [open, setOpen] = useState(false)
  const [themeId, setThemeId] = useState<string>("")
  const tagsData = useSelector((state: RootState) => state.tagList.data)

  const [auditoryStart, setAuditoryStart] = useState("")
  const [auditoryEnd, setAuditoryEnd] = useState("")

  const [chooseList, setChooseList] = useState<ExcludedSource[]>([])
  const [excludedList, setExcludedList] = useState<ExcludedSource[]>([])

  const toneOption: { key: keyof Sentiment; label: string }[] = [
    {
      key: "positive",
      label: t("positiveNotation"),
    },
    {
      key: "negative",
      label: t("negativeNotation"),
    },
    {
      key: "neutral",
      label: t("neutralNotation"),
    },
  ]
  const materialType: { key: keyof MaterialType; label: string }[] = [
    {
      label: t("post"),
      key: "post",
    },
    {
      label: t("repost"),
      key: "repost",
    },
    {
      label: t("comments"),
      key: "comment",
    },
    {
      label: t("stories"),
      key: "stories",
    },
  ]
  const lang: { key: keyof Language; label: string }[] = [
    {
      label: "Қазақша",
      key: "kk",
    },
    {
      label: "Русский",
      key: "ru",
    },
    {
      label: "English",
      key: "en",
    },
  ]
  const collection: { key: keyof SourceType; label: string }[] = [
    {
      label: t("social"),
      key: "social_network",
    },
    {
      label: t("video"),
      key: "video",
    },
    {
      label: t("messengerChanel"),
      key: "messenger_chanel",
    },
    {
      label: t("messengerGroup"),
      key: "messenger_group",
    },
    {
      label: t("news"),
      key: "news",
    },
  ]
  const sources = [
    {
      label: "vk.com",
      key: "vk.com",
    },
    {
      label: "instagram.com",
      key: "instagram.com",
    },
    {
      label: "youtube.com",
      key: "youtube.com",
    },
    {
      label: "telegram.com",
      key: "telegram.com",
    },
    {
      label: "twitter.com",
      key: "twitter.com",
    },
  ]
  const authorType: { key: string; label: string }[] = [
    {
      key: "person",
      label: t("person"),
    },
    {
      key: "group",
      label: t("group"),
    },
    {
      key: "company",
      label: t("company"),
    },
  ]
  const authorAges = [
    {
      key: [0, 18],
      label: t("0,18"),
    },
    {
      key: [18, 24],
      label: t("18,24"),
    },
    {
      key: [24, 34],
      label: t("24,34"),
    },
    {
      key: [34, 44],
      label: t("34,44"),
    },
    {
      key: [44, 54],
      label: t("44,54"),
    },
    {
      key: [55, 100],
      label: t("55,100"),
    },
  ]
  const authorGender: { key: string; label: string }[] = [
    {
      label: t("male"),
      key: "male",
    },
    {
      label: t("female"),
      key: "female",
    },
  ]

  async function getExcludedList() {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/api/v1/get_all_sources`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setExcludedList(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tone: filterValues.material_filter.sentiment,
      material_type: filterValues.material_filter.material_type,
      language: filterValues.material_filter.language,
      source_type: filterValues.material_filter.source_type,
      sources: filterValues.material_filter.sources,
      tags: filterValues.material_filter.tags,
      author_type: authorFilterValues.author_type,
      author_age: authorFilterValues.age,
      author_gender: authorFilterValues.gender,
      author_subscriber_count: authorFilterValues.subscriber_count,
    },
  })
  const selectedSources = useWatch({ control: form.control, name: "sources" })

  const handleItemClick = (item: ExcludedSource) => {
    let newChooseList
    if (chooseList.some((x) => x._id === item._id)) {
      newChooseList = chooseList.filter((x) => x._id !== item._id)
    } else {
      newChooseList = [...chooseList, item]
    }
    setChooseList(newChooseList)
    form.setValue(
      "sources",
      newChooseList.map((x) => x.url)
    )
  }

  const handleRemoveClick = (id: string) => {
    const newChooseList = chooseList.filter((item) => item._id !== id)
    setChooseList(newChooseList)
    form.setValue(
      "sources",
      newChooseList.map((x) => x.url)
    )
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch(setSentiment(data.tone))
    dispatch(setMaterialType(data.material_type))
    dispatch(setLanguage(data.language))
    dispatch(setSourceType(data.source_type))
    dispatch(setSources(data.sources))
    dispatch(setTags(data.tags))
    dispatch(setAuthorType(data.author_type))
    dispatch(setAge(data.author_age))
    dispatch(setGender(data.author_gender))
    if (auditoryStart.length < 1 && auditoryEnd.length < 1) {
      dispatch(setSubscriberCount([]))
    } else {
      dispatch(
        setSubscriberCount([parseInt(auditoryStart), parseInt(auditoryEnd)])
      )
    }
    setOpen(false)
    dispatch(fetchMaterials("20", 1, themeId))
    dispatch(fetchFilterCountThunk(themeId))
    dispatch(fetchMainChart(themeId))
    dispatch(fetchToneReview(themeId))
    dispatch(fetchLanguageReview(themeId))
    dispatch(fetchMessageSource(themeId))
    dispatch(fetchDynamicSource(themeId))
    dispatch(fetchMessageTypeSource(themeId))
    dispatch(fetchToneSource(themeId))
    dispatch(fetchDynamicAuthor(themeId))
    dispatch(fetchDynamicTag(themeId))
    dispatch(fetchMessageTag(themeId))
    dispatch(fetchToneTag(themeId))
    dispatch(fetchTagTable(themeId))
    dispatch(fetchTableSource(themeId, 1))
    dispatch(fetchTableAuthor(themeId, 1))
  }

  const includesRange = (ranges: any[], range: any[]) => {
    return ranges
      ? ranges.some((r) => r[0] === range[0] && r[1] === range[1])
      : false
  }

  useEffect(() => {
    getExcludedList()
  }, [])

  useEffect(() => {
    setChooseList((prevState) =>
      prevState.filter((f) => selectedSources.includes(f.url))
    )
  }, [selectedSources])

  useEffect(() => {
    form.reset({
      tone: filterValues.material_filter.sentiment,
      material_type: filterValues.material_filter.material_type,
      language: filterValues.material_filter.language,
      source_type: filterValues.material_filter.source_type,
      sources: filterValues.material_filter.sources,
      tags: filterValues.material_filter.tags,
      author_type: authorFilterValues.author_type,
      author_age: authorFilterValues.age,
      author_gender: authorFilterValues.gender,
      author_subscriber_count: authorFilterValues.subscriber_count,
    })
  }, [filterValues, form.reset])

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-screen flex-col gap-y-4 overflow-y-scroll border-l p-4 pb-16"
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex w-full items-center gap-x-2 border-blue-500 bg-transparent text-blue-500 hover:bg-blue-500 hover:text-white"
              variant="outline"
            >
              {t("fullFilter")}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-4xl"
            onInteractOutside={() => {
              setOpen(false)
            }}
          >
            <DialogHeader>
              <DialogTitle>
                <p className="text-lg font-medium">{t("filters")}</p>
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <Tabs defaultValue="main">
                <TabsList className="flex w-full items-center justify-between">
                  <TabsTrigger value="main">{t("mainFilterTab")}</TabsTrigger>
                  <TabsTrigger value="source">{t("srcFilterTab")}</TabsTrigger>
                  <TabsTrigger value="authors">
                    {t("authorFilterTab")}
                  </TabsTrigger>
                  <TabsTrigger value="geo">{t("geoFilterTab")}</TabsTrigger>
                  <TabsTrigger value="tags">{t("tagFilterTab")}</TabsTrigger>
                </TabsList>
                <TabsContent value="main">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("tone")}
                      </small>
                      <div className="flex items-center gap-x-4">
                        <FormField
                          name="tone"
                          control={form.control}
                          render={() => (
                            <FormItem className="flex items-center gap-x-4 space-y-0">
                              {toneOption.map((item) => (
                                <FormField
                                  key={item.key}
                                  name="tone"
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.key}
                                        className="flex items-center gap-x-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.key
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.key,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value: string) =>
                                                        value !== item.key
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                          <p>{item.label}</p>
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("materialType")}
                      </small>
                      <div className="flex items-center gap-x-4">
                        <FormField
                          name="material_type"
                          control={form.control}
                          render={() => (
                            <FormItem className="flex items-center gap-x-4 space-y-0">
                              {materialType.map((item) => (
                                <FormField
                                  key={item.key}
                                  name="material_type"
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.key}
                                        className="flex items-center gap-x-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.key
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.key,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value: string) =>
                                                        value !== item.key
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                          <p>{item.label}</p>
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("materialLang")}
                      </small>
                      <div className="flex items-center gap-x-4">
                        <FormField
                          name="language"
                          control={form.control}
                          render={() => (
                            <FormItem className="flex items-center gap-x-4 space-y-0">
                              {lang.map((item) => (
                                <FormField
                                  key={item.key}
                                  name="language"
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.key}
                                        className="flex items-center gap-x-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.key
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.key,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value: string) =>
                                                        value !== item.key
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                          <p>{item.label}</p>
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("srcType")}
                      </small>
                      <div className="flex flex-wrap items-center gap-4">
                        <FormField
                          name="source_type"
                          control={form.control}
                          render={() => (
                            <FormItem className="flex items-center gap-x-4 space-y-0">
                              {collection.map((item) => (
                                <FormField
                                  key={item.key}
                                  name="source_type"
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.key}
                                        className="flex items-center gap-x-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.key
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.key,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value: string) =>
                                                        value !== item.key
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                          <p>{item.label}</p>
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="source">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <div className="flex items-center gap-x-4">
                        <ComboboxSource
                          name={t("source")}
                          excludedList={excludedList}
                          chooseList={chooseList}
                          onItemSelect={handleItemClick}
                          onItemRemove={handleRemoveClick}
                        />
                        {/* <FormField
                          name="sources"
                          control={form.control}
                          render={() => (
                            <FormItem className="flex items-center gap-x-4 space-y-0">
                              {sources.map((item) => (
                                <FormField
                                  key={item.key}
                                  name="sources"
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.key}
                                        className="flex items-center gap-x-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.key
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.key,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value: string) =>
                                                        value !== item.key
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                          <p>{item.label}</p>
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        /> */}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="authors">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("chartAuthorType")}
                      </small>
                      <div className="flex items-center gap-x-4">
                        <FormField
                          name="author_type"
                          control={form.control}
                          render={() => (
                            <FormItem className="flex items-center gap-x-4 space-y-0">
                              {authorType.map((item) => (
                                <FormField
                                  key={item.key}
                                  name="author_type"
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.key}
                                        className="flex items-center gap-x-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.key
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.key,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value: string) =>
                                                        value !== item.key
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                          <p>{item.label}</p>
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("chartAuthorAge")}
                      </small>
                      <div className="flex items-center gap-x-4">
                        <FormField
                          name="author_age"
                          control={form.control}
                          render={() => (
                            <FormItem className="flex items-center gap-x-4 space-y-0">
                              {authorAges.map((item, index) => (
                                <FormField
                                  key={index}
                                  name="author_age"
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={index}
                                        className="flex items-center gap-x-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={includesRange(
                                              field.value,
                                              item.key
                                            )}
                                            onCheckedChange={(checked) => {
                                              const currentValue =
                                                field.value || []
                                              if (checked) {
                                                field.onChange([
                                                  ...currentValue,
                                                  item.key,
                                                ]) // Use spread on guaranteed array
                                              } else {
                                                field.onChange(
                                                  currentValue.filter(
                                                    (range) =>
                                                      range[0] !==
                                                        item.key[0] ||
                                                      range[1] !== item.key[1]
                                                  )
                                                )
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                          <p>{item.label}</p>
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("chartAuthorType")}
                      </small>
                      <div className="flex items-center gap-x-4">
                        <FormField
                          name="author_gender"
                          control={form.control}
                          render={() => (
                            <FormItem className="flex items-center gap-x-4 space-y-0">
                              {authorGender.map((item) => (
                                <FormField
                                  key={item.key}
                                  name="author_gender"
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.key}
                                        className="flex items-center gap-x-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.key
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.key,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value: string) =>
                                                        value !== item.key
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                          <p>{item.label}</p>
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("auditory")}
                      </small>
                      <div className="flex items-center gap-x-4">
                        <Input
                          value={auditoryStart}
                          onChange={(event) => {
                            setAuditoryStart(event.target.value)
                          }}
                          placeholder={t("filterBlog.from")}
                          type="number"
                        />
                        <Input
                          value={auditoryEnd}
                          onChange={(event) => {
                            setAuditoryEnd(event.target.value)
                          }}
                          placeholder={t("filterBlog.to")}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="geo">geo</TabsContent>
                <TabsContent value="tags">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-4 rounded p-4">
                      <small className="text-sm font-medium leading-none text-black">
                        {t("tags")}
                      </small>
                      <div className="flex items-center gap-x-4">
                        <FormField
                          name="tags"
                          control={form.control}
                          render={() => (
                            <FormItem className="grid items-start gap-1.5">
                              <div className="flex flex-col gap-4">
                                {tagsData.map((item: any) => (
                                  <FormField
                                    key={item._id}
                                    name="tags"
                                    control={form.control}
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={item._id}
                                          className="flex items-center gap-x-2"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                item._id
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      item._id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== item._id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="!m-0 font-normal">
                                            {item.name}
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
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="outline"
                className="gap-x-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => {
                  form.reset({
                    tone: [],
                    material_type: [],
                    language: [],
                    source_type: [],
                    sources: [],
                    tags: [],
                    author_type: [],
                    author_age: [],
                    author_gender: [],
                    author_subscriber_count: [],
                  })
                  setAuditoryStart("")
                  setAuditoryEnd("")
                }}
              >
                <FilterX size={16} />
                {t("clearFilter")}
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="z-50 gap-x-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={form.handleSubmit(onSubmit)}
              >
                <Filter size={16} />
                {t("apply")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-none">
            {t("mainPage.materialCount")}:
          </p>
          <p className="text-sm font-medium leading-none text-blue-500">
            {filterCount.material_count}
          </p>
        </div>
        <div className="flex w-full flex-col gap-y-6">
          <div className="flex flex-col gap-y-3">
            <p className="text-sm font-medium leading-none text-blue-500">
              {t("tone")}
            </p>
            <FormField
              name="tone"
              control={form.control}
              render={() => (
                <FormItem className="flex flex-col gap-y-1">
                  {toneOption.map((item) => (
                    <FormField
                      key={item.key}
                      name="tone"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.key}
                            className="flex items-center gap-x-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.key)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.key])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== item.key
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="!m-0 !flex w-full items-center justify-between">
                              <p>{item.label}</p>
                              <p>
                                {filterCount && filterCount.sentiment[item.key]}
                              </p>
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-y-3">
            <p className="text-sm font-medium leading-none text-blue-500">
              {t("materialType")}
            </p>
            <FormField
              name="material_type"
              control={form.control}
              render={() => (
                <FormItem className="flex flex-col gap-y-1">
                  {materialType.map((item) => (
                    <FormField
                      key={item.key}
                      name="material_type"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.key}
                            className="flex items-center gap-x-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.key)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.key])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== item.key
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="!m-0 !flex w-full items-center justify-between">
                              <p>{item.label}</p>
                              <p>
                                {filterCount &&
                                  filterCount.material_type[item.key]}
                              </p>
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-y-3">
            <p className="text-sm font-medium leading-none text-blue-500">
              {t("materialLang")}
            </p>
            <FormField
              name="language"
              control={form.control}
              render={() => (
                <FormItem className="flex flex-col gap-y-1">
                  {lang.map((item) => (
                    <FormField
                      key={item.key}
                      name="language"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.key}
                            className="flex items-center gap-x-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.key)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.key])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== item.key
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="!m-0 !flex w-full items-center justify-between">
                              <p>{item.label}</p>
                              <p>
                                {filterCount && filterCount.language[item.key]}
                              </p>
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-y-3">
            <p className="text-sm font-medium leading-none text-blue-500">
              {t("srcType")}
            </p>
            <FormField
              name="source_type"
              control={form.control}
              render={() => (
                <FormItem className="flex flex-col gap-y-1">
                  {collection.map((item) => (
                    <FormField
                      key={item.key}
                      name="source_type"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.key}
                            className="flex items-center gap-x-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.key)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.key])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== item.key
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="!m-0 !flex w-full items-center justify-between">
                              <p>{item.label}</p>
                              <p>
                                {filterCount &&
                                  filterCount.source_type[item.key]}
                              </p>
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </FormItem>
              )}
            />
          </div>
          {tagsData?.length > 0 && (
            <div className="flex flex-col gap-y-3">
              <p className="text-sm font-medium leading-none text-blue-500">
                {t("tags")}
              </p>
              <FormField
                name="tags"
                control={form.control}
                render={() => (
                  <FormItem className="flex flex-col gap-y-1">
                    {tagsData.map((item: any) => (
                      <FormField
                        key={item.key}
                        name="tags"
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.key}
                              className="flex items-center gap-x-2"
                            >
                              <FormControl>
                                <Checkbox
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
                              <FormLabel className="!m-0 !flex w-full items-center justify-between">
                                <p>{item.name}</p>
                                <p>
                                  {filterCount && filterCount.tags[item._id]}
                                </p>
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-500">
          {t("apply")}
        </Button>
      </form>
    </Form>
  )
}

export { FilterSide }
