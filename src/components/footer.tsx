"use client"

import { useTranslations } from "use-intl"

import { Button } from "@/components/ui/button"

const Footer = () => {
  const t = useTranslations()

  return (
    <div className="fixed bottom-0 z-50 flex h-16 w-screen flex-row-reverse items-center justify-between border-t bg-white px-2 md:w-full md:flex-row md:px-4">
      <h2 className="md:text-md text-xs text-muted-foreground">
        © 2024 Infinity Enterprises
      </h2>
      <Button
        variant="link"
        className="md:text-md p-0 text-xs text-inko hover:text-blue-500"
      >
        {t("technicalSupport")}
      </Button>
    </div>
  )
}

export { Footer }
