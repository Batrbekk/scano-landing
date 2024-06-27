"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import * as Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import exporting from "highcharts/modules/exporting"
import { Download, ListX } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"
import { undefined } from "zod"

import { setChartPeriod } from "@/lib/store/analytic/chartPeriodSlice"
import { ISeries } from "@/lib/store/mainChartSlice"
import { setSentiment } from "@/lib/store/materialFilterSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchLanguageReview } from "@/lib/store/thunks/analytic/review/languageReviewThunk"
import { fetchToneReview } from "@/lib/store/thunks/analytic/review/toneReviewThunk"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
import { fetchMainChart } from "@/lib/store/thunks/mainChartThunk"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ReviewLanguage } from "@/components/review/review-language"
import { ReviewTone } from "@/components/review/review-tone"

if (typeof Highcharts === "object") {
  exporting(Highcharts)
}

const Review = (props: HighchartsReact.Props) => {
  const t = useTranslations()
  const params = useParams()
  const data = useSelector((state: RootState) => state.mainChart.data)
  const pending = useSelector((state: RootState) => state.mainChart.pending)
  const sentiments = useSelector(
    (state: RootState) => state.materialFilter.material_filter.sentiment
  )
  const chartPeriodValue = useSelector(
    (state: RootState) => state.chartPeriod.period
  )
  const dispatch = useAppDispatch()
  const [themeId, setThemeId] = useState<string>("")

  const startDate = useSelector(
    (state: RootState) => state.timeFilter.startDate
  )
  const endDate = useSelector((state: RootState) => state.timeFilter.endDate)
  const rangeDate = useSelector(
    (state: RootState) => state.timeFilter.rangeData
  )

  const isDataEmpty = data.every((series: any) => series.data.length === 0)

  const parseDateToUTC = (dateStr: string | null, defaultDate?: Date) => {
    if (!dateStr) {
      const effectiveDate = defaultDate || new Date()
      return Date.UTC(
        effectiveDate.getFullYear(),
        effectiveDate.getMonth(),
        effectiveDate.getDate()
      )
    }
    const date = new Date(dateStr)
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  }

  const today = new Date()
  const effectiveStartDate = startDate ? new Date(startDate) : today
  const effectiveEndDate = endDate ? new Date(endDate) : new Date()
  const utcStartDate = parseDateToUTC(startDate, effectiveStartDate)
  const utcEndDate = parseDateToUTC(endDate)

  const convertDataToMilliseconds = (data: ISeries[]) => {
    return data.map((series) => ({
      ...series,
      data: series.data.map((point) => [point[0] * 1000, point[1]]),
      name: t(series.name),
    }))
  }

  const calculatePointInterval = (period: string) => {
    switch (period) {
      case "month":
        return 30 * 24 * 3600 * 1000 // Примерно количество миллисекунд в месяце
      case "week":
        return 7 * 24 * 3600 * 1000 // Количество миллисекунд в неделе
      case "day":
        return 24 * 3600 * 1000 // Количество миллисекунд в дне
      case "hour":
        return 3600 * 1000 // Количество миллисекунд в часе
      case "half_an_hour":
        return 30 * 60 * 1000 // Количество миллисекунд в полчаса
      case "quarter_an_hour":
        return 15 * 60 * 1000 // Количество миллисекунд в четверть часа
      default:
        return 30 * 24 * 3600 * 1000 // По умолчанию месяц
    }
  }

  const calculateMaxDate = (
    period: string,
    startDate: Date,
    endDate?: Date
  ) => {
    const effectiveEndDate = endDate || new Date() // Устанавливаем текущую дату, если endDate не предоставлен

    switch (period) {
      case "month":
        return Date.UTC(
          effectiveEndDate.getFullYear(),
          effectiveEndDate.getMonth(),
          effectiveEndDate.getDate()
        )
      case "week":
      case "day":
      case "hour":
        undefined
    }
  }

  const chartPeriod = () => {
    if (rangeDate > 7 && rangeDate < 30) {
      return [
        {
          value: "week",
          label: t("inWeek"),
        },
        {
          value: "day",
          label: t("inDay"),
        },
      ]
    } else if (rangeDate <= 7 && rangeDate > 1) {
      return [
        {
          value: "week",
          label: t("inWeek"),
        },
        {
          value: "day",
          label: t("inDay"),
        },
      ]
    } else if (rangeDate >= 30) {
      return [
        {
          value: "month",
          label: t("inMonth"),
        },
        {
          value: "week",
          label: t("inWeek"),
        },
      ]
    } else if (rangeDate <= 7 && rangeDate <= 1) {
      return [
        {
          value: "hour",
          label: t("inHour"),
        },
        {
          value: "half_an_hour",
          label: t("half_an_hour"),
        },
        {
          value: "quarter_an_hour",
          label: t("quarter_an_hour"),
        },
      ]
    }
  }

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const sentimentKeys = {
    [t("neutral")]: "neutral",
    [t("positive")]: "positive",
    [t("negative")]: "negative",
    default: null,
  }

  const options: Highcharts.Options = {
    title: {
      text: "",
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    yAxis: {
      min: 0,
    },
    xAxis: {
      type: "datetime",
      min: utcStartDate,
      max: calculateMaxDate(
        chartPeriodValue,
        effectiveStartDate,
        effectiveEndDate
      ),
    },
    plotOptions: {
      series: {
        label: { connectorAllowed: false },
        pointStart: utcStartDate,
        pointInterval: calculatePointInterval(chartPeriodValue),
        connectNulls: true,
        point: {
          events: {
            click: (e) => {
              dispatch(
                setSentiment(
                  [...sentiments, sentimentKeys[e.point.series.name]].filter(
                    Boolean
                  )
                )
              )
              fetchPage()
            },
          },
        },
      },
    },
    series: convertDataToMilliseconds(data).map((series) => ({
      ...series,
      pointStart: utcStartDate,
    })),
  }

  const downloadChart = () => {
    const chart = chartComponentRef.current?.chart

    if (chart) {
      chart.exportChart(
        {
          type: "image/png",
          filename: "chart",
        },
        {
          chart: {
            backgroundColor: "#ffffff",
          },
        }
      )
    }
  }

  const handleChange = (
    newValue:
      | "month"
      | "week"
      | "day"
      | "hour"
      | "half_an_hour"
      | "quarter_an_hour"
  ) => {
    dispatch(setChartPeriod(newValue))
    dispatch(fetchMainChart(themeId))
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        plotOptions: {
          series: {
            pointInterval: calculatePointInterval(newValue), // Обновление интервала точек
          },
        },
      })
    }
  }

  const fetchPage = () => {
    if (themeId) {
      dispatch(fetchMainChart(themeId))
      dispatch(fetchToneReview(themeId))
      dispatch(fetchLanguageReview(themeId))
      dispatch(fetchFilterCountThunk(themeId))
    }
  }

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    fetchPage()
  }, [dispatch, startDate, endDate, themeId])

  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        exporting: {
          enabled: true,
        },
      })
    }
  }, [chartComponentRef])

  return (
    <div className="mb-20 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-8 rounded border bg-white p-4">
        <div className="flex items-stretch justify-end gap-x-4 ">
          <Select value={chartPeriodValue} onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {chartPeriod()?.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={downloadChart}>
            <Download size={18} />
          </Button>
        </div>
        {!isDataEmpty ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartComponentRef}
            {...props}
          />
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center">
            {pending ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-y-2">
                <ListX size={32} />
                <p>{t("noData")}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-x-4">
        <ReviewTone />
        <ReviewLanguage />
      </div>
    </div>
  )
}

export { Review }
