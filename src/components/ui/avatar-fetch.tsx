"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { getCookie } from "cookies-next"
import { UserRound } from "lucide-react"

import { env } from "@/env.mjs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  img_name: string
}

const AvatarFetch: React.FC<Props> = ({ img_name }) => {
  const token = getCookie("scano_acess_token")
  const [currentImg, setCurrentImg] = useState<string | null>(null)
  const [pending, setPending] = useState<boolean>(true)

  const getImg = async () => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/files/${img_name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.ok) {
        setPending(false)
        setCurrentImg(res.url)
      }
    } catch (e) {
      setPending(false)
      console.error(e)
    }
  }

  useEffect(() => {
    if (img_name) {
      getImg()
    } else {
      setPending(false)
    }
  }, [img_name])

  return (
    <Avatar>
      {pending ? (
        <AvatarFallback>
          <Skeleton className="h-12 w-12 rounded-full" />
        </AvatarFallback>
      ) : currentImg ? (
        <div className="bg-g h-9 w-9 overflow-hidden rounded-full">
          <Image src={currentImg} alt="ava" width={40} height={42} />
        </div>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
          <UserRound size={20} />
        </div>
      )}
    </Avatar>
  )
}

export { AvatarFetch }
