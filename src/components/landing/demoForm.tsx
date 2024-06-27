"use client"

import React, { useState } from "react"
import Image from "next/image"
import ContentImg from "@/public/landing/form/content.svg"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslations } from "use-intl"
import { z } from "zod"

import { env } from "@/env.mjs"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const DemoForm = () => {
  const { toast } = useToast()
  const t = useTranslations("landing.main.demoForm")
  const [btnLoading, setBtnLoading] = useState<boolean>(false)

  const FormSchema = z.object({
    mail: z.string(),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mail: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setBtnLoading(true)
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/vacancies/contact`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: "",
          email: data.mail,
          phone_number: "",
          tg_acccount: "",
          cov_letter: "",
        }),
      }
    )
    if (res.ok) {
      toast({
        title: t("alertSuccess"),
        description: t("alertDescription"),
      })
      setBtnLoading(false)
    } else {
      toast({
        title: t("alertError"),
        description: t("alertErrorDesc"),
      })
      setBtnLoading(false)
    }
  }

  return (
    <section
      id="demoForm"
      data-aos="fade-up"
      className="container mb-12 flex items-center gap-x-8 bg-[url('/landing/form/mobBack.svg')] bg-cover p-4 lg:mb-36 lg:min-h-[585px] lg:bg-[url('/landing/form/back.svg')] lg:px-16 lg:py-11"
    >
      <div className="flex w-full flex-col gap-y-6 lg:w-1/2">
        <h2 className="text-2xl font-bold text-white lg:text-5xl">
          {t("title")}
        </h2>
        <p className="text-md w-[85%] text-white lg:text-xl">{t("subtitle")}</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-x-6 gap-y-4 lg:flex-row"
          >
            <FormField
              name="mail"
              render={({ field }) => (
                <Input
                  className="text-md placeholder:text-md h-fit rounded-xl border-none bg-white/20 p-4 font-semibold text-white placeholder:font-semibold placeholder:text-white focus-visible:ring-0 lg:rounded-2xl lg:py-6 lg:pl-8 lg:text-lg lg:placeholder:text-lg"
                  placeholder={t("input")}
                  {...field}
                />
              )}
            />
            <Button
              type="submit"
              disabled={btnLoading}
              className="h-fit w-full rounded-xl bg-white px-4 py-4 text-green-500 hover:bg-green-500 hover:text-white lg:w-fit lg:rounded-2xl lg:px-8 lg:py-6"
            >
              {btnLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <p className="text-md font-semibold lg:text-lg">
                    {t("wait")}
                  </p>
                </>
              ) : (
                <p className="text-md font-semibold lg:text-lg">
                  {t("button")}
                </p>
              )}
            </Button>
          </form>
        </Form>
      </div>
      <Image
        data-aos="fade-left"
        src={ContentImg}
        alt="form-img"
        className="hidden lg:block"
      />
    </section>
  )
}

export { DemoForm }
