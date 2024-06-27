import { useTranslations } from "use-intl"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/landing/landingAccordion"

const Faq = () => {
  const t = useTranslations("landing.faq")

  const faqList = [
    {
      title: t("card1.title"),
      text: t("card1.text"),
    },
    {
      title: t("card2.title"),
      text: t("card2.text"),
    },
    {
      title: t("card3.title"),
      text: t("card3.text"),
    },
    {
      title: t("card4.title"),
      text: t("card4.text"),
    },
    {
      title: t("card5.title"),
      text: t("card5.text"),
    },
  ]

  return (
    <section data-aos="fade-up" className="relative mb-14 lg:mb-24 bg-[url('/landing/faq/back.svg')] px-4 lg:px-0">
      <div className="py-12 lg:py-24 flex w-full flex-col items-center">
        <h2 className="text-4xl font-semibold text-white">FAQ</h2>
        <Accordion
          type="single"
          defaultValue="1"
          className="mt-8 lg:mt-24 flex w-full max-w-full lg:max-w-[970px] flex-col gap-y-4 lg:gap-y-8"
        >
          {faqList.map((faq, index) => (
            <AccordionItem
              key={index}
              value={(index + 1).toString()}
              className="border-none"
            >
              <AccordionTrigger className="border-none bg-white px-4 lg:px-8 text-lg lg:text-2xl font-medium text-[#242331]">
                {faq.title}
              </AccordionTrigger>
              <AccordionContent className="rounded-b-2xl pt-4 lg:pt-0 bg-white px-4 lg:px-8 text-md lg:text-xl text-[#797979]">
                {faq.text}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export { Faq }
