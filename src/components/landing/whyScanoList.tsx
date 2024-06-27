import { useEffect } from "react"
import function1 from "@/public/landing/functions/1.svg"
import function2 from "@/public/landing/functions/2.svg"
import function3 from "@/public/landing/functions/3.svg"
import AOS from "aos"
import { useTranslations } from "use-intl"

import { FunctionCard } from "@/components/landing/functionCard"
import { SectionTitle } from "@/components/landing/sectionTitle"

const WhyScanoList = () => {
  const t = useTranslations("landing.analyticPage.section")

  const cards = [
    {
      title: t("sectionCards.card1.title"),
      text: t("sectionCards.card1.text"),
      img: function1,
    },
    {
      title: t("sectionCards.card2.title"),
      text: t("sectionCards.card2.text"),
      img: function2,
    },
    {
      title: t("sectionCards.card3.title"),
      text: t("sectionCards.card3.text"),
      img: function3,
    },
  ]

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, [])

  return (
    <section
      data-aos="fade-up"
      className="container mb-15 lg:mb-24 flex flex-col items-center px-4 lg:px-0"
    >
      <SectionTitle title={t("subtitle")} />
      <h2
        data-aos="fade-up"
        className="my-8 w-full lg:w-[60%] text-center text-4xl font-bold text-[#242331]"
      >
        {t("title")}
      </h2>
      <div className="flex flex-col lg:flex-row items-start gap-y-4 gap-x-8">
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

export { WhyScanoList }
