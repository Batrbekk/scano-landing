"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Background from "@/public/landing/aboutBack.svg"
import career1 from "@/public/landing/career/1.svg"
import career2 from "@/public/landing/career/2.svg"
import noVac from "@/public/landing/career/icon/noVac.svg"
import AOS from "aos"

import { Button } from "@/components/ui/button"
import { CareerList } from "@/components/landing/careerList"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { PageTitle } from "@/components/landing/pageTitle"
import { SectionTitle } from "@/components/landing/sectionTitle"

import "aos/dist/aos.css"

import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { VacCard, VacCardProps } from "@/components/landing/vacCard"

export default function Page() {
  const { toast } = useToast()
  const t = useTranslations("landing.careerPage")
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)
  const [vacancies, setVacancies] = useState<ReadonlyArray<VacCardProps>>([])

  const getVacancies = async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/vacancies/`, {
      method: "GET",
    })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      setVacancies(data)
    } else {
      toast({
        title: t("alertError"),
        description: t("alertErrorDesc"),
      })
    }
  }

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

  useEffect(() => {
    getVacancies()
  }, [])

  const scrollToVac = () => {
    gsap.to(window, {
      duration: 2.5,
      scrollTo: {
        y: "#vacancies",
        offsetY: +300,
      },
    })
  }

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
      <section
        data-aos="fade-up"
        className="container mb-24 mt-12 flex flex-col items-center gap-y-8 px-4 lg:mb-36 lg:mt-24 lg:px-0"
      >
        <PageTitle title={t("title")} text={t("description")} />
        <Button
          className="w-full rounded-xl border border-[#0FAF62] bg-transparent py-6 text-lg font-medium text-[#0FAF62] hover:bg-[#0FAF62] hover:text-white lg:w-fit lg:rounded-2xl lg:px-12"
          onClick={scrollToVac}
        >
          {t("callBtn")}
        </Button>
        <div className="mt-4 flex flex-col items-center gap-8 lg:flex-row">
          <Image src={career1} alt="career-img" priority />
          <Image src={career2} alt="career-img" priority />
        </div>
      </section>
      <section
        data-aos="fade-up"
        className="container mb-36 flex flex-col items-center gap-y-8 px-4 lg:px-0"
      >
        <SectionTitle title={t("section.subtitle")} />
        <h3 className="max-w-[516px] text-center text-4xl font-bold text-[#242331]">
          {t("section.title")}
        </h3>
        <CareerList />
      </section>
      <section
        id="vacancies"
        data-aos="fade-up"
        className="container mb-24 flex flex-col items-center gap-y-16 px-4 lg:mb-36 lg:px-0"
      >
        <h3 className="text-center text-4xl font-bold text-[#242331]">
          {t("vacancies.title")}
        </h3>
        {vacancies.length < 1 ? (
          <>
            <Image src={noVac} alt="no-vac" priority />
            <h4 className="max-w-[516px] text-center text-4xl font-bold text-[#242331]">
              {t("vacancies.noVac")}
            </h4>
          </>
        ) : (
          <div className="flex w-full flex-wrap justify-center gap-4">
            {vacancies.map((vac, i) => (
              <VacCard key={i} {...vac} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
