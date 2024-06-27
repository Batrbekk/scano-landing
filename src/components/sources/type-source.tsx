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

import { setSourceType } from "@/lib/store/materialFilterSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchDynamicSource } from "@/lib/store/thunks/analytic/source/dynamicSourceThunk"
import { fetchMessageSource } from "@/lib/store/thunks/analytic/source/messageSourceThunk"
import { fetchMessageTypeSource } from "@/lib/store/thunks/analytic/source/messageTypeSourceThunk"
import { fetchTableSource } from "@/lib/store/thunks/analytic/source/tableSourceThunk"
import { fetchToneSource } from "@/lib/store/thunks/analytic/source/toneSourceThunk"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

if (typeof Highcharts === "object") {
  exporting(Highcharts)
}

const TypeSource = () => {
  const t = useTranslations()
  const params = useParams()
  const dispatch = useAppDispatch()
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  const data = useSelector((state: RootState) => state.messageTypeSource.data)
  const pending = useSelector(
    (state: RootState) => state.messageTypeSource.pending
  )
  const sourceTypes = useSelector(
    (state: RootState) => state.materialFilter.material_filter.source_type
  )
  const [themeId, setThemeId] = useState<string>("")

  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        exporting: {
          enabled: true,
        },
      })
    }
  }, [])

  const convertData = (data: any[]) => {
    return data.map((series) => ({
      ...series,
      name: t(series.name),
    }))
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
                setSourceType(
                  [...sourceTypes, typeKeys[e.point.name]].filter(Boolean)
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
        data: convertData(data),
      },
    ],
  }

  const typeKeys = {
    [t("news")]: "news",
    [t("social")]: "social",
    default: null,
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

  return (
    <div className="flex h-full w-full flex-col gap-y-4 rounded border bg-white p-4">
      <div className="flex items-center justify-between gap-x-4 ">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {t("chartSourceType")}
        </h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18} />
        </Button>
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

export { TypeSource }
