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
  ArrowUpDown,
  ChevronDown,
  Copy,
  Loader2,
  MoreHorizontal,
  PauseCircle,
  Pencil,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TonalityChart } from "@/components/ui/tonality-chart"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type SourceData = {
  id: number
  country: string
  message: string
  percentage: string
  positive: string
  neutral: string
  negative: string
}

export function CountryTable() {
  const t = useTranslations()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const data: SourceData[] = [
    {
      id: 1,
      country: "Казахстан",
      message: "78",
      percentage: "1,89%",
      positive: "21",
      neutral: "51",
      negative: "6",
    },
    {
      id: 2,
      country: "Россия",
      message: "78",
      percentage: "1,89%",
      positive: "21",
      neutral: "51",
      negative: "6",
    },
    {
      id: 3,
      country: "США",
      message: "78",
      percentage: "1,89%",
      positive: "21",
      neutral: "51",
      negative: "6",
    },
    {
      id: 4,
      country: "Китай",
      message: "78",
      percentage: "1,89%",
      positive: "21",
      neutral: "51",
      negative: "6",
    },
    {
      id: 5,
      country: "Грузия",
      message: "78",
      percentage: "1,89%",
      positive: "21",
      neutral: "51",
      negative: "6",
    },
  ]

  const columns: ColumnDef<SourceData>[] = [
    {
      accessorKey: "_id",
      header: "#",
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2 capitalize">
          <p>{row.original.id}</p>
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: t("country"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.country}</div>
      ),
    },
    {
      accessorKey: "message",
      header: t("message"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.message}</div>
      ),
    },
    {
      accessorKey: "percentage",
      header: "%",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.percentage}</div>
      ),
    },
    {
      accessorKey: "positive",
      header: t("positiveNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-primeGreen">
          {row.original.positive}
        </div>
      ),
    },
    {
      accessorKey: "negative",
      header: t("negativeNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-red-500">{row.original.negative}</div>
      ),
    },
    {
      accessorKey: "neutral",
      header: t("neutralNotation"),
      cell: ({ row }) => (
        <div className="capitalize text-blue-500">{row.original.neutral}</div>
      ),
    },
  ]

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
    <div className="h-full rounded border bg-white p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-1/2 items-center gap-x-4">
          <Input
            placeholder={t("searchByCountry")}
            value={
              (table.getColumn("country")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("country")?.setFilterValue(event.target.value)
            }
            className="w-full max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t("show")} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="normal-case"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {t(`${column.id}`)}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-end space-x-4 py-4">
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
                  <p className="scroll-m-20 text-xl tracking-tight">
                    {t("noData")}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
