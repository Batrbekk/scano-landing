"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "@/navigation"
import Logo from "@/public/logo.svg"
import {
  AreaChart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MailCheck,
  Mails,
  Minus,
  Newspaper,
  Settings,
  Trash2,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { RootState } from "@/lib/store/store"
import { Permission } from "@/lib/store/userSlice"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

const SideNav = () => {
  const router = useRouter()
  const t = useTranslations()
  const path = usePathname()

  const [lengthPath, setLengthPath] = useState(0)
  const [lastPage, setLastPage] = useState<string>("")
  const [themeId, setThemeId] = useState<string | null>(null)
  const [settingIsOpen, setSettingIsOpen] = useState<boolean>(false)
  const [materialIsOpen, setMaterialIsOpen] = useState<boolean>(false)
  const userPermission = useSelector(
    (state: RootState) => state.userData.user?.permissions
  )

  useEffect(() => {
    setLengthPath(path.split("/").length)
    setLastPage(path.split("/")[path.split("/").length - 1])

    if (path.split("/").length === 2) {
      setMaterialIsOpen(true)
    }
  }, [path])

  useEffect(() => {
    if (
      lastPage === "editTheme" ||
      lastPage === "createTag" ||
      lastPage === "rules" ||
      lastPage === "createRule" ||
      lastPage === "users" ||
      lastPage === "editUser"
    ) {
      setSettingIsOpen(true)
      setMaterialIsOpen(false)
    }
    if (lastPage === "analytic") {
      setSettingIsOpen(false)
      setMaterialIsOpen(false)
    }
  }, [lastPage])

  useEffect(() => {
    setThemeId(path.split("/")[1])
  }, [path])

  return (
    <div className="border-r">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-center p-4">
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
        </div>
      </div>
      <ScrollArea className="h-screen pt-4">
        <div className="mb-20 flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2 px-4">
            <p className="text-sm font-medium leading-none">{t("analytic")}</p>
            <div
              className={cn(
                "flex cursor-pointer items-center gap-x-4 p-2",
                lastPage === "analytic" &&
                  "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
              )}
              onClick={() => {
                router.push(`/${themeId}/analytic`)
              }}
            >
              <AreaChart size={16} />
              <p className="text-sm font-medium leading-none">
                {t("analytic")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 px-4">
            <p className="text-sm font-medium leading-none">{t("materials")}</p>
            <Collapsible
              className="w-full"
              open={materialIsOpen}
              onOpenChange={setMaterialIsOpen}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-green-50">
                  <div className="flex items-center gap-x-4">
                    <Newspaper size={16} />
                    <p className="text-sm font-medium leading-none">
                      {t("materials")}
                    </p>
                  </div>
                  {materialIsOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={`ml-4 flex flex-col gap-y-2 border-l ${materialIsOpen && "mt-2"}`}
              >
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      lengthPath === 2 &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/`)
                    }}
                  >
                    {lengthPath === 2 && <Minus size={12} />}
                    <p className="text-sm font-medium leading-none">
                      {t("all")}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      lastPage === "unprocessed" &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/unprocessed/`)
                    }}
                  >
                    {lastPage === "unprocessed" && <Minus size={12} />}
                    <p className="text-sm font-medium leading-none">
                      {t("unprocessed")}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      lastPage === "processed" &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/processed/`)
                    }}
                  >
                    {lastPage === "processed" && <Minus size={12} />}
                    <p className="text-sm font-medium leading-none">
                      {t("processed")}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      lastPage === "favourites" &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/favourites/`)
                    }}
                  >
                    {lastPage === "favourites" && <Minus size={12} />}
                    <p className="text-sm font-medium leading-none">
                      {t("favorite")}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <div
              className={cn(
                "flex cursor-pointer items-center gap-x-4 p-2",
                lastPage === "notification" &&
                  "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
              )}
              onClick={() => {
                router.push(`/${themeId}/notification`)
              }}
            >
              <Mails size={16} />
              <p className="text-sm font-medium leading-none">
                {t("notification")}
              </p>
            </div>
            <div
              className={cn(
                "flex cursor-pointer items-center gap-x-4 p-2",
                lastPage === "subscribe" &&
                  "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
              )}
              onClick={() => {
                router.push(`/${themeId}/subscribe`)
              }}
            >
              <MailCheck size={16} />
              <p className="text-sm font-medium leading-none">
                {t("subscribe")}
              </p>
            </div>
            <div
              className={cn(
                "flex cursor-pointer items-center gap-x-4 p-2",
                lastPage === "resume-material" &&
                  "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
              )}
              onClick={() => {
                router.push(`/${themeId}/resume-material`)
              }}
            >
              <Trash2 size={16} />
              <p className="text-sm font-medium leading-none">{t("trash")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 px-4">
            <p className="text-sm font-medium leading-none">{t("settings")}</p>
            <Collapsible
              className="w-full"
              open={settingIsOpen}
              onOpenChange={setSettingIsOpen}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-green-50">
                  <div className="flex items-center gap-x-4">
                    <Settings size={16} />
                    <p className="text-sm font-medium leading-none">
                      {t("settings")}
                    </p>
                  </div>
                  {settingIsOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={`ml-4 flex flex-col gap-y-2 border-l ${settingIsOpen && "mt-2"}`}
              >
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      lastPage === "editProfile" &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/edit/editProfile`)
                    }}
                  >
                    {lastPage === "editProfile" && <Minus size={16} />}
                    <p className="text-sm font-medium leading-none">
                      {t("profile")}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      (lastPage === "users" || lastPage === "editUser") &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/users`)
                    }}
                  >
                    {(lastPage === "users" || lastPage === "editUser") && (
                      <Minus size={16} />
                    )}
                    <p className="text-sm font-medium leading-none">
                      {t("users")}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      lastPage === "integration" &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/integration`)
                    }}
                  >
                    {lastPage === "integration" && <Minus size={16} />}
                    <p className="text-sm font-medium leading-none">
                      {t("integration")}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      (lastPage === "rules" || lastPage === "createRule") &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/rules/`)
                    }}
                  >
                    {(lastPage === "rules" || lastPage === "createRule") && (
                      <Minus size={16} />
                    )}
                    <p className="text-sm font-medium leading-none">
                      {t("rules")}
                    </p>
                  </div>
                </div>
                {userPermission?.includes(Permission.CreateTags) && (
                  <div className="ml-2 flex flex-col gap-y-2">
                    <div
                      className={cn(
                        "flex cursor-pointer items-center gap-x-4 p-2",
                        lastPage === "createTag" &&
                          "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                      )}
                      onClick={() => {
                        router.push(`/${themeId}/create/createTag`)
                      }}
                    >
                      {lastPage === "createTag" && <Minus size={16} />}
                      <p className="text-sm font-medium leading-none">
                        {t("createTag")}
                      </p>
                    </div>
                  </div>
                )}
                <div className="ml-2 flex flex-col gap-y-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center gap-x-4 p-2",
                      lastPage === "editTheme" &&
                        "rounded bg-gradient-to-r from-[#0B759D] via-[#1FBABF] to-[#9CEE8C] text-white"
                    )}
                    onClick={() => {
                      router.push(`/${themeId}/edit/editTheme`)
                    }}
                  >
                    {lastPage === "editTheme" && <Minus size={16} />}
                    <p className="text-sm font-medium leading-none">
                      {t("editTheme")}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export { SideNav }
