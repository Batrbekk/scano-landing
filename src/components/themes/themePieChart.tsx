"use client"

import React, { useEffect, useRef } from "react"
import PieChart from "highcharts-react-official"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts/highstock"
import exporting from "highcharts/modules/exporting"
import { Download } from "lucide-react"
import { useTranslations } from "use-intl"

import { Button } from "@/components/ui/button"

if (typeof Highcharts === "object") {
  exporting(Highcharts)
}

interface Props {
  data: [{ name: string; y: number; color: string }]
}

const ThemePieChart: React.FC<Props> = ({ data }) => {
  const t = useTranslations()
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.update({
        exporting: {
          enabled: true,
        },
      })
    }
  }, [])

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
      },
    },
    series: [
      {
        data: data,
      },
    ],
  }

  return (
    <PieChart
      highcharts={Highcharts}
      ref={chartComponentRef}
      options={options}
    />
  )
}

export { ThemePieChart }
