"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "@/navigation"
import worldMap from "@highcharts/map-collection/custom/world.geo.json"
import { getCookie } from "cookies-next"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts/highmaps"
import exporting from "highcharts/modules/exporting"
import { Download } from "lucide-react"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface socialChart {
  y: number
  name: string
}

if (typeof Highcharts === "object") {
  exporting(Highcharts)
}

const GeoMap = () => {
  const t = useTranslations()
  const path = usePathname()
  const token = getCookie("scano_acess_token")
  const [pending, setPending] = useState<boolean>(false)
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  const [countries, setCountries] = useState<ReadonlyArray<socialChart>>([])
  const [massiveCountries, setMassiveCountries] = useState<
    Array<[string, number]>
  >([])

  const mapOptions = {
    title: {
      text: "",
    },
    chart: {
      map: worldMap,
      height: 500,
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    colorAxis: {
      min: 0,
      max: 600,
      stops: [
        [0, "#d5e1f7"],
        [0.67, "#7a97cd"],
        [6, "#4b72b8"],
      ],
    },
    tooltip: {},
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "top",
      },
    },
    series: [
      {
        name: "Random data",
        states: {
          hover: {
            color: "#BADA55",
          },
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
        data: massiveCountries,
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

  const getChart = async (id: string) => {
    try {
      setPending(true)
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${id}/analytics/countries`,
        {
          method: "GET",
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
  }, [])

  useEffect(() => {
    if (countries.length > 0) {
      setMassiveCountries(
        countries.map((item) => [item.name.toLowerCase(), item.y])
      )
    }
  }, [countries])

  return (
    <div className="flex w-full flex-col gap-y-4 rounded border bg-white p-4">
      <div className="flex items-center justify-between gap-x-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {t("geography")}
        </h4>
        <Button variant="outline" size="sm" onClick={downloadChart}>
          <Download size={18} />
        </Button>
      </div>
      {countries.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"mapChart"}
          options={mapOptions}
          ref={chartComponentRef}
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

export { GeoMap }
