import { useRef } from "react"
import Image from "next/image"
import logo1 from "@/public/landing/partners/1.svg"
import logo2 from "@/public/landing/partners/2.svg"
import logo3 from "@/public/landing/partners/3.svg"
import logo4 from "@/public/landing/partners/4.svg"
import logo5 from "@/public/landing/partners/5.svg"
import gsap from "gsap"
import { useTranslations } from "use-intl"

import horizontalLoop from "@/lib/gsap/horizontalLoop"
import useIsomorphicLayoutEffect from "@/lib/gsap/isomorphicLayout"

const Partner = () => {
  const t = useTranslations()
  const content = useRef<HTMLDivElement>(null)

  const logos = [
    {
      icon: logo3,
      text: t("landing.partner.brk"),
    },
    {
      icon: logo2,
      text: t("landing.partner.akimat"),
    },
    {
      icon: logo1,
      text: t("landing.partner.samruk"),
    },
    {
      icon: logo4,
      text: t("landing.partner.minis"),
    },
    {
      icon: logo5,
      text: t("landing.partner.kazmunaigaz"),
    },
  ]

  useIsomorphicLayoutEffect(() => {
    let ctx: gsap.Context
    window.addEventListener("load", () => {
      ctx = gsap.context(() => {
        const tl = horizontalLoop("#logo", {
          repeat: -1,
          paddingRight: 10,
        })
      }, content)
    })

    return () => ctx && ctx.revert()
  }, [])

  return (
    <section className="container my-24 flex flex-col items-center gap-y-12 px-4 lg:my-36 lg:px-0">
      <h2 className="text-4xl font-bold">
        {t.rich("landing.main.clientsTitle", {
          span: (chunks) => <span className="text-green-500">{chunks}</span>,
        })}
      </h2>
      <div
        ref={content}
        className="hidden max-w-6xl items-center gap-x-6 overflow-hidden lg:flex"
      >
        <div
          className="flex w-full items-center gap-x-6 overflow-hidden"
          style={{ whiteSpace: "nowrap" }}
        >
          {logos.map((item, i) => (
            <div id="logo" key={i} className="flex items-center gap-x-2">
              <Image src={item.icon} alt="partner_logo" priority />
              <h4 className="text-2xl font-semibold text-[#A6A6A6]">
                {item.text}
              </h4>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 overflow-hidden lg:hidden">
        {logos.map((item, i) => (
          <div id="logo" key={i} className="flex items-center gap-x-2">
            <Image src={item.icon} alt="partner_logo" priority />
            <h4 className="text-2xl font-semibold text-[#A6A6A6]">
              {item.text}
            </h4>
          </div>
        ))}
      </div>
    </section>
  )
}

export { Partner }
