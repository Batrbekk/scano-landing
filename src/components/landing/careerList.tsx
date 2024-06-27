import Image from "next/image"
import icon1 from "@/public/landing/career/icon/1.svg"
import icon2 from "@/public/landing/career/icon/2.svg"
import icon3 from "@/public/landing/career/icon/3.svg"
import icon4 from "@/public/landing/career/icon/4.svg"
import icon5 from "@/public/landing/career/icon/5.svg"
import icon6 from "@/public/landing/career/icon/6.svg"
import { useTranslations } from "use-intl"

const CareerList = () => {
  const t = useTranslations("landing.careerPage.section.sectionCard")
  const careerListItem = [
    {
      icon: icon1,
      title: t("card1.title"),
      text: t("card1.text"),
    },
    {
      icon: icon2,
      title: t("card2.title"),
      text: t("card2.text"),
    },
    {
      icon: icon3,
      title: t("card3.title"),
      text: t("card3.text"),
    },
    {
      icon: icon4,
      title: t("card4.title"),
      text: t("card4.text"),
    },
    {
      icon: icon5,
      title: t("card5.title"),
      text: t("card5.text"),
    },
    {
      icon: icon6,
      title: t("card6.title"),
      text: t("card6.text"),
    },
  ]

  return (
    <div className="flex flex-wrap gap-5">
      {careerListItem.map((item, index) => (
        <div
          key={index}
          className="flex max-h-[415px] max-w-[452px] flex-col rounded-2xl border border-[#F6F6F6] bg-white p-12 shadow-md"
        >
          <Image src={item.icon} alt="career-icon" priority />
          <div className="mt-8 flex flex-col gap-y-4">
            <h4 className="text-2xl font-semibold text-[#242331]">
              {item.title}
            </h4>
            <p className="text-xl text-[#797979]">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export { CareerList }
