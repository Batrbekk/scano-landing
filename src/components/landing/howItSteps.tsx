import { useEffect } from "react"
import Image from "next/image"
import content1 from "@/public/landing/howItWork/content1.svg"
import content2 from "@/public/landing/howItWork/content2.svg"
import content3 from "@/public/landing/howItWork/content3.svg"
import icon1 from "@/public/landing/howItWork/icon1.svg"
import icon2 from "@/public/landing/howItWork/icon2.svg"
import icon3 from "@/public/landing/howItWork/icon3.svg"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useTranslations } from "use-intl"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionTitle } from "@/components/landing/sectionTitle"

const HowItSteps = () => {
  const t = useTranslations("landing.main.howIt")

  const tabList = [
    {
      title: t("howItCards.card1.title"),
      value: "acc",
      detail: {
        icon: icon1,
        content: content1,
        title: t("howItCards.card1.subtitle"),
        text: t("howItCards.card1.text"),
      },
    },
    {
      title: t("howItCards.card2.title"),
      value: "confirm",
      detail: {
        icon: icon2,
        content: content2,
        title: t("howItCards.card2.subtitle"),
        text: t("howItCards.card2.text"),
      },
    },
    {
      title: t("howItCards.card3.title"),
      value: "start",
      detail: {
        icon: icon3,
        content: content3,
        title: t("howItCards.card3.subtitle"),
        text: t("howItCards.card3.text"),
      },
    },
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  const scrollToForm = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: {
        y: "#demoForm",
        offsetY: +200,
      },
    })
  }

  return (
    <section className="container mb-24 flex flex-col items-center px-4 lg:mb-36 lg:px-0">
      <SectionTitle data-aos="fade-up" title={t("howItWorks")} />
      <h2
        data-aos="fade-up"
        className="my-8 w-full text-center text-2xl font-bold text-[#242331] lg:w-[60%] lg:text-4xl"
      >
        {t("howItTitle")}
      </h2>
      <Tabs data-aos="fade-up" defaultValue="acc" className="w-full">
        <TabsList className="flex flex-col items-center gap-x-6 gap-y-4 border-none lg:flex-row">
          {tabList.map((tab, i) => (
            <TabsTrigger
              key={i}
              value={tab.value}
              className="w-full rounded-xl bg-[#f9f9f9] py-2 hover:border-none hover:text-green-500 data-[state=active]:border-none data-[state=active]:bg-green-500 lg:w-1/3 lg:rounded-3xl lg:px-12 lg:py-8"
            >
              <p className="text-lg font-semibold lg:text-2xl">{tab.title}</p>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4 flex justify-center px-4 lg:mt-16 lg:px-16">
          {tabList.map((tab, i) => (
            <TabsContent key={i} value={tab.value}>
              <div className="flex flex-col-reverse items-start justify-between gap-x-16 gap-y-4 lg:flex-row">
                <div className="flex w-full flex-col gap-y-6 lg:max-w-xl">
                  <div className="flex items-start gap-x-6">
                    <Image src={tab.detail.icon} alt="tab-icon" />
                    <h4 className="w-1/3 text-3xl font-semibold text-[#242331]">
                      {tab.detail.title}
                    </h4>
                  </div>
                  <p className="w-[80%] text-xl text-[#797979]">
                    {tab.detail.text}
                  </p>
                  <Button
                    className="h-fit w-full rounded-xl bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] px-12 py-4 lg:w-fit lg:rounded-2xl"
                    onClick={scrollToForm}
                  >
                    <p className="text-bold text-lg text-white">
                      {t("howItStart")}
                    </p>
                  </Button>
                </div>
                <Image
                  src={tab.detail.content}
                  alt="tab-content"
                  className="w-full rounded-2xl lg:max-w-xl"
                />
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </section>
  )
}

export { HowItSteps }
