"use client"

import React, { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "@/navigation"
import { deleteCookie, getCookie } from "cookies-next"
import { LogOut, User } from "lucide-react"
import { useLocale, useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

import Logo from "../../public/logo.svg"

export interface Props {
  pending: boolean
  name?: string
  surname?: string
  mail?: string
  role?: string
  img?: string | null
  isDashboard: boolean
}

const Navbar: React.FC<Props> = ({ mail, role, img, isDashboard }) => {
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const themeName = getCookie("themeName")
  const token = getCookie("scano_acess_token")
  const [isPending, startTransition] = useTransition()
  const [ava, setAva] = useState<string | null>(null)

  async function getUserAva(img: string) {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/files/${img}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        setAva(res.url)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onChangeLang = (value: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: value })
    })
  }

  useEffect(() => {
    if (img) {
      getUserAva(img)
    }
  }, [img])

  return (
    <nav className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-x-11">
        {isDashboard && (
          <h4 className="scroll-m-20 pr-4 text-xl font-semibold tracking-tight">
            {t("thems")}: {themeName ? themeName : ""}
          </h4>
        )}
        {!isDashboard && (
          <Image
            priority={true}
            src={Logo}
            height={36}
            alt="logo"
            onClick={() => {
              router.push("/main")
            }}
            className="cursor-pointer"
          />
        )}
        {!isDashboard && (
          <div className="flex items-center gap-x-6">
            <Button
              className={`p-0 uppercase ${pathname === "/main" ? "text-blue-500 underline" : "text-inko"}`}
              variant="link"
              onClick={() => {
                router.push("/main/")
              }}
            >
              {t("theme")}
            </Button>
            <Button
              className={`p-0 uppercase ${pathname === "/main/archive" ? "text-blue-500 underline" : "text-inko"}`}
              variant="link"
              onClick={() => {
                router.push("/main/archive")
              }}
            >
              {t("archiveCollection")}
            </Button>
            <Button
              className={`p-0 uppercase ${pathname === "/main/report-archive" ? "text-blue-500 underline" : "text-inko"}`}
              variant="link"
              onClick={() => {
                router.push("/main/report-archive")
              }}
            >
              {t("archiveReport")}
            </Button>
            <Button
              className={`p-0 uppercase ${pathname === "/main/journal" ? "text-blue-500 underline" : "text-inko"}`}
              variant="link"
              onClick={() => {
                router.push("/main/journal")
              }}
            >
              {t("journal")}
            </Button>
            <Button
              className={`p-0 uppercase ${pathname === "/main/add-message-theme" ? "text-blue-500 underline" : "text-inko"}`}
              variant="link"
              onClick={() => {
                router.push("/main/add-message-theme")
              }}
            >
              {t("addMessageTopic")}
            </Button>
            <Button
              className={`p-0 uppercase ${pathname === "/main/visor" ? "text-blue-500 underline" : "text-inko"}`}
              variant="link"
              onClick={() => {
                router.push("/main/visor")
              }}
            >
              {t("visor")}
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-4">
        <Select value={locale} onValueChange={onChangeLang}>
          <SelectTrigger className="w-[72px]">
            <SelectValue placeholder={locale} className="uppercase text-inko" />
            <SelectContent>
              <SelectGroup>
                <SelectItem value="kk" className="text-inko">
                  KK
                </SelectItem>
                <SelectItem value="ru" className="text-inko">
                  RU
                </SelectItem>
                <SelectItem value="en" className="text-inko">
                  EN
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-x-2">
              <Avatar>
                {ava ? (
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image src={ava} alt="ava" width={40} height={42} />
                  </div>
                ) : (
                  <AvatarFallback>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-3.5">
            <DropdownMenuLabel>
              <p className="font-semibold leading-7">{mail}</p>
              <p className="text-sm font-light">{t(role)}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-x-2"
                onClick={() => {
                  router.push("/main/edit-profile")
                }}
              >
                <User />
                {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-x-2"
                onClick={() => {
                  deleteCookie("scano_acess_token")
                  router.replace("/")
                }}
              >
                <LogOut />
                {t("exit")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export { Navbar }
