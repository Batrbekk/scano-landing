import React, { useState } from "react"
import { Check, ChevronUp, X } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { RootState } from "@/lib/store/store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"

export interface ExcludedSource {
  _id: string
  source_type: string
  url: string
}

interface ComboboxSourceProps {
  name?: string
  excludedList: ExcludedSource[]
  chooseList: ExcludedSource[]
  onItemSelect: (item: ExcludedSource) => void
  onItemRemove: (id: string) => void
}

const ComboboxSource: React.FC<ComboboxSourceProps> = ({
  name,
  chooseList,
  onItemSelect,
  onItemRemove,
  excludedList,
}) => {
  const t = useTranslations()
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState("")

  const onChangeSearch = (value: string) => {
    setShow(true)
    setSearch(value)
  }

  return (
    <Command
      filter={(value, search) => {
        if (value.includes(search)) return 1
        return 0
      }}
    >
      <Label className="mb-2">{name || t("excludeSrc")}</Label>
      <CommandInput
        value={search}
        onValueChange={onChangeSearch}
        placeholder={t("mainCreateTheme.excludedUrl")}
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {chooseList.map((item) => (
          <Badge
            key={item._id}
            className="flex cursor-pointer items-center gap-x-2 hover:bg-blue-500"
            onClick={(e) => {
              e.stopPropagation()
              onItemRemove(item._id)
            }}
          >
            {item.url}
            <X size={14} />
          </Badge>
        ))}
      </div>
      {show && (
        <CommandList className="mt-2 rounded border p-2">
          <Button
            variant="ghost"
            onClick={() => {
              setShow(false)
            }}
            className="flex w-full justify-center gap-x-2 text-sm"
          >
            {t("mainCreateTheme.hideList")}
            <ChevronUp size={16} />
          </Button>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={t("srcFilterTab")}>
            {excludedList.map((item) => (
              <CommandItem
                key={item._id}
                className={cn(
                  `${chooseList.some((x) => x._id === item._id) ? "bg-blue-50 text-blue-500" : ""}`
                )}
                onClick={() => onItemSelect(item)}
              >
                {item.url}
                {chooseList.some((x) => x._id === item._id) && (
                  <Check size={16} />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  )
}

export { ComboboxSource }
