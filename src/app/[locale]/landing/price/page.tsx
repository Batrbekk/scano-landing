"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "@/navigation"
import Background from "@/public/landing/aboutBack.svg"
import AOS from "aos"

import { Separator } from "@/components/ui/separator"
import { DemoForm } from "@/components/landing/demoForm"
import { Faq } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { PageTitle } from "@/components/landing/pageTitle"
import { PriceItem } from "@/components/landing/priceItem"
import { SectionTitle } from "@/components/landing/sectionTitle"

import "aos/dist/aos.css"

import { useTranslations } from "use-intl"

import { cn } from "@/lib/utils"

export default function Page() {
  const router = useRouter()
  const t = useTranslations("landing.pricePage")
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)

  const basicAdvantageList = [
    t("plans.card1.themes"),
    t("plans.card1.materials"),
    t("plans.card1.source"),
    t("plans.card1.telegram"),
    t("plans.card1.users"),
    t("plans.card1.visor"),
    t("plans.card1.rules"),
    t("plans.card1.tone"),
  ]

  const unlimitAdvantageList = [
    t("plans.card2.themes"),
    t("plans.card2.archive"),
    t("plans.card2.channels"),
    t("plans.card2.tag"),
    t("plans.card2.source"),
    t("plans.card2.telegram"),
    t("plans.card2.visor"),
    t("plans.card2.users"),
    t("plans.card2.rules"),
    t("plans.card2.tone"),
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHeaderFixed(true)
      } else {
        setIsHeaderFixed(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, [])

  return (
    <main className="relative">
      <Image
        className="absolute right-0 top-0 -z-10"
        priority={true}
        src={Background}
        alt="back"
      />
      <div className={cn(`sticky top-0 z-50`)}>
        <Header isBlack={true} isSticky={isHeaderFixed} />
      </div>
      <section className="container my-14 lg:mb-36 lg:mt-24 flex flex-col items-center gap-y-12 px-4 lg:px-0">
        <PageTitle title={t("title")} text={t("description")} />
      </section>
      <section
        data-aos="fade-up"
        className="container mb-14 lg:mb-24 flex flex-col lg:flex-row justify-between gap-y-8 px-4 lg:px-0"
      >
        <div className="flex max-w-full lg:max-w-[445px] items-center lg:items-start flex-col gap-y-6">
          <SectionTitle data-aos="fade-up" title={t("section.subtitle")} />
          <h2 className="text-4xl text-center lg:text-left font-bold text-[#242331]">
            {t("section.title")}
          </h2>
          <p className="text-xl text-center lg:text-left text-[#797979]">{t("section.description")}</p>
        </div>
        <div className="flex flex-col lg:flex-row items-stretch gap-y-4 gap-x-5">
          <PriceItem
            isPopular={false}
            title={t("priceCard.card1.title")}
            price="99 990 ₸"
            priceByYear={`1 199 880 ₸ ${t("priceCard.card1.priceYear")}`}
            pricePeriod={t("priceCard.card1.priceMonth")}
            advantagesList={basicAdvantageList}
          />
          <PriceItem
            isPopular={true}
            title={t("priceCard.card2.title")}
            price={t("priceCard.card2.price")}
            advantagesList={unlimitAdvantageList}
          />
        </div>
      </section>
      <Separator className="container my-12 lg:my-24" />
      <DemoForm />
      <Faq />
      <Footer />
    </main>
  )
}
