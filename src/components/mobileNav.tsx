"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "@/navigation"
import Logo from "@/public/logo.svg"
import { deleteCookie } from "cookies-next"
import { AreaChart, List, LogOut, Menu, Settings } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { setAuthState } from "@/lib/store/authSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

export interface Props {
  pending: boolean
  name?: string
  surname?: string
  mail?: string
  role?: string
  img?: string | null
  isDashboard: boolean
}

const MobileNav: React.FC<Props> = ({ img }) => {
  const router = useRouter()
  const t = useTranslations()
  const path = usePathname()
  const dispatch = useAppDispatch()

  const token = useSelector((state: RootState) => state.auth.token)
  const userData = useSelector((state: RootState) => state.userData.user)

  const [open, setOpen] = useState(false)
  const [ava, setAva] = useState<string | null>(null)
  const [lastPage, setLastPage] = useState<string>("")

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

  useEffect(() => {
    setLastPage(path.split("/")[path.split("/").length - 1])
  }, [path])

  useEffect(() => {
    if (img) {
      getUserAva(img)
    }
  }, [img])

  return (
    <div className="relative flex items-center justify-center border-b px-4 py-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="absolute left-2 h-fit p-2">
          <Menu size={16} />
        </DialogTrigger>
        <DialogContent className="h-dvh w-screen">
          <Image
            priority={true}
            src={Logo}
            height={32}
            alt="logo"
            onClick={() => {
              router.push("/main")
            }}
            className="absolute left-2 top-2 cursor-pointer"
          />
          <div className="mt-16 flex flex-col justify-between">
            <div className="flex flex-col">
              <h4 className="mb-2 text-lg font-medium capitalize tracking-tight">
                {t("navigation")}
              </h4>
              <div className="flex cursor-pointer items-center justify-between rounded hover:bg-green-50">
                <div
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-x-4 p-4",
                    lastPage === "main" &&
                      "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                  )}
                  onClick={() => {
                    router.push(`/main/`)
                    setOpen(false)
                  }}
                >
                  <List size={16} />
                  <p className="text-base font-medium leading-none">
                    {t("message")}
                  </p>
                </div>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded hover:bg-green-50">
                <div
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-x-4 p-4",
                    lastPage === "mobile-analytic" &&
                      "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                  )}
                  onClick={() => {
                    router.push(`/main/mobile-analytic`)
                    setOpen(false)
                  }}
                >
                  <AreaChart size={16} />
                  <p className="text-base font-medium leading-none">
                    {t("analytic")}
                  </p>
                </div>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded hover:bg-green-50">
                <div
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-x-4 p-4",
                    lastPage === "analytic" &&
                      "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                  )}
                  onClick={() => {
                    dispatch(setAuthState({ authState: false, token: "" }))
                    deleteCookie("scano_acess_token")
                    router.push("/auth/")
                  }}
                >
                  <LogOut size={16} />
                  <p className="text-base font-medium leading-none">
                    {t("exit")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex cursor-pointer items-center gap-x-2 rounded bg-blue-50 p-2">
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
              <div>
                <p className="font-semibold leading-7">{userData?.email}</p>
                <p className="text-sm font-light">{t(userData?.role)}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Image
        priority={true}
        src={Logo}
        height={32}
        alt="logo"
        onClick={() => {
          router.push("/main")
        }}
        className="cursor-pointer"
      />
    </div>
  )
}

export { MobileNav }
