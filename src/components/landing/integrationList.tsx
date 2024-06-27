import { useEffect } from "react"
import function4 from "@/public/landing/functions/4.svg"
import function5 from "@/public/landing/functions/5.svg"
import function6 from "@/public/landing/functions/6.svg"
import AOS from "aos"
import { useTranslations } from "use-intl"

import { FunctionCard } from "@/components/landing/functionCard"
import { SectionTitle } from "@/components/landing/sectionTitle"

const IntegrationList = () => {
  const t = useTranslations("landing.analyticPage.integrations")

  const cards = [
    {
      title: t("integrationsCards.card1.title"),
      text: t("integrationsCards.card1.text"),
      img: function4,
    },
    {
      title: t("integrationsCards.card2.title"),
      text: t("integrationsCards.card2.text"),
      img: function5,
    },
    {
      title: t("integrationsCards.card3.title"),
      text: t("integrationsCards.card3.text"),
      img: function6,
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
      className="container mb-14 lg:mb-24 flex flex-col items-center px-4 lg:px-0"
    >
      <SectionTitle title={t("subtitle")} />
      <h2
        data-aos="fade-up"
        className="my-8 w-full lg:w-[60%] text-center text-4xl font-bold text-[#242331]"
      >
        {t("title")}
      </h2>
      <div className="flex items-start flex-col lg:flex-row gap-y-4 gap-x-8">
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

export { IntegrationList }
