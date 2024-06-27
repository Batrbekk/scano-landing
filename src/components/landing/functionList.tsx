import { useEffect } from "react"
import function1 from "@/public/landing/functions/1.svg"
import function2 from "@/public/landing/functions/2.svg"
import function3 from "@/public/landing/functions/3.svg"
import AOS from "aos"
import { useTranslations } from "use-intl"

import { FunctionCard } from "@/components/landing/functionCard"
import { SectionTitle } from "@/components/landing/sectionTitle"

const FunctionList = () => {
  const t = useTranslations()

  const cards = [
    {
      title: t("landing.main.functionCard.card1.title"),
      text: t("landing.main.functionCard.card1.text"),
      img: function1,
    },
    {
      title: t("landing.main.functionCard.card2.title"),
      text: t("landing.main.functionCard.card2.text"),
      img: function2,
    },
    {
      title: t("landing.main.functionCard.card3.title"),
      text: t("landing.main.functionCard.card3.text"),
      img: function3,
    },
  ]

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, [])

  return (
    <section className="container mb-24 flex flex-col items-center px-4 lg:mb-36 lg:px-0">
      <SectionTitle data-aos="fade-up" title={t("landing.main.function")} />
      <h2
        data-aos="fade-up"
        className="my-8 w-full text-center text-2xl font-bold text-[#242331] lg:w-[60%] lg:text-4xl"
      >
        {t("landing.main.functionTitle")}
      </h2>
      <div
        data-aos="fade-up"
        className="flex flex-col items-start gap-8 lg:flex-row"
      >
        {cards.map((card, i) => (
          <FunctionCard
            key={i}
            title={card.title}
            text={card.text}
            img={card.img}
          />
        ))}
      </div>
    </section>
  )
}

export { FunctionList }
