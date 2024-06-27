"use client"

import AOS from "aos"
import gsap from "gsap"

import "aos/dist/aos.css"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "@/navigation"
import Background from "@/public/landing/background.svg"
import First from "@/public/landing/first.svg"
import LineBackground from "@/public/landing/lineBack.svg"
import Icon1 from "@/public/landing/unic/icons/1.svg"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import { Play } from "lucide-react"
import { useTranslations } from "use-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DemoForm } from "@/components/landing/demoForm"
import { Footer } from "@/components/landing/footer"
import { FunctionList } from "@/components/landing/functionList"
import { Header } from "@/components/landing/header"
import { HowItSteps } from "@/components/landing/howItSteps"
import { Partner } from "@/components/landing/partner"
import { Statistic } from "@/components/landing/statistic"
import { UnicSection } from "@/components/landing/unicSection"

export default function Home() {
  const router = useRouter()
  const t = useTranslations()
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)
  }, [])

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

  const scrollToForm = () => {
    gsap.to(window, {
      duration: 2.5,
      scrollTo: {
        y: "#demoForm",
        offsetY: +200,
      },
    })
  }

  const unicList = [
    {
      title: t("landing.main.unicCards.card1.title"),
      text: t("landing.main.unicCards.card1.text"),
      subtitle: t("landing.main.unicCards.card1.subtitle"),
      subtext: t("landing.main.unicCards.card1.subtext"),
      icon: Icon1,
      isLeft: true,
    },
    {
      title: t("landing.main.unicCards.card2.title"),
      text: t("landing.main.unicCards.card2.text"),
      subtitle: t("landing.main.unicCards.card2.subtitle"),
      subtext: t("landing.main.unicCards.card2.subtext"),
      icon: Icon1,
      isLeft: false,
    },
    {
      title: t("landing.main.unicCards.card3.title"),
      text: t("landing.main.unicCards.card3.text"),
      subtitle: t("landing.main.unicCards.card3.subtitle"),
      subtext: t("landing.main.unicCards.card3.subtext"),
      icon: Icon1,
      isLeft: true,
    },
  ]

  return (
    <main className="relative">
      <Image
        className="absolute right-0 top-0 -z-10 hidden w-[80%] lg:block"
        priority={true}
        src={Background}
        alt="back"
      />
      <Image
        className="absolute right-0 top-0 -z-20 w-[86%]"
        priority={true}
        src={LineBackground}
        alt="back"
      />
      <div className={cn(`sticky top-0 z-50`)}>
        <header className="">
          <Header isBlack={false} isSticky={isHeaderFixed} />
        </header>
      </div>
      <section className="container mt-24 flex items-center gap-x-6 px-4 lg:mt-16 lg:px-0">
        <div className="flex flex-col gap-y-12">
          <div className="flex flex-col gap-y-4">
            <h1 className="w-1/2 text-5xl font-bold text-[#242331] lg:text-7xl">
              {t("landing.main.title")}
            </h1>
            <p className="text-xl leading-9 text-[#242331] lg:text-2xl">
              {t("landing.main.subtitle")} <br />
              {t("landing.main.subtitle2")}
            </p>
          </div>
          <div className="flex flex-col-reverse items-center gap-3 lg:flex-row">
            <Button
              className="h-fit w-full rounded-2xl bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] px-8 py-4 lg:w-fit"
              onClick={scrollToForm}
            >
              <p className="text-bold text-lg text-white">
                {t("landing.main.try")}
              </p>
            </Button>
            <Button className="flex h-fit w-full items-center gap-x-2 rounded-2xl bg-green-50 px-8 py-2 hover:bg-green-50 lg:w-fit">
              <p className="text-bold text-lg text-[#242331] ">
                {t("landing.main.example")}
              </p>
              <span className="flex items-center justify-between rounded-full bg-green-500 p-4">
                <Play className="fill-white" size={14} />
              </span>
            </Button>
          </div>
        </div>
        <Image
          src={First}
          alt="platform"
          className="hidden max-w-[750px] rounded-2xl drop-shadow-lg lg:block"
        />
      </section>
      <Partner />
      <FunctionList />
      {unicList.map((item, index) => (
        <UnicSection
          key={index}
          title={item.title}
          text={item.text}
          subtitle={item.subtitle}
          subtext={item.subtext}
          icon={item.icon}
          isLeft={item.isLeft}
        />
      ))}
      <HowItSteps />
      <Statistic />
      <DemoForm />
      <Footer />
    </main>
  )
}
