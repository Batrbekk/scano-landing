import React from "react"
import { differenceInDays, format, parseISO } from "date-fns"
import { enUS, kk, ru } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { isMobile } from "react-device-detect"
import { useSelector } from "react-redux"
import { useLocale, useTranslations } from "use-intl"

import { setChartPeriod } from "@/lib/store/analytic/chartPeriodSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import {
  setEndDateStore,
  setRangeData,
  setStartDateStore,
} from "@/lib/store/timeFilterSlice"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

// Добавляем новый тип пропса для CustomCalendar
interface CustomCalendarProps {
  onDatesUpdated?: () => void // Необязательная функция, которая будет вызываться после обновления дат
}

const CustomCalendar = ({ onDatesUpdated }: CustomCalendarProps) => {
  const t = useTranslations()
  const locale = useLocale()
  const dispatch = useAppDispatch()

  const [popoverOpen, setPopoverOpen] = React.useState(false)

  // Используем селекторы для получения данных из Redux store
  const storedStartDate = useSelector(
    (state: RootState) => state.timeFilter.startDate
  )
  const storedEndDate = useSelector(
    (state: RootState) => state.timeFilter.endDate
  )

  // Форматирование дат из store для начального состояния
  const [startDate, setStartDate] = React.useState<DateRange | undefined>({
    from: storedStartDate ? new Date(storedStartDate.split("T")[0]) : undefined,
    to: storedEndDate ? new Date(storedEndDate.split("T")[0]) : undefined,
  })
  const [startHour, setStartHour] = React.useState(
    storedStartDate ? storedStartDate.split("T")[1].slice(0, 5) : "00:00"
  )
  const [endHour, setEndHour] = React.useState(
    storedEndDate ? storedEndDate.split("T")[1].slice(0, 5) : "00:00"
  )

  const getLocale = () => {
    switch (locale) {
      case "ru":
        return ru
      case "kk":
        return kk
      case "en":
        return enUS
      default:
        return ru
    }
  }

  const handleSubmit = () => {
    const formattedStartDate =
      startDate && startDate.from
        ? format(startDate.from, "yyyy-MM-dd") + "T" + startHour + ":00"
        : null
    const formattedEndDate =
      startDate && startDate.to
        ? format(startDate.to, "yyyy-MM-dd") + "T" + endHour + ":00"
        : null

    // Dispatch actions to update store
    dispatch(setStartDateStore(formattedStartDate))
    dispatch(setEndDateStore(formattedEndDate))

    if (formattedStartDate && formattedEndDate) {
      const start = parseISO(formattedStartDate)
      const end = parseISO(formattedEndDate)
      const daysDifference = differenceInDays(end, start)
      if (daysDifference > 7) {
        dispatch(setChartPeriod("week"))
      }
      if (daysDifference <= 7) {
        dispatch(setChartPeriod("day"))
      }
      if (daysDifference >= 30) {
        dispatch(setChartPeriod("month"))
      }
      if (daysDifference <= 1) {
        dispatch(setChartPeriod("hour"))
      }
      dispatch(setRangeData(daysDifference))
    }

    setPopoverOpen(false)

    if (onDatesUpdated) {
      onDatesUpdated()
    }
  }

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setTime: React.Dispatch<React.SetStateAction<string>>
  ) => {
    let value = event.target.value
    // Удаляем все кроме цифр и двоеточия
    value = value.replace(/[^0-9:]/g, "")

    // Управляем логикой добавления и удаления двоеточия
    const numbersOnly = value.replace(/:/g, "")
    if (numbersOnly.length <= 2) {
      value = numbersOnly.slice(0, 2)
    } else {
      value = numbersOnly.slice(0, 2) + ":" + numbersOnly.slice(2, 4)
    }

    // Устанавливаем время, если оно соответствует одному из разрешенных форматов
    if (/^(\d{0,2}):?(\d{0,2})?$/.test(value) || value === "") {
      setTime(value)
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // При фокусе, если текущее значение — 00:00, очищаем поле для нового ввода
    if (event.target.value === "00:00") {
      event.target.value = ""
    }
  }

  return (
    <Dialog open={popoverOpen} onOpenChange={setPopoverOpen}>
      <DialogTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className="w-full justify-between text-left font-normal md:w-[300px]"
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
        </Button>
      </DialogTrigger>
      <DialogContent className="h-auto w-screen rounded p-2 md:h-fit md:w-full md:max-w-2xl md:p-4">
        <ScrollArea>
          <div className="flex flex-col gap-y-2">
            <p className="text-lg font-medium">{t("calendar")}</p>
            <div className="flex max-w-full items-center">
              <Input
                type="text"
                onFocus={handleFocus}
                value={startHour}
                onChange={(e) => handleTimeChange(e, setStartHour)}
                className="input input-bordered"
                placeholder="00:00"
                maxLength={5}
              />
              <p className="mx-4">-</p>
              <Input
                type="text"
                onFocus={handleFocus}
                value={endHour}
                onChange={(e) => handleTimeChange(e, setEndHour)}
                className="input input-bordered"
                placeholder="00:00"
                maxLength={5}
              />
            </div>
            <div className="flex items-center justify-center">
              <Calendar
                locale={getLocale()}
                initialFocus
                mode="range"
                defaultMonth={startDate?.from}
                selected={startDate}
                onSelect={setStartDate}
                numberOfMonths={isMobile ? 1 : 2}
              />
            </div>
            <div className="flex items-center justify-end">
              <Button
                variant="outline"
                onClick={handleSubmit}
                className="mt-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                {t("apply")}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export { CustomCalendar }
