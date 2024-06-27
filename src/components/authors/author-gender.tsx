"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
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
import { setGender } from "@/lib/store/materialFilterSlice"
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

const AuthorGender = () => {
  const t = useTranslations()
  const params = useParams()
  const dispatch = useAppDispatch()
  const path = usePathname()
  const [themeId, setThemeId] = useState<string>("")
  const token = getCookie("scano_acess_token")
  const [pending, setPending] = useState<boolean>(false)
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  const [countries, setCountries] = useState<socialChart[]>([])
  const genders = useSelector(
    (state: RootState) => state.materialFilter.author_filter.gender
  )

  const convertData = (data: any[]) => {
    return data.map((series) => ({
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
              if (
                e.point.name === t("unknown") ||
                e.point.name === t("Другое")
              ) {
                return
              }
              dispatch(setGender([...genders, e.point.name]))
              fetchPage()
            },
          },
        },
      },
    },
    series: [
      {
        data: convertData(countries),
      },
    ],
  }

  const fetchPage = () => {
    dispatch(fetchDynamicAuthor(themeId))
    dispatch(fetchTableAuthor(themeId, 1))
  }

  const getChart = async (id: string) => {
    try {
      setPending(true)
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${id}/analytics/authors_gender`,
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
        setCountries(data)
        setPending(false)
      } else {
        setPending(false)
      }
    } catch (e) {
      console.error(e)
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

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  useEffect(() => {
    getChart(path.split("/")[1])
  }, [path])

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
          {t("chartAuthorGender")}
        </h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18} />
        </Button>
      </div>
      {countries.length > 0 ? (
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

export { AuthorGender }
