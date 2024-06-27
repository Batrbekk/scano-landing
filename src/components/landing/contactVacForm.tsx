"use client"

import React, {useEffect, useState} from "react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {useTranslations} from "use-intl";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {env} from "@/env.mjs";
import {useToast} from "@/components/ui/use-toast";
import {Form, FormField} from "@/components/ui/form";
import {Loader2} from "lucide-react";
import {useParams} from "next/navigation";
import {log} from "node:util";

const ContactVacForm = () => {
  const {toast} = useToast();
  const params = useParams();
  const t = useTranslations("landing.contact");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [vacId, setVacId] = useState<string>("");

  const FormSchema = z.object({
    mail: z.string(),
    name: z.string(),
    cv: z.instanceof(File),
    phone: z.string(),
    letter: z.string()
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mail: "",
      name: "",
      cv: undefined,
      phone: "",
      letter: ""
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setBtnLoading(true);
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/vacancies/apply`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: data.name,
        email: data.mail,
        phone_number: data.phone,
        vacancy_id: vacId,
        cv: data.cv,
        cov_letter: data.letter
      })
    })
    if (res.ok) {
      toast({
        title: t('alertSuccess'),
        description: t('alertDescription'),
      });
      setBtnLoading(false);
    } else {
      toast({
        title: t('alertError'),
        description: t('alertErrorDesc'),
      });
      setBtnLoading(false);
    }
  }

  useEffect(() => {
    setVacId(params.vac_id.toString());
  }, [params]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-y-4 lg:gap-y-9 rounded-2xl border bg-white px-4 lg:px-16 py-8 shadow-md"
      >
        <div className="flex flex-col lg:flex-row items-center gap-y-4 gap-x-8">
          <FormField render={({field}) => (
            <div className="flex w-full lg:w-1/2 flex-col gap-y-2">
              <label className="text-lg font-semibold text-[#242331]">{t('fio')} *</label>
              <Input
                id="name"
                placeholder={t('fio')}
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                className="rounded-lg lg:rounded-2xl p-4 text-md lg:text-lg h-fit"
                {...field}
              />
            </div>
          )} name="name"/>
          <FormField render={({field}) => (
            <div className="flex w-full lg:w-1/2 flex-col gap-y-2">
              <label className="text-lg font-semibold text-[#242331]">
                {t('mail')} *
              </label>
              <Input
                id="mail"
                placeholder="E-mail"
                type="email"
                autoCapitalize="none"
                autoCorrect="off"
                className="rounded-lg lg:rounded-2xl p-4 text-md lg:text-lg h-fit"
                {...field}
              />
            </div>
          )} name="mail"/>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-y-4 gap-x-8">
          <FormField render={({field}) => (
            <div className="flex w-full lg:w-1/2 flex-col gap-y-2">
              <label className="text-lg font-semibold text-[#242331]">
                CV*
              </label>
              <Input
                id="cv"
                placeholder={t('telegram')}
                type="file"
                autoCapitalize="none"
                autoCorrect="off"
                className="rounded-lg lg:rounded-2xl p-4 text-md lg:text-lg h-fit"
                {...field}
              />
            </div>
          )} name="cv"/>
          <FormField render={({field}) => (
            <div className="flex w-full lg:w-1/2 flex-col gap-y-2">
              <label className="text-lg font-semibold text-[#242331]">
                {t('phoneNumber')} *
              </label>
              <Input
                id="phone"
                placeholder="+7-(***)-***-**-**"
                type="tel"
                autoCapitalize="none"
                autoCorrect="off"
                className="rounded-lg lg:rounded-2xl p-4  text-md lg:text-lg h-fit"
                {...field}
              />
            </div>
          )} name="phone" />
        </div>
        <FormField name="letter" render={({field}) => (
          <div className="flex flex-col gap-y-2">
            <label className="text-lg font-semibold text-[#242331]">{t('coverLetter')}</label>
            <Textarea className="h-[150px] lg:h-[300px] resize-none rounded-lg lg:rounded-2xl px-4 lg:px-8 py-4 text-md lg:text-lg"  {...field} />
          </div>
        )}/>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full lg:w-fit rounded-lg lg:rounded-2xl bg-[#0FAF62] px-16 py-8 text-lg font-semibold text-white hover:bg-[#0FAF62]"
          >
            {btnLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <p className="text-md lg:text-lg font-semibold">{t("wait")}</p>
              </>
            ) : (
              <p className="text-md lg:text-lg font-semibold">{t("send")}</p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export {ContactVacForm}
