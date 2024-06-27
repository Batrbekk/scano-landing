"use client"

import React, { useEffect } from "react"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import { useTranslations } from "use-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export interface Props {
  title: string
  description: string
  state: number
  isLeft: boolean
}

const PeculiarItem: React.FC<Props> = ({
  title,
  state,
  description,
  isLeft,
}) => {
  const t = useTranslations("landing.peculiarities")

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
    <div
      className={cn(
        `flex w-full lg:w-1/2 flex-col gap-y-8`,
        isLeft ? "items-start" : "items-end"
      )}
    >
      <div className="flex max-w-[540px] flex-col gap-y-3">
        <h5 className="text-xl font-semibold text-[#0FAF62]">{t("title")}</h5>
        <h2 className="text-4xl font-bold text-[#242331]">{title}</h2>
        <p className="text-base font-medium text-[#90A3BF]">{description}</p>
      </div>
      <div className="flex w-full max-w-[600px] flex-col rounded-xl bg-[#EFFDF4] p-8">
        <div className="flex items-center gap-x-4">
          <div
            className={cn(
              `flex h-12 w-12 items-center justify-center rounded-full text-2xl font-semibold text-white`,
              state >= 1 && "bg-[#0FAF62]"
            )}
          >
            1
          </div>
          <p className="text-xl font-medium text-[#242331]">
            {t("section.sectionCards.card1.title")}
          </p>
        </div>
        <Separator
          orientation="vertical"
          className={cn(
            `ml-[24px] h-10 w-[2px]`,
            state > 1 ? "bg-[#0FAF62]" : "bg-[#E7DEFE]"
          )}
        />
        <div className="flex items-center gap-x-4">
          <div
            className={cn(
              `flex h-12 w-12 items-center justify-center rounded-full text-2xl font-semibold`,
              state >= 2 ? "bg-[#0FAF62] text-white" : "bg-white text-[#1A202C]"
            )}
          >
            2
          </div>
          <p className="text-xl font-medium text-[#242331]">
            {t("section.sectionCards.card2.title")}
          </p>
        </div>
        <Separator
          orientation="vertical"
          className={cn(
            `ml-[24px] h-10 w-[2px]`,
            state > 2 ? "bg-[#0FAF62]" : "bg-[#E7DEFE]"
          )}
        />
        <div className="flex items-center gap-x-4">
          <div
            className={cn(
              `flex h-12 w-12 items-center justify-center rounded-full text-2xl font-semibold`,
              state >= 3 ? "bg-[#0FAF62] text-white" : "bg-white text-[#1A202C]"
            )}
          >
            3
          </div>
          <p className="text-xl font-medium text-[#242331]">
            {t("section.sectionCards.card3.title")}
          </p>
        </div>
        <Button
          className={cn(
            `mt-10 h-fit w-fit rounded-xl bg-white px-8 py-4 text-[#242331] hover:bg-[#0FAF62] hover:text-white`
          )}
          onClick={scrollToForm}
        >
          <p className="text-base">{t("askDemo")}</p>
        </Button>
      </div>
    </div>
  )
}

export { PeculiarItem }
