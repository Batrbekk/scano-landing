"use client"

import React, {useEffect, useState} from "react"
import Image from "next/image"
import { useRouter } from "@/navigation"
import system1 from "@/public/landing/peculiarities/1.svg"
import system2 from "@/public/landing/peculiarities/2.svg"
import system3 from "@/public/landing/peculiarities/3.svg"
import AOS from "aos"

import { DemoForm } from "@/components/landing/demoForm"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { PageTitle } from "@/components/landing/pageTitle"
import { PeculiarItem } from "@/components/landing/peculiarItem"
import { SectionTitle } from "@/components/landing/sectionTitle"

import "aos/dist/aos.css"

import Background from "@/public/landing/aboutBack.svg"
import { useTranslations } from "use-intl"
import {cn} from "@/lib/utils";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("landing.peculiarities");
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, []);

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
  }, []);

  const listItem = [
    {
      aos: 'fade-right',
      img: system1,
      aos2: 'fade-left',
      title: t('section.sectionCards.card1.title'),
      isLeft: false,
      description: t('section.sectionCards.card1.text'),
      state: 1
    },
    {
      aos: 'fade-left',
      img: system2,
      aos2: 'fade-right',
      title: t("section.sectionCards.card2.title"),
      isLeft: true,
      description: t("section.sectionCards.card2.text"),
      state: 2
    },
    {
      aos: 'fade-right',
      img: system3,
      aos2: 'fade-left',
      title: t("section.sectionCards.card3.title"),
      isLeft: false,
      description: t("section.sectionCards.card3.text"),
      state: 3
    }
  ];

  return (
    <main className="relative max-w-screen-sm">
      <Image
        className="absolute right-0 top-0 -z-10"
        priority={true}
        src={Background}
        alt="back"
      />
      <div className={cn(
        `sticky top-0 z-50`,
      )}>
        <Header isBlack={true} isSticky={isHeaderFixed}/>
      </div>
      <section className="container mt-14 lg:mt-24 flex flex-col items-center gap-y-12 px-4 lg:px-0">
        <PageTitle title={t("title")} text={t("subtitle")} />
      </section>
      <section className="container mt-24 lg:mt-36 flex flex-col items-center gap-y-8 px-4 lg:px-0">
        <SectionTitle data-aos="fade-up" title={t("title")} />
        <h1
          data-aos="fade-up"
          className="w-[75%] text-center text-3xl font-bold text-[#242331]"
        >
          {t("section.title")}
        </h1>
      </section>
      <section className="container my-24 lg:my-36 flex flex-col items-center gap-y-24 px-4 lg:px-0">
        {listItem.map((card, i) => (
          <div
            key={i}
            className={cn(
              `flex w-full items-start justify-between 
              ${i === 1 && 'lg:flex-row-reverse'}
              flex-col lg:flex-row gap-y-4`
            )}
          >
            <Image
              data-aos={card.aos}
              src={card.img}
              alt="system-acc"
              className="w-full lg:w-1/2 shadow-md rounded-2xl"
              priority
            />
            <PeculiarItem
              data-aos={card.aos2}
              title={card.title}
              isLeft={card.isLeft}
              description={card.description}
              state={card.state}
            />
          </div>
        ))}
      </section>
      <DemoForm />
      <Footer />
    </main>
  )
}
