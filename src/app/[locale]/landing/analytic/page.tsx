"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "@/navigation"
import Background from "@/public/landing/aboutBack.svg"
import AOS from "aos"
import { useTranslations } from "use-intl"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { DemoForm } from "@/components/landing/demoForm"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { IntegrationList } from "@/components/landing/integrationList"
import { PageTitle } from "@/components/landing/pageTitle"
import { WhyScanoList } from "@/components/landing/whyScanoList"

export default function Page() {
  const router = useRouter()
  const t = useTranslations("landing.analyticPage")
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHeaderFixed(true)
      } else {
        setIsHeaderFixed(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <main className="relative">
      <Image
        className="absolute right-0 top-0 -z-10"
        priority={true}
        src={Background}
        alt="back"
      />
      <div className={cn(`sticky top-0 z-50`)}>
        <Header isBlack={true} isSticky={isHeaderFixed} />
      </div>
      <section className="container my-14 lg:mb-36 lg:mt-24 flex flex-col items-center gap-y-12 px-4 lg:px-0">
        <PageTitle title={t("title")} text={t("subtitle")} />
      </section>
      <WhyScanoList />
      <Separator className="container my-24 px-0" />
      <IntegrationList />
      <DemoForm />
      <Footer />
    </main>
  )
}
