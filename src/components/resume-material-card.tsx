import React, { useEffect, useState } from "react"
import Image from "next/image"
import { getCookie } from "cookies-next"
import { format } from "date-fns"
import { ListRestart } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { Permission } from "@/lib/store/userSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  id: string
  title: string
  date: string
  text: string
  tags: any
  img: string | null | undefined
  url: string
  src_name: string
  updateTags: () => void
  sentiment: string
  is_favourite: boolean
  is_processed: boolean
  material_type: string
}

const ResumeMaterialCard: React.FC<Props> = ({
  material_type,
  id,
  sentiment,
  title,
  date,
  text,
  tags,
  img,
  url,
  src_name,
  updateTags,
  is_favourite,
  is_processed,
}) => {
  const t = useTranslations()

  const token = getCookie("scano_acess_token")
  const [pending, setPending] = useState<boolean>(true)
  const [photo, setPhoto] = useState<string | null>(null)
  const userPermission = useSelector(
    (state: RootState) => state.userData.user?.permissions
  )

  async function getPhoto(img: string) {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/files/${img}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        setPending(false)
        setPhoto(res.url)
      }
    } catch (e) {
      setPending(false)
      console.error(e)
    }
  }

  async function resumeCard(id: string) {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/trash_bucket/restore_materials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([id]),
        }
      )
      if (res.ok) {
        updateTags()
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (img) {
      getPhoto(img)
    }
  }, [sentiment, img])

  return (
    <div className="flex cursor-pointer items-start gap-x-2">
      <div className="flex w-full items-start justify-between gap-x-4">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-4">
            {material_type && <Badge>{t(material_type)}</Badge>}
            <small>
              {t("source")}:{" "}
              <span className="text-blue-500 underline">{src_name}</span>
            </small>
            <small>
              {t("time")}:{" "}
              <span className="text-blue-500 underline">
                {format(new Date(date), "dd.MM.yyyy HH:mm")}
              </span>
            </small>
            <small className="flex items-center gap-x-1">
              {t("link")}:{" "}
              <a
                href={url}
                target="_blank"
                className="flex h-fit w-32 truncate p-0 text-right text-blue-500 underline"
              >
                {url}
              </a>
            </small>
          </div>
          <div className="flex w-full flex-col items-start gap-y-2">
            <h4 className="text-lg font-semibold">{title}</h4>
            <small className="max-w-96 truncate">{text}</small>
            <Dialog>
              <DialogTrigger>
                <Button variant="link" className="p-0 underline">
                  {t("showAllText")}
                </Button>
              </DialogTrigger>
              <DialogContent
                className="h-1/2 max-w-xl"
                onInteractOutside={() => {}}
              >
                <DialogHeader className="flex w-full flex-row items-center gap-x-4">
                  <h4 className="scroll-m-20 text-xl font-medium tracking-tight">
                    {t("allText")}
                  </h4>
                </DialogHeader>
                <DialogDescription>
                  <ScrollArea className="h-[260px]">
                    <div className="mb-2 flex gap-x-2 border-b pb-2">
                      <small>
                        {t("source")}:{" "}
                        <span className="text-blue-500 underline">
                          {src_name}
                        </span>
                      </small>
                      <small>
                        {t("time")}:{" "}
                        <span className="text-blue-500 underline">
                          {format(new Date(date), "dd.MM.yyyy HH:mm")}
                        </span>
                      </small>
                      <small className="flex items-center gap-x-1">
                        {t("link")}:{" "}
                        <a
                          href={url}
                          target="_blank"
                          className="flex h-fit w-24 truncate p-0 text-right text-blue-500 underline"
                        >
                          {url}
                        </a>
                      </small>
                    </div>
                    {img ? (
                      photo ? (
                        <div className="h-fit w-fit overflow-hidden rounded border border-black">
                          <Image
                            src={photo}
                            alt="material img"
                            width={200}
                            height={150}
                          />
                        </div>
                      ) : (
                        <div></div>
                      )
                    ) : pending ? (
                      <Skeleton className="h-[100px] w-[200px]" />
                    ) : (
                      <div>asd</div>
                    )}
                    {text}
                  </ScrollArea>
                </DialogDescription>
                <DialogFooter>
                  <DialogClose>{t("close")}</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex w-1/4 flex-col items-end gap-y-4">
          <div className="flex items-center gap-x-2">
            {userPermission?.includes(Permission.EditMaterials) && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resumeCard(id)
                      }}
                    >
                      <ListRestart size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("restore")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {img ? (
            photo ? (
              <div className="h-28 w-fit overflow-hidden rounded border border-black">
                <Image
                  src={photo}
                  alt="material img"
                  width={200}
                  height={150}
                />
              </div>
            ) : (
              <div></div>
            )
          ) : pending ? (
            <Skeleton className="h-[100px] w-[200px]" />
          ) : (
            <div>asd</div>
          )}
        </div>
      </div>
    </div>
  )
}

export { ResumeMaterialCard }
