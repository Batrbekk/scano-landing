"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import PieChart from "highcharts-react-official"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts/highstock"
import exporting from "highcharts/modules/exporting"
import { Download, ListX } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { setSentiment } from "@/lib/store/materialFilterSlice"
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

const ToneSource = () => {
  const t = useTranslations()
  const params = useParams()
  const data = useSelector((state: RootState) => state.toneSource.data)
  const pending = useSelector((state: RootState) => state.toneSource.pending)
  const sources = useSelector((state: RootState) => state.toneSource.sources)
  const sentiments = useSelector(
    (state: RootState) => state.materialFilter.material_filter.sentiment
  )
  const dispatch = useAppDispatch()
  const [themeId, setThemeId] = useState<string>("")

  const [currentSource, setCurrentSource] = useState("")

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const safeData = data
    .find((option: any) => option.source === currentSource)
    ?.sentiment.map((item: any) => ({
      ...item,
    }))

  const convertData = (
    data: { color: string; name: string; y: number }[] | undefined
  ) => {
    return data?.map((series) => ({
      ...series,
      name: t(series.name),
    }))
  }

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "",
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        innerSize: 150,
      },
      series: {
        cursor: "pointer",
        showInLegend: true,
        dataLabels: [
          {
            enabled: false,
            distance: 20,
          },
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.1f}%",
            style: {
              color: "#fff",
              fontSize: "16px",
              textOutline: "none",
              opacity: 1,
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        ],
        point: {
          events: {
            click: (e: any) => {
              dispatch(
                setSentiment(
                  [...sentiments, sentimentKeys[e.point.name]].filter(Boolean)
                )
              )
              fetchPage()
            },
          },
        },
      },
    },
    series: [
      {
        data: convertData(safeData) || [],
      },
    ],
  }

  const fetchPage = () => {
    dispatch(fetchMessageSource(themeId))
    dispatch(fetchDynamicSource(themeId))
    dispatch(fetchMessageTypeSource(themeId))
    dispatch(fetchToneSource(themeId))
    dispatch(fetchFilterCountThunk(themeId))
    dispatch(fetchTableSource(themeId, 1))
  }

  const sentimentKeys = {
    [t("neutral")]: "neutral",
    [t("positive")]: "positive",
    [t("negative")]: "negative",
    default: null,
  }

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    if (sources.length > 0) {
      setCurrentSource(sources[0].name)
    }
  }, [sources])

  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        exporting: {
          enabled: true,
        },
      })
    }
  }, [chartComponentRef])

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

  return (
    <div className="flex w-full flex-col gap-y-4 rounded border bg-white p-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center ">
        <h4 className="scroll-m-20 text-base font-semibold tracking-tight md:text-xl">
          {t("chartSourceTone")}
        </h4>
        <div className="flex w-full items-center justify-between gap-x-4 md:w-fit">
          {data.length > 0 && (
            <Select
              value={currentSource}
              onValueChange={(value) => setCurrentSource(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sources.map((item: any) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={downloadChart}>
            <Download size={18} />
          </Button>
        </div>
      </div>
      {data.length > 0 ? (
        <PieChart
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

export { ToneSource }
