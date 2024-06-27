"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { usePathname } from "@/navigation"
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
import { getCookie } from "cookies-next"
import { ListVideo, Loader2, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { setSources } from "@/lib/store/materialFilterSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchDynamicSource } from "@/lib/store/thunks/analytic/source/dynamicSourceThunk"
import { fetchMessageSource } from "@/lib/store/thunks/analytic/source/messageSourceThunk"
import { fetchMessageTypeSource } from "@/lib/store/thunks/analytic/source/messageTypeSourceThunk"
import { fetchTableSource } from "@/lib/store/thunks/analytic/source/tableSourceThunk"
import { fetchToneSource } from "@/lib/store/thunks/analytic/source/toneSourceThunk"
import { fetchFilterCountThunk } from "@/lib/store/thunks/filterCountThunk"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { useToast } from "@/components/ui/use-toast"

export type SourceData = {
  checked?: boolean
  name: string
  count: string
  percentage: string
  sentiment: {
    Позитивный: number
    Негативный: number
    Нейтральный: number
  }
}

export function SourceTable() {
  const t = useTranslations()
  const path = usePathname()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const token = getCookie("scano_acess_token")
  const data = useSelector((state: RootState) => state.tableSource.data)
  const pending = useSelector((state: RootState) => state.tableSource.pending)
  const [themeId, setThemeId] = useState<string>("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [allChosen, setAllChosen] = useState(false)
  const [open, setOpen] = useState(false)

  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [searchText, setSearchText] = useState("")

  const dataWithCheckbox = useMemo(() => {
    return data
      .filter((f: any) => f.name.toLowerCase().includes(searchText))
      .map((item: any) => ({
        ...item,
        checked: selectedSources.includes(item.name),
      }))
  }, [data, searchText, selectedSources])

  const columns: ColumnDef<SourceData>[] = [
    {
      accessorKey: "checked",
      header: "",
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.checked}
          onCheckedChange={(checked: any) => {
            return checked
              ? setSelectedSources((prevState) => [
                  ...prevState,
                  row.original.name,
                ])
              : setSelectedSources((prevState) =>
                  prevState.filter((f) => f !== row.original.name)
                )
          }}
        />
      ),
    },
    {
      accessorKey: "source",
      header: t("sources"),
      cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
    },
    {
      accessorKey: "count",
      header: t("message"),
      cell: ({ row }) => <div className="capitalize">{row.original.count}</div>,
    },
    {
      accessorKey: "percentage",
      header: "%",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.percentage}</div>
      ),
    },
    {
      accessorKey: "sentiment",
      header: t("positiveNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-primeGreen">
          {row.original.sentiment.Позитивный}
        </div>
      ),
    },
    {
      accessorKey: "sentiment",
      header: t("negativeNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-red-500">
          {row.original.sentiment.Негативный}
        </div>
      ),
    },
    {
      accessorKey: "sentiment",
      header: t("neutralNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-blue-500">
          {row.original.sentiment.Нейтральный}
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: dataWithCheckbox,
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
      pagination: { pageSize: 50 },
    },
  })

  const onChangePage = (value: number) => {
    dispatch(fetchTableSource(themeId, value))
  }

  const fetchPage = () => {
    dispatch(fetchMessageSource(themeId))
    dispatch(fetchDynamicSource(themeId))
    dispatch(fetchMessageTypeSource(themeId))
    dispatch(fetchToneSource(themeId))
    dispatch(fetchFilterCountThunk(themeId))
    dispatch(fetchTableSource(themeId, 1))
  }

  const deleteSources = async () => {
    setOpen(false)
    if (!selectedSources.length) {
      return toast({
        className: "bg-white",
        variant: "error",
        title: `${t("alert.error")}!`,
        description: t("alert.chooseSources"),
      })
    }
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${themeId}/analytics/sources/source_analytics_table`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedSources),
      }
    )
    if (res.ok) {
      fetchPage()
    } else {
      return toast({
        className: "bg-white",
        variant: "error",
        title: `${t("alert.error")}!`,
      })
    }
  }

  const handlefilter = () => {
    if (!selectedSources.length) {
      return toast({
        className: "bg-white",
        variant: "error",
        title: `${t("alert.error")}!`,
        description: t("alert.chooseSources"),
      })
    }
    dispatch(setSources(selectedSources))
    fetchPage()
  }

  useEffect(() => {
    setThemeId(path.split("/")[1])
  }, [path])
  return (
    <div className="w-full rounded border bg-white p-4">
      <div className="flex w-full items-center justify-between pb-4">
        <div className="flex w-1/2 items-center gap-x-4">
          <Input
            placeholder={t("searchBySource")}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="w-full max-w-xs"
          />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <p className="text-sm text-muted-foreground">
            {t("paginationCount", {
              currentPage: table.getState().pagination.pageIndex + 1,
              totalPage: table.getPageCount(),
            })}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangePage(table.getState().pagination.pageIndex)}
            disabled={table.getState().pagination.pageIndex === 0}
          >
            {t("back")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onChangePage(table.getState().pagination.pageIndex + 2)
            }
            disabled={
              table.getState().pagination.pageIndex + 1 === table.getPageCount()
            }
          >
            {t("next")}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="rounded-md border">
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
                      <p className="scroll-m-20 text-xl tracking-tight">
                        {t("noData")}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-4">
              {allChosen ? (
                <Button
                  onClick={() => {
                    setSelectedSources([])
                    setAllChosen(false)
                  }}
                  variant="outline"
                >
                  {t("clearFilter")}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedSources(data.map((item: any) => item.name))
                    setAllChosen(true)
                  }}
                  variant="outline"
                >
                  {t("chooseAll")}
                </Button>
              )}
              {selectedSources.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedSources.length}/{data?.length}
                </p>
              )}
            </div>
            <div className="flex items-center gap-x-4">
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <Button variant="outline" onClick={handlefilter}>
                      <ListVideo size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("doFilter")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger>
                        <Button variant="outline">
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("delete")}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader className="flex flex-row items-center justify-between">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      {t("confirmDelete", {
                        item: t("sources"),
                      })}
                    </h4>
                  </DialogHeader>
                  <DialogFooter className="flex items-center gap-x-4">
                    <DialogClose>{t("no")}</DialogClose>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={deleteSources}
                    >
                      {t("yes")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
