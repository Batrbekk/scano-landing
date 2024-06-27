import React, { useState } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import {
  setEndDateArchiveStore,
  setStartDateArchiveStore,
} from "@/lib/store/archiveTimeSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const ArchiveCalendar = () => {
  const t = useTranslations()
  const dispatch = useAppDispatch()

  const [popoverOpen, setPopoverOpen] = useState(false)

  const storedStartDate = useSelector(
    (state: RootState) => state.archiveTime.startDate
  )
  const storedEndDate = useSelector(
    (state: RootState) => state.archiveTime.endDate
  )

  const [startDate, setStartDate] = useState<DateRange | undefined>({
    from: storedStartDate ? new Date(storedStartDate.split("T")[0]) : undefined,
    to: storedEndDate ? new Date(storedEndDate.split("T")[0]) : undefined,
  })
  const [startHour, setStartHour] = useState(
    storedStartDate ? storedStartDate.split("T")[1].slice(0, 5) : "00:00"
  )
  const [endHour, setEndHour] = useState(
    storedEndDate ? storedEndDate.split("T")[1].slice(0, 5) : "00:00"
  )

  const handleSubmit = () => {
    const formattedStartDate =
      startDate && startDate.from
        ? format(startDate.from, "yyyy-MM-dd") + "T" + startHour + ":00"
        : null
    const formattedEndDate =
      startDate && startDate.to
        ? format(startDate.to, "yyyy-MM-dd") + "T" + endHour + ":00"
        : null

    dispatch(setStartDateArchiveStore(formattedStartDate))
    dispatch(setEndDateArchiveStore(formattedEndDate))

    setPopoverOpen(false)
  }

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setTime: React.Dispatch<React.SetStateAction<string>>
  ) => {
    let value = event.target.value
    value = value.replace(/[^0-9:]/g, "")

    const numbersOnly = value.replace(/:/g, "")
    if (numbersOnly.length <= 2) {
      value = numbersOnly.slice(0, 2)
    } else {
      value = numbersOnly.slice(0, 2) + ":" + numbersOnly.slice(2, 4)
    }

    if (/^(\d{0,2}):?(\d{0,2})?$/.test(value) || value === "") {
      setTime(value)
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "00:00") {
      event.target.value = ""
    }
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className="w-full justify-between text-left font-normal"
        >
          {startDate?.from ? (
            <p className="w-[95%] truncate">
              {startDate.from
                ? `${format(startDate.from, "dd-MM-yyyy")}/${startHour}`
                : ""}{" "}
              {startDate.to ? "~" : ""}{" "}
              {startDate.to
                ? `${format(startDate.to, "dd-MM-yyyy")}/${endHour}`
                : ""}
            </p>
          ) : (
            <span className="text-muted-foreground">
              {t("mainArchive.periodArchiveCalendar")}
            </span>
          )}
          <CalendarIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex items-center">
          <Input
            type="text"
            onFocus={handleFocus}
            value={startHour}
            onChange={(e) => handleTimeChange(e, setStartHour)}
            className="input input-bordered w-fit"
            placeholder="00:00"
            maxLength={5}
          />
          <p className="mx-4">-</p>
          <Input
            type="text"
            onFocus={handleFocus}
            value={endHour}
            onChange={(e) => handleTimeChange(e, setEndHour)}
            className="input input-bordered w-fit"
            placeholder="00:00"
            maxLength={5}
          />
        </div>
        <Calendar
          locale={ru}
          initialFocus
          mode="range"
          defaultMonth={startDate?.from}
          selected={startDate}
          onSelect={setStartDate}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            onClick={handleSubmit}
            className="mt-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            {t("apply")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { ArchiveCalendar }
