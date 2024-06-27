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
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchDynamicAuthor } from "@/lib/store/thunks/analytic/author/dynamicAuthorThunk"
import { fetchTableAuthor } from "@/lib/store/thunks/analytic/author/tableAuthorThunk"
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
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
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
// import { fetchTableSource } from "@/lib/store/thunks/analytic/source/tableSourceThunk"
import { useToast } from "@/components/ui/use-toast"

export type AuthorsData = {
  checked?: boolean
  name: string
  count: string
  percentage: string
  subscribers: string
  sentiment: {
    positive: string
    neutral: string
    negative: string
  }
}

export function AuthorsTable() {
  const t = useTranslations()
  const path = usePathname()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const token = getCookie("scano_acess_token")
  const data = useSelector((state: RootState) => state.tableAuthor.data)
  const pending = useSelector((state: RootState) => state.tableAuthor.pending)
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

  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [searchText, setSearchText] = useState("")

  const dataWithCheckbox = useMemo(() => {
    return data
      .filter((f: any) => f.name.toLowerCase().includes(searchText))
      .map((item: any) => ({
        ...item,
        checked: selectedAuthors.includes(item.name),
      }))
  }, [data, searchText, selectedAuthors])

  const columns: ColumnDef<AuthorsData>[] = [
    {
      accessorKey: "checked",
      header: "",
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.checked}
          onCheckedChange={(checked: any) => {
            return checked
              ? setSelectedAuthors((prevState) => [
                  ...prevState,
                  row.original.name,
                ])
              : setSelectedAuthors((prevState) =>
                  prevState.filter((f) => f !== row.original.name)
                )
          }}
        />
      ),
    },
    {
      accessorKey: "author",
      header: t("authors"),
      cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
    },
    {
      accessorKey: "message",
      header: t("message"),
      cell: ({ row }) => <div className="capitalize">{row.original.count}</div>,
    },
    {
      accessorKey: "percentage",
      header: "%",
      cell: ({ row }) => (
        <div className="capitalize">
          {parseFloat(row.original.percentage).toFixed(3)} %
        </div>
      ),
    },
    {
      accessorKey: "auditory",
      header: t("auditory"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.subscribers}</div>
      ),
    },
    {
      accessorKey: "positive",
      header: t("positiveNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-primeGreen">
          {row.original.sentiment.positive}
        </div>
      ),
    },
    {
      accessorKey: "negative",
      header: t("negativeNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-red-500">
          {row.original.sentiment.negative}
        </div>
      ),
    },
    {
      accessorKey: "neutral",
      header: t("neutralNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-blue-500">
          {row.original.sentiment.neutral}
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
    dispatch(fetchTableAuthor(themeId, value))
  }

  const fetchPage = () => {
    dispatch(fetchDynamicAuthor(themeId))
    dispatch(fetchTableAuthor(themeId, 1))
  }

  const deleteAuthors = async () => {
    setOpen(false)
    if (!selectedAuthors.length) {
      return toast({
        className: "bg-white",
        variant: "error",
        title: `${t("alert.error")}!`,
        description: t("alert.chooseSources"),
      })
    }
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/${themeId}/analytics/authors/author_analytics_table`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          data
            .map((f: any) => selectedAuthors.includes(f.name) && f.author_id)
            .filter(Boolean)
        ),
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
    if (!selectedAuthors.length) {
      return toast({
        className: "bg-white",
        variant: "error",
        title: `${t("alert.error")}!`,
        description: t("alert.chooseSources"),
      })
    }
    // dispatch(setSources(selectedSources))
    fetchPage()
  }

  useEffect(() => {
    setThemeId(path.split("/")[1])
  }, [path])

  return (
    <div className="w-full rounded border bg-white p-4">
      <div className="flex w-full items-center justify-between py-4">
        <div className="flex w-1/2 items-center gap-x-4">
          <Input
            placeholder={t("searchByAuthor")}
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
                    setSelectedAuthors([])
                    setAllChosen(false)
                  }}
                  variant="outline"
                >
                  {t("clearFilter")}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedAuthors(data.map((item: any) => item.name))
                    setAllChosen(true)
                  }}
                  variant="outline"
                >
                  {t("chooseAll")}
                </Button>
              )}
              {selectedAuthors.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedAuthors.length}/{data?.length}
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
                        item: t("authors"),
                      })}
                    </h4>
                  </DialogHeader>
                  <DialogFooter className="flex items-center gap-x-4">
                    <DialogClose>{t("no")}</DialogClose>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={deleteAuthors}
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
