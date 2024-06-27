"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import LineChart from "highcharts-react-official"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts/highstock"
import exporting from "highcharts/modules/exporting"
import { Download, ListX } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"
import { undefined } from "zod"

import { setChartPeriod } from "@/lib/store/analytic/chartPeriodSlice"
import { Source } from "@/lib/store/analytic/source/dynamicSourceSlice"
import { setSources } from "@/lib/store/materialFilterSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchDynamicSource } from "@/lib/store/thunks/analytic/source/dynamicSourceThunk"
import { fetchMessageSource } from "@/lib/store/thunks/analytic/source/messageSourceThunk"
import { fetchMessageTypeSource } from "@/lib/store/thunks/analytic/source/messageTypeSourceThunk"
import { fetchTableSource } from "@/lib/store/thunks/analytic/source/tableSourceThunk"
import { fetchToneSource } from "@/lib/store/thunks/analytic/source/toneSourceThunk"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
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

if (typeof Highcharts === "object") {
  exporting(Highcharts)
}

const DynamicSource = () => {
  const t = useTranslations()
  const params = useParams()
  const dispatch = useAppDispatch()
  const data = useSelector((state: RootState) => state.dynamicSource.data)
  const pending = useSelector((state: RootState) => state.dynamicSource.pending)
  const chartPeriodValue = useSelector(
    (state: RootState) => state.chartPeriod.period
  )
  const sources = useSelector(
    (state: RootState) => state.materialFilter.material_filter.sources
  )
  const [themeId, setThemeId] = useState<string>("")
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

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

  const convertDataToMilliseconds = (data: Source[]) => {
    return data.map((series) => ({
      ...series,
      data: series.data.map((point) => [point[0] * 1000, point[1]]),
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

  const options = {
    title: {
      text: "",
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
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
        label: {
          connectorAllowed: false,
        },
        pointStart: utcStartDate,
        pointInterval: calculatePointInterval(chartPeriodValue),
        connectNulls: true,
        point: {
          events: {
            click: (e: any) => {
              dispatch(setSources([...sources, e.point.series.name]))
              fetchPage()
            },
          },
        },
      },
    },
    series: convertDataToMilliseconds(data) || [],
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
    dispatch(fetchDynamicSource(themeId))
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
    dispatch(fetchMessageSource(themeId))
    dispatch(fetchDynamicSource(themeId))
    dispatch(fetchMessageTypeSource(themeId))
    dispatch(fetchToneSource(themeId))
    dispatch(fetchFilterCountThunk(themeId))
    dispatch(fetchTableSource(themeId, 1))
  }

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        exporting: {
          enabled: true,
        },
      })
    }
  }, [])

  return (
    <div className="flex h-full w-full flex-col gap-y-4 rounded border bg-white p-4">
      <div className="flex items-center justify-between gap-x-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {t("chartSourceDynamic")}
        </h4>
        <div className="flex items-center gap-x-4">
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
      </div>
      {!isDataEmpty ? (
        <LineChart
          highcharts={Highcharts}
          ref={chartComponentRef}
          options={options}
        />
      ) : (
        <div
          className={`flex w-full items-center justify-center ${pending ? "h-[300px]" : "h-full"}`}
        >
          {pending ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <div className="my-10 flex flex-col items-center justify-center gap-y-2">
              <ListX size={32} />
              <p>{t("noData")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { DynamicSource }
