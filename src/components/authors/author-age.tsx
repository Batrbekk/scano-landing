"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { usePathname } from "@/navigation"
import { getCookie } from "cookies-next"
import HighchartsReact from "highcharts-react-official"
import BarChart from "highcharts-react-official"
import Highcharts from "highcharts/highstock"
import exporting from "highcharts/modules/exporting"
import { Download } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { setAge } from "@/lib/store/materialFilterSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchDynamicAuthor } from "@/lib/store/thunks/analytic/author/dynamicAuthorThunk"
import { fetchTableAuthor } from "@/lib/store/thunks/analytic/author/tableAuthorThunk"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

if (typeof Highcharts === "object") {
  exporting(Highcharts)
}

interface socialChart {
  y: number
  name: string
}

const AuthorAge = () => {
  const t = useTranslations()
  const params = useParams()
  const dispatch = useAppDispatch()
  const path = usePathname()
  const token = getCookie("scano_acess_token")
  const [pending, setPending] = useState<boolean>(false)
  const [themeId, setThemeId] = useState<string>("")
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  const [ages, setAges] = useState<ReadonlyArray<socialChart>>([])
  const [agesName, setAgesName] = useState<ReadonlyArray<string>>([])
  const [agesData, setAgesData] = useState<ReadonlyArray<number>>([])
  const allAges = useSelector(
    (state: RootState) => state.materialFilter.author_filter.age
  )

  const convertData = (data: any[]) => {
    return data.map((series) => ({
      ...series,
      name: t(series.name),
    }))
  }

  const options = {
    chart: {
      type: "bar",
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: agesName,
      title: {
        text: null,
      },
      gridLineWidth: 1,
      lineWidth: 0,
    },
    yAxis: {
      title: "",
    },
    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: (e: any) => {
              dispatch(setAge([...allAges, e.point.category]))
              fetchPage()
            },
          },
        },
      },
    },
    series: [
      {
        data: agesData,
        colorByPoint: true, // Each bar will have a different color
      },
    ],
    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"], // Set custom colors for each category
    legend: {
      enabled: false, // Disable legend
    },
  }

  const fetchPage = () => {
    dispatch(fetchDynamicAuthor(themeId))
    dispatch(fetchTableAuthor(themeId, 1))
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

  const getChart = async (id: string) => {
    try {
      setPending(true)
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${id}/analytics/authors_age`,
        {
          method: "GET", // Assuming you are sending a POST request
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setAges(data)
        setPending(false)
      } else {
        setPending(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    getChart(path.split("/")[1])
  }, [path])

  useEffect(() => {
    if (ages.length > 0) {
      setAgesName(ages.map((item) => t(item.name)))
      setAgesData(ages.map((item) => item.y))
    }
  }, [ages])

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
          {t("chartAuthorAge")}
        </h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18} />
        </Button>
      </div>
      {ages.length > 0 ? (
        <BarChart
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

export { AuthorAge }
