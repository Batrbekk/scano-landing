"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "@/navigation"
import { getCookie } from "cookies-next"
import HighchartsReact from "highcharts-react-official"
import PieChart from "highcharts-react-official"
import Highcharts from "highcharts/highstock"
import exporting from "highcharts/modules/exporting"
import { Download } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
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

interface socialChart {
  y: number
  name: string
}

const TagTone = () => {
  const t = useTranslations()

  const data = useSelector((state: RootState) => state.toneTag.data)
  const pending = useSelector((state: RootState) => state.toneTag.pending)
  const tags = useSelector((state: RootState) => state.toneTag.tags)

  const [currentTag, setCurrentTag] = useState("")

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const safeData = data
    .find((option: any) => option.name === currentTag)
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
      },
    },
    series: [
      {
        data: convertData(safeData) || [],
      },
    ],
  }

  useEffect(() => {
    if (tags.length > 0 && !currentTag) {
      setCurrentTag(tags[0].name)
    }
  }, [tags])

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
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {t("chartTagTone")}
        </h4>
        <div className="flex items-center gap-x-4">
          <Select
            value={currentTag}
            onValueChange={(value) => setCurrentTag(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tags.map((item: any) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
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
      {data.length > 1 ? (
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

export { TagTone }
