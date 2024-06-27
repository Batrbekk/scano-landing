import { useEffect, useState } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useTranslation } from "next-i18next"
import { useTranslations } from "use-intl"

import { Button } from "@/components/ui/button"

const Statistic = () => {
  const t = useTranslations("landing.main.statistic")

  const statisticList = [
    {
      text: t("statisticCard.card1"),
      size: 50,
      units: "K",
    },
    {
      text: t("statisticCard.card2"),
      size: 500,
      units: "K",
    },
    {
      text: t("statisticCard.card3"),
      size: 50,
      units: "M",
    },
    {
      text: t("statisticCard.card4"),
      size: 90,
      units: "%",
    },
  ]

  const [counters, setCounters] = useState(
    statisticList.map((item) => ({ count: 0 }))
  )

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.create({
      trigger: "#statisticSection",
      start: "top center",
      onEnter: () => {
        counters.forEach((counter, index) => {
          gsap.to(counter, {
            count: statisticList[index].size, // Animate to the size value
            duration: 2.5,
            ease: "power1.out",
            onUpdate: () => {
              const newCounters = counters.map((ctr, idx) => {
                if (idx === index) {
                  return {
                    ...ctr,
                    count: Math.round(
                      gsap.getProperty(counter, "count") as number
                    ),
                  }
                }
                return ctr
              })
              setCounters(newCounters)
            },
            snap: { count: 1 }, // Ensure the counter is snapped to integer values
          })
        })
      },
    })

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  }, [])

  const scrollToForm = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: "#demoForm",
        offsetY: +200,
      },
    })
  }

  return (
    <section
      id="statisticSection"
      className="mb-12 w-screen bg-[url('/landing/statistic/back.svg')] bg-cover py-12 lg:mb-36 lg:py-36"
    >
      <div
        data-aos="fade-up"
        className="container flex flex-col items-center gap-y-8 px-4 lg:px-0"
      >
        <div className="flex flex-col items-center gap-y-4 rounded-2xl bg-white p-4 lg:flex-row lg:p-8">
          {statisticList.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-y-1 text-center lg:gap-y-3"
            >
              <h4 className="text-4xl font-semibold text-[#242331] lg:text-7xl">
                {counters[i].count}
                <span className="text-green-500">{item.units}</span>
              </h4>
              <p className="w-2/3 text-lg font-semibold text-[#242331] lg:text-2xl">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-y-4">
          <h4 className="text-4xl font-bold text-white lg:text-5xl">
            {t("title")}
          </h4>
          <p className="text-lg font-semibold italic text-white lg:text-2xl">
            {t("subtitle")}
          </p>
          <Button
            className="h-fit w-full bg-white px-12 py-4 text-green-500 hover:text-white lg:w-fit"
            onClick={scrollToForm}
          >
            <p className="text-xl font-semibold">{t("askDemo")}</p>
          </Button>
        </div>
      </div>
    </section>
  )
}

export { Statistic }
