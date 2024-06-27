import React, { useEffect } from "react"
import Image from "next/image"
import UnicImg from "@/public/landing/unic/unic.svg"
import UnicBack from "@/public/landing/unicBack.svg"
import AOS from "aos"

import { cn } from "@/lib/utils"

export interface UnicSectionProps {
  title: string
  text: string
  subtitle: string
  subtext: string
  icon: any
  isLeft: boolean
}

const UnicSection: React.FC<UnicSectionProps> = ({
  title,
  text,
  subtitle,
  subtext,
  icon,
  isLeft,
}) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, [])

  return (
    <section
      className={cn(
        `container relative mb-12 flex items-center gap-x-12 rounded-3xl bg-[#F1F1F1] py-12 lg:mb-36`,
        isLeft ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div data-aos="fade-right" className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <h3 className="text-2xl font-bold text-[#242331] lg:text-4xl">
            {title}
          </h3>
          <p className="text-lg text-[#797979]">{text}</p>
        </div>
        <div
          className={cn(
            "flex items-start gap-x-4",
            isLeft ? "flex-row" : "flex-row-reverse"
          )}
        >
          <Image src={icon} alt="icon" />
          <div className="flex flex-col gap-y-2">
            <h4 className="w-2/3 text-xl font-bold text-[#242331] lg:text-2xl">
              {subtitle}
            </h4>
            <p className="w-full text-lg text-[#797979] lg:w-2/3">{subtext}</p>
          </div>
        </div>
      </div>
      <Image
        data-aos="fade-left"
        src={UnicImg}
        alt="unic-img"
        className="z-10 hidden drop-shadow-lg lg:block"
        priority
      />
      <Image
        src={UnicBack}
        alt="unic-back"
        priority
        className={cn(
          `absolute hidden lg:block`,
          isLeft ? "-right-14" : "-left-14 rotate-180"
        )}
      />
    </section>
  )
}

export { UnicSection }
