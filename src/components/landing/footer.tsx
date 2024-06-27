import Image from "next/image"
import { Link, usePathname } from "@/navigation"
import Logo from "@/public/logo.svg"
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react"
import { useTranslations } from "use-intl"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const Footer = () => {
  const path = usePathname()
  const t = useTranslations("landing")

  const navList = [
    {
      href: "/",
      text: t("mainPage"),
    },
    {
      href: "/landing/about",
      text: t("aboutUs"),
    },
    {
      href: "/landing/peculiarities",
      text: t("features"),
    },
    {
      href: "/landing/analytic",
      text: t("analytic"),
    },
    {
      href: "/landing/price",
      text: t("price"),
    },
    {
      href: "/landing/career",
      text: t("career"),
    },
  ]

  return (
    <footer className="container px-4 lg:px-0">
      <Separator orientation="horizontal" className="mb-24 text-[#e3e3e3]" />
      <div className="flex flex-col gap-y-4 lg:flex-row  items-start justify-between">
        <div className="flex items-start gap-x-16">
          <div className="flex max-w-[366px] flex-col gap-y-6">
            <Image src={Logo} alt="logo" />
            <p className="text-md text-[#797979]">
              {t("main.footer.headTitle")}
            </p>
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-4">
                <Mail className="text-green-500" />
                <a
                  href="mailto:info@scano.kz"
                  className="text-md lg:text-lg font-medium text-[#797979] hover:underline"
                >
                  info@scano.kz
                </a>
              </div>
              <div className="flex items-center gap-x-4">
                <Phone className="text-green-500" />
                <a
                  href="tel:+77026650040"
                  className="text-md lg:text-lg font-medium text-[#797979] hover:underline"
                >
                  8-702-665-00-40
                </a>
              </div>
            </div>
          </div>
          <div className="flex max-w-[182px] flex-col">
            <h4 className="text-2xl font-bold text-[#242331]">
              {t("main.footer.pages")}
            </h4>
            <Separator
              orientation="horizontal"
              className="my-6 text-[#e3e3e3]"
            />
            <div className="flex flex-col gap-y-2">
              {navList.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={cn`text-lg ${path === item.href ? "text-green-500" : "text-[#797979]"}`}
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex max-w-[490px] flex-col gap-y-4 rounded-2xl bg-[#F9F9F9] px-8 py-16">
          <p className="text-base font-semibold text-green-500">
            {t("main.footer.subtitle")}
          </p>
          <h3 className="w-2/3 text-2xl font-semibold text-[#242331]">
            {t("main.footer.title")}
          </h3>
          <p className="text-lg text-[#797979]">{t("main.footer.text")}</p>
        </div>
      </div>
      <Separator orientation="horizontal" className="mt-8 text-[#e3e3e3]" />
      <div className="my-8 flex flex-col-reverse gap-y-4 lg:flex-row items-center justify-between">
        <p className="text-xs lg:text-base text-[#797979]">
          © Shymkent 2024. All Rights Reserved by "Infinity Agency"
        </p>
        <div className="flex items-center gap-x-4">
          <a href="https://www.instagram.com/scanokz" target="_blank" className="cursor-pointer">
            <Instagram size={16} className="text-[#242331]" />
          </a>
          <a href="#" className="cursor-pointer">
            <Linkedin size={16} className="text-[#242331]" />
          </a>
          <a href="#" className="cursor-pointer">
            <Facebook size={16} className="text-[#242331]" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
