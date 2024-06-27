"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import About1 from "@/public/landing/about/1.svg"
import About2 from "@/public/landing/about/2.svg"
import About3 from "@/public/landing/about/3.svg"
import Icon1 from "@/public/landing/about/icon1.svg"
import Icon2 from "@/public/landing/about/icon2.svg"
import Icon3 from "@/public/landing/about/icon3.svg"
import Icon4 from "@/public/landing/about/icon4.svg"
import Background from "@/public/landing/aboutBack.svg"
import AOS from "aos"

import { Header } from "@/components/landing/header"
import { PageTitle } from "@/components/landing/pageTitle"

import "aos/dist/aos.css"

import { useRouter } from "@/navigation"
import { useTranslations } from "use-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/landing/footer"
import { SectionTitle } from "@/components/landing/sectionTitle"

export default function Page() {
  const router = useRouter()
  const t = useTranslations("landing.about")
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)

  const aboutList = [
    {
      title: t("quality.qualityCards.card1.title"),
      text: t("quality.qualityCards.card1.text"),
      icon: Icon1,
      dataAos: "fade-right",
    },
    {
      title: t("quality.qualityCards.card2.title"),
      text: t("quality.qualityCards.card2.text"),
      icon: Icon2,
      dataAos: "fade-left",
    },
    {
      title: t("quality.qualityCards.card3.title"),
      text: t("quality.qualityCards.card3.text"),
      icon: Icon3,
      dataAos: "fade-right",
    },
    {
      title: t("quality.qualityCards.card4.title"),
      text: t("quality.qualityCards.card4.text"),
      icon: Icon4,
      dataAos: "fade-left",
    },
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
      <section className="container mt-24 flex flex-col items-center gap-y-12 px-4 lg:px-0">
        <PageTitle title={t("title")} text={t("subtitle")} />
        <div className="flex lg:flex-row flex-col w-full items-center gap-x-9">
          <Image priority src={About1} alt="about-img" data-aos="fade-right" />
          <Image priority src={About2} alt="about-img" data-aos="fade-left" className="lg:block hidden" />
        </div>
        <div data-aos="fade-up" className="flex flex-col lg:flex-row items-start gap-y-2">
          <h4 className="w-full lg:w-1/2 text-3xl font-bold text-[#242331]">
            {t("whatWeDo.title")}
          </h4>
          <p className="w-full lg:w-1/2 text-xl text-[#797979]">{t("whatWeDo.text")}</p>
        </div>
      </section>
      <section className="container mt-24 lg:mt-36 flex flex-col lg:flex-row items-center justify-center gap-x-6 px-4 gap-y-4 lg:px-0">
        <div data-aos="fade-right" className="flex flex-col gap-y-6">
          <h4 className="text-3xl font-bold text-[#242331]">
            {t("mission.title")}
          </h4>
          <p className="text-xl text-[#797979]">{t("mission.text")}</p>
        </div>
        <Image data-aos="fade-left" src={About3} alt="about-img" priority />
      </section>
      <section className="container mt-24 lg:mt-36 flex flex-col items-center px-4 lg:px-0">
        <div className="flex flex-col items-center gap-y-8">
          <SectionTitle data-aos="fade-up" title={t("quality.subtitle")} />
          <h1 className="w-full lg:w-[75%] text-center text-3xl font-bold text-[#242331]">
            {t("quality.title")}
          </h1>
          <div className="flex flex-wrap gap-4 lg:gap-12">
            {aboutList.map((card, i) => (
              <div
                key={i}
                data-aos={card.dataAos}
                className="flex max-w-[674px] items-center gap-x-4 rounded-2xl bg-[#F9F9F9] p-4 lg:px-6 lg:py-8"
              >
                <Image src={card.icon} alt="about-icon" className="w-[25%] lg:w-fit" />
                <div className="flex flex-col gap-y-2">
                  <h4 className="text-xl lg:text-2xl font-semibold text-[#242331]">
                    {card.title}
                  </h4>
                  <p className="text-md lg:text-lg text-[#797979]">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Separator
        orientation="horizontal"
        className="container my-24 lg:my-36 w-full px-0"
      />
      <section className="container mb-24 lg:mb-36 flex flex-col lg:flex-row items-center lg:items-start justify-between px-4 lg:px-0 gap-y-4">
        <div data-aos="fade-right" className="flex flex-col items-center lg:items-start gap-y-6">
          <SectionTitle title={t("career.subtitle")} />
          <h1 className="max-w-full lg:max-w-[475px] text-4xl font-bold text-[#242331] text-center lg:text-left">
            {t("career.title")}
          </h1>
        </div>
        <div
          data-aos="fade-left"
          className="flex flex-col items-center gap-y-8 rounded-2xl bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] p-4 py-8 lg:p-28 text-center text-white"
        >
          <div className="flex flex-col gap-y-5">
            <h5 className="max-w-[570px] text-2xl font-medium">
              {t("career.banner.title")}
            </h5>
            <p className="max-w-[570px] text-xl">{t("career.banner.text")}</p>
          </div>
          <Button
            className="h-fit rounded-xl bg-white px-8 py-4 text-[#242331] hover:bg-white hover:text-[#21C55D]"
            onClick={() => {
              router.push("/landing/career")
            }}
          >
            {t("career.banner.button")}
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  )
}
