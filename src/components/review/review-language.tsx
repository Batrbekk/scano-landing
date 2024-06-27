"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import HighchartsReact from "highcharts-react-official"
import PieChart from "highcharts-react-official"
import Highcharts from "highcharts/highstock"
import exporting from "highcharts/modules/exporting"
import { Download } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { setLanguage } from "@/lib/store/materialFilterSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchLanguageReview } from "@/lib/store/thunks/analytic/review/languageReviewThunk"
import { fetchToneReview } from "@/lib/store/thunks/analytic/review/toneReviewThunk"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
import { fetchMainChart } from "@/lib/store/thunks/mainChartThunk"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

if (typeof Highcharts === "object") {
  exporting(Highcharts)
}

const ReviewLanguage = () => {
  const t = useTranslations()
  const params = useParams()
  const dispatch = useAppDispatch()

  const data = useSelector((state: RootState) => state.reviewLanguage.data)
  const pending = useSelector(
    (state: RootState) => state.reviewLanguage.pending
  )
  const languages = useSelector(
    (state: RootState) => state.materialFilter.material_filter.language
  )
  const [themeId, setThemeId] = useState<string>("")

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

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
              if (e.point.name === t("unknown")) {
                return
              }
              dispatch(
                setLanguage(
                  [...languages, languageKeys[e.point.name]].filter(Boolean)
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
        data: convertData(data) || [],
      },
    ],
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

  const languageKeys = {
    [t("ru")]: "ru",
    [t("kk")]: "kk",
    [t("en")]: "en",
    default: null,
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
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        exporting: {
          enabled: true,
        },
      })
    }
  }, [chartComponentRef])

  return (
    <div className="flex w-full flex-col gap-y-4 rounded border bg-white p-4">
      <div className="flex items-stretch justify-between gap-x-4 ">
        <h4 className="text-md scroll-m-20 font-medium tracking-tight md:text-xl md:font-semibold">
          {t("languages")}
        </h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18} />
        </Button>
      </div>
      {data.length >= 1 ? (
        <PieChart
          highcharts={Highcharts}
          ref={chartComponentRef}
          options={options}
        />
      ) : (
        <div className="flex h-[300px] w-full items-center justify-center">
          {pending ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <div>
              <p>{t("noData")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { ReviewLanguage }
