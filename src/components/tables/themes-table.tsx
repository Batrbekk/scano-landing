"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "@/navigation"
import { ThemeData } from "@/types"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { getCookie, setCookie } from "cookies-next"
import { format } from "date-fns"
import {
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  Copy,
  ListX,
  Loader2,
  MessageCirclePlusIcon,
  PauseCircle,
  Pencil,
  PlayCircle,
  Search,
  Trash2,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { Permission } from "@/lib/store/userSlice"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemePieChart } from "@/components/themes/themePieChart"

export function ThemesTable() {
  const router = useRouter()
  const t = useTranslations()
  const token = getCookie("scano_acess_token")
  const [pending, setPending] = useState<boolean>(true)

  const chartPeriod = [
    {
      value: "today",
      label: t("today"),
    },
    {
      value: "week",
      label: t("week"),
    },
    {
      value: "total",
      label: t("all"),
    },
  ]

  const [rowSelection, setRowSelection] = useState<any>({})
  const [data, setData] = useState<ThemeData[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [chartPeriodValue, setChartPeriodValue] = useState<string>(
    chartPeriod[0].value
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [today, setToday] = useState<any>([])
  const [week, setWeek] = useState<any>([])
  const [all, setAll] = useState<any>([])
  const userPermission = useSelector(
    (state: RootState) => state.userData.user?.permissions
  ) as any

  const [currentData, setCurrentData] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState("")

  const columns: ColumnDef<ThemeData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("themeName")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-4">
            <Button
              className="flex items-center gap-x-2 p-0"
              variant="link"
              onClick={() => {
                setCookie("themeName", row.original.name)
                router.push(`/${row.original._id}`)
              }}
            >
              <h4
                className={`cursor-pointer scroll-m-20 text-lg font-semibold capitalize tracking-tight ${row.original.is_active ? "text-blue-500 underline" : ""}`}
              >
                {row.getValue("name")}
              </h4>
              {row.original.is_active && (
                <ArrowRight size={14} className="text-blue-500" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-x-4">
            {row.original.is_active ? (
              <p className="leading-7">
                {t("collectionDate")}
                <span className="ml-1 font-semibold text-blue-500">
                  {format(new Date(row.original.created_at), "dd/MM/yyyy")}
                </span>
              </p>
            ) : (
              <p className="leading-7">{t("pauseThemeDate")}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "theme_type",
      header: t("themeType"),
      cell: ({ row }) => (
        <div className="cursor-pointer capitalize">
          <Badge
            className={cn(
              "border bg-white",
              t(`${row.getValue("theme_type")}`) === t("all") &&
                "border-teal-600 text-teal-500",
              t(`${row.getValue("theme_type")}`) === t("news") &&
                "border-cyan-600 text-cyan-500",
              t(`${row.getValue("theme_type")}`) === t("social") &&
                "border-blue-600 text-blue-500"
            )}
          >
            {t(`${row.getValue("theme_type")}`)}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: t("action"),
      enableHiding: false,
      cell: ({ row }) => {
        const theme = row.original

        return (
          <div className="flex items-center gap-x-2">
            {userPermission?.includes(Permission.EditThemes) && (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <Button
                      onClick={() => {
                        if (theme.is_active) {
                          isActiveTheme(theme._id, "pause")
                        } else {
                          isActiveTheme(theme._id, "resume")
                        }
                      }}
                      className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      variant="outline"
                    >
                      {theme.is_active ? (
                        <PauseCircle size={14} />
                      ) : (
                        <PlayCircle size={14} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {theme.is_active ? t("stop") : t("resume")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {userPermission?.includes(Permission.EditThemes) && (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <Button
                      onClick={() => {
                        setCookie("themeName", row.original.name)
                        router.push(`/${theme._id}/edit/editTheme`)
                      }}
                      className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      variant="outline"
                    >
                      <Pencil size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("edit")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {userPermission?.includes(Permission.DeleteThemes) && (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <Button
                      onClick={() => {
                        setOpen(true)
                        setSelectedId(theme._id)
                      }}
                      className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      variant="outline"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("delete")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )
      },
    },
  ]

  async function getThemesData() {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setData(data.items)
        setCurrentTheme(data.items[0])
        setPending(false)
        localStorage.setItem("themeList", JSON.stringify(data.items))
      }
    } catch (e) {
      setPending(false)
      console.error("Get themes data ERROR")
    } finally {
      setPending(false)
    }
  }

  async function deleteTheme() {
    setPending(true)
    setData([])
    setOpen(false)
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${selectedId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (res.ok) {
      setSelectedId("")
      getThemesData()
    } else {
      setPending(false)
      console.error("delete themes ERROR")
    }
  }

  async function isActiveTheme(id: string, condition: string) {
    setPending(true)
    setData([])
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${id}/${condition}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      getThemesData()
    }
  }

  const setCurrentTheme = (theme: any) => {
    setRowSelection(theme)

    const today = Object.keys(theme.today)
      .filter((key) => key !== "total")
      .map((key) => {
        return {
          name: t(key),
          y: theme.today[key],
          color:
            (key === "positive" && "#0FAF62") ||
            (key === "neutral" && "#005CE8") ||
            (key === "negative" && "#EB5757"),
        }
      })
    const week = Object.keys(theme.week)
      .filter((key) => key !== "total")
      .map((key) => {
        return {
          name: t(key),
          y: theme.week[key],
          color:
            (key === "positive" && "#0FAF62") ||
            (key === "neutral" && "#005CE8") ||
            (key === "negative" && "#EB5757"),
        }
      })
    const total = Object.keys(theme.total)
      .filter((key) => key !== "total")
      .map((key) => {
        return {
          name: t(key),
          y: theme.total[key],
          color:
            (key === "positive" && "#0FAF62") ||
            (key === "neutral" && "#005CE8") ||
            (key === "negative" && "#EB5757"),
        }
      })

    setToday(today)
    setWeek(week)
    setAll(total)
  }

  useEffect(() => {
    getThemesData()
  }, [])

  useEffect(() => {
    if (chartPeriodValue === "today") {
      setCurrentData(today)
    } else if (chartPeriodValue === "week") {
      setCurrentData(week)
    } else if (chartPeriodValue === "total") {
      setCurrentData(all)
    }
  }, [chartPeriodValue, today, week, all])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: { pageSize: 5 },
    },
  })
  return (
    <>
      <div className="mb-20 flex w-full flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex w-1/2 items-center justify-between">
            <Input
              placeholder={t("searchTheme")}
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-64"
            />
            <div className="flex items-center gap-x-2">
              <p className="text-sm text-muted-foreground">
                {t("paginationCount", {
                  currentPage: table.getState().pagination.pageIndex + 1,
                  totalPage: table.getPageCount(),
                })}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {t("back")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {t("next")}
              </Button>
            </div>
          </div>
          <div className="flex w-1/2 items-center justify-end gap-x-4">
            {userPermission?.includes(Permission.CreateThemes) && (
              <Button
                className="flex cursor-pointer items-center gap-x-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                variant="outline"
                onClick={() => {
                  router.push("/main/create-theme")
                }}
              >
                <MessageCirclePlusIcon className="h-4 w-4" />
                {t("createTheme")}
              </Button>
            )}
            <Button
              variant="outline"
              className="flex cursor-pointer items-center gap-x-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              onClick={() => {
                router.push("/main/search-archive")
              }}
            >
              <Search className="h-4 w-4" />
              {t("searchByYear")}
            </Button>
          </div>
        </div>
        <div className="flex items-stretch gap-x-4">
          <div className="w-1/2 rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className={`
                                cursor-pointer 
                                ${row.original.is_active ? "hover:bg-blue-50" : "bg-muted"} 
                                ${row.original._id === rowSelection._id && "bg-blue-50"}
                              `}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        setCurrentTheme(row.original)
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {pending ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                        </div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <ListX size={32} />
                          <p className="scroll-m-20 text-xl tracking-tight">
                            {t("noData")}
                          </p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="w-1/2 rounded-md border p-4">
            {data.length > 0 ? (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="w-[220px] min-w-[220px] max-w-[220px] scroll-m-20 text-xl font-semibold capitalize tracking-tight">
                    {rowSelection.name}
                  </h4>
                  <div className="flex w-full items-center gap-x-4">
                    <p>{t("mainPage.materialCount")}:</p>
                    <p className="text-blue-500">
                      {rowSelection[chartPeriodValue].total}
                    </p>
                  </div>
                  <Select
                    value={chartPeriodValue}
                    onValueChange={setChartPeriodValue}
                  >
                    <SelectTrigger className="w-[144px]">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {chartPeriod.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <ThemePieChart data={currentData} />
              </>
            ) : pending ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <ListX size={32} />
                <p className="scroll-m-20 text-xl tracking-tight">
                  {t("noData")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="flex flex-row items-center justify-between">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {t("confirmDelete", { item: t("theme-s") })}
            </h4>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-x-4">
            <DialogClose>{t("no")}</DialogClose>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={deleteTheme}
            >
              {t("yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
