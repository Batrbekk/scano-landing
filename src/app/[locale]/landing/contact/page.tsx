"use client"

import React, {useEffect, useState} from "react"
import Image from "next/image"
import { useRouter } from "@/navigation"
import Background from "@/public/landing/aboutBack.svg"
import AOS from "aos"

import "aos/dist/aos.css"

import Background2 from "@/public/landing/contact/back.svg"

import { ContactForm } from "@/components/landing/contactForm"
import { Faq } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import {cn} from "@/lib/utils";
import {useTranslations} from "use-intl";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("landing.contact");
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

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

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, []);

  return (
    <main className="relative">
      <Image
        className="absolute right-0 top-0 -z-10"
        priority={true}
        src={Background}
        alt="back"
      />
      <Image
        className="absolute right-0 top-28 -z-10"
        priority={true}
        src={Background2}
        alt="back"
      />
      <div className={cn(
        `sticky top-0 z-50`,
      )}>
        <Header isBlack={true} isSticky={isHeaderFixed}/>
      </div>
      <section className="container my-12 lg:my-36 flex items-center justify-center px-4 lg:px-0">
        <h1 className="text-4xl lg:text-6xl font-semibold text-[#242331]">
          {t('title')}
        </h1>
      </section>
      <section className="container mb-12 lg:mb-36 flex flex-col items-center px-4 lg:px-0">
        <ContactForm />
      </section>
      <Faq />
      <Footer />
    </main>
  )
}
