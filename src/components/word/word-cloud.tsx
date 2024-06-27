"use client"

import React, { useEffect, useRef } from "react"
import HighchartsReact from "highcharts-react-official"
import StackedBarChart from "highcharts-react-official"
import Highcharts from "highcharts/highstock"
import exporting from "highcharts/modules/exporting"
import { Download } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { RootState } from "@/lib/store/store"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

if (typeof Highcharts === "object") {
  exporting(Highcharts)
}

const WordCloud = () => {
  const t = useTranslations()

  const data = useSelector((state: RootState) => state.wordCloud.data)
  const pending = useSelector((state: RootState) => state.wordCloud.pending)

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  console.log(data)
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
      type: "bar",
    },
    title: {
      text: "",
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    legend: {
      reversed: true,
    },
    plotOptions: {
      series: {
        stacking: "normal",
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
      },
    },
    series: [
      {
        data: convertData(data) || [],
      },
    ],
  }
  return <></>
}

export default WordCloud
