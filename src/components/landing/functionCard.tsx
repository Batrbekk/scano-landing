import React from "react"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"
import { useRouter } from "@/navigation"
import { useTranslations } from "use-intl"

import { Button } from "@/components/ui/button"

export interface Props {
  title: string
  text: string
  img: StaticImport
}

const FunctionCard: React.FC<Props> = ({ title, text, img }) => {
  const router = useRouter()
  const t = useTranslations()

  return (
    <div className="hover: group flex max-w-[388px] flex-col items-center gap-y-8 rounded-2xl py-8 text-center hover:bg-[#F9F9F9]">
      <div className="flex flex-col items-center gap-y-8">
        <Image src={img} alt={title} className="h-[190px] w-full max-w-72" />
        <div className="flex flex-col gap-y-4">
          <h4 className="text-2xl font-bold text-[#242331]">{title}</h4>
          <p className="text-lg text-[#797979]">{text}</p>
        </div>
      </div>
      <Button
        variant="link"
        className="text-base font-bold text-[#242331] underline group-hover:text-green-500"
        onClick={() => {
          router.push("/landing/contact")
        }}
      >
        {t("landing.main.detail")}
      </Button>
    </div>
  )
}

export { FunctionCard }
