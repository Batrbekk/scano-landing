import React from "react"
import { useTranslations } from "use-intl"

import { Button } from "@/components/ui/button"
import {useRouter} from "@/navigation";

export interface VacCardProps {
  id: string
  title: string
  description: string
  type: string
  city?: string
}

const VacCard: React.FC<VacCardProps> = ({
  id,
  title,
  description,
  type,
  city,
}) => {
  const t = useTranslations("landing.careerPage");
  const router = useRouter();
  const formattedType = type.replace(/_/g, " ");

  return (
    <div className="group flex w-full max-w-full cursor-pointer flex-col rounded-2xl border px-6 py-12 text-[#242331] hover:border-[#0FAF62] hover:bg-[#0FAF62] hover:text-white lg:max-w-[640px] lg:px-8 lg:py-16">
      <div className="flex flex-col gap-y-3">
        <h4 className="text-2xl font-semibold">{title}</h4>
        <p className="text-lg">
          {city && `${city} | `}{" "}
          <span className="capitalize text-[#0FAF62] group-hover:text-white">
            {formattedType}
          </span>
        </p>
      </div>
      <div className="mt-6">
        <p className="text-md">{description}</p>
      </div>
      <Button
        variant="outline"
        className="mt-16 w-fit rounded-2xl px-4 py-6 group-hover:text-[#242331]"
        onClick={() => {
          router.push(`/landing/${id}`);
        }}
      >
        {t("sendRequest")}
      </Button>
    </div>
  )
}

export { VacCard }
