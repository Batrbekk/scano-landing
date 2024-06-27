import React, { useEffect } from "react"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import { useTranslations } from "use-intl"

import { Button } from "@/components/ui/button"

export interface PriceItemProps {
  isPopular: boolean
  title: string
  price: string
  pricePeriod?: string
  priceByYear?: string
  advantagesList: string[]
}

const PriceItem: React.FC<PriceItemProps> = ({
  isPopular,
  title,
  price,
  pricePeriod,
  priceByYear,
  advantagesList,
}) => {
  const t = useTranslations("landing.pricePage.priceCard")

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)
  }, [])

  const scrollToForm = () => {
    gsap.to(window, {
      duration: 2.5,
      scrollTo: {
        y: "#demoForm",
        offsetY: +250,
      },
    })
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col rounded-2xl bg-[#F9F9F9] px-4 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between gap-x-2">
        <h4 className="text-4xl font-bold text-[#242331]">{title}</h4>
        {isPopular && (
          <p className="rounded-2xl border border-green-500 bg-[#EFFDF4] px-6 py-2 text-lg font-bold text-green-500">
            {t("card2.popular")}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center border-b border-t py-6">
        <h4 className="text-center text-4xl font-bold text-[#242331]">
          {price}{" "}
          {pricePeriod && <span className="text-xl">{pricePeriod}</span>}
        </h4>
        {priceByYear && (
          <div className="mt-4 rounded-full bg-[#FFEECC] px-6 py-1.5 text-xl font-medium text-[#C68A15]">
            {priceByYear}
          </div>
        )}
      </div>
      <div className="mb-8 mt-6 flex flex-col items-center gap-y-4">
        {advantagesList.map((advantage, i) => (
          <p
            key={i}
            className="cursor-pointer text-center text-lg text-[#797979] hover:font-bold hover:text-green-500"
          >
            {advantage}
          </p>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-center">
        <Button
          className="w-fit rounded-2xl border border-[#D3D3D3] bg-transparent px-8 py-8 text-lg font-bold text-[#242331] hover:border-[#0FAF62] hover:bg-[#0FAF62] hover:text-white"
          onClick={scrollToForm}
        >
          {t("start")}
        </Button>
      </div>
    </div>
  )
}

export { PriceItem }
