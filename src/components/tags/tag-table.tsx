"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "@/navigation"
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
import { ChevronDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useTranslations } from "use-intl"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type TagData = {
  tag: string
  message: string
  percentage: string
  auditory: string
  involve: string
  positive: string
  neutral: string
  negative: string
  loyal: string
}

export function TagTable() {
  const router = useRouter()
  const t = useTranslations()
  const path = usePathname()
  const [themeId, setThemeId] = useState<string>("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  useEffect(() => {
    setThemeId(path.split("/")[1])
  }, [path])

  const data: TagData[] = [
    {
      tag: "Начальство",
      message: "78",
      percentage: "6",
      auditory: "928",
      involve: "321",
      positive: "21",
      neutral: "51",
      negative: "6",
      loyal: "2.3",
    },
    {
      tag: "Подчиненные",
      message: "78",
      percentage: "6",
      auditory: "928",
      involve: "321",
      positive: "21",
      neutral: "51",
      negative: "6",
      loyal: "3.2",
    },
  ]

  const columns: ColumnDef<TagData>[] = [
    {
      accessorKey: "tag",
      header: t("tags"),
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2 capitalize">
          <p>{row.original.tag}</p>
        </div>
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
      accessorKey: "auditory",
      header: t("auditory"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.auditory}</div>
      ),
    },
    {
      accessorKey: "involve",
      header: t("involve"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.involve}</div>
      ),
    },
    {
      accessorKey: "positive",
      header: t("positiveNotation"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.positive}</div>
      ),
    },
    {
      accessorKey: "negative",
      header: t("negativeNotation"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.negative}</div>
      ),
    },
    {
      accessorKey: "neutral",
      header: t("neutralNotation"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.neutral}</div>
      ),
    },
    {
      accessorKey: "loyal",
      header: t("loyal"),
      cell: ({ row }) => <div className="capitalize">{row.original.loyal}</div>,
    },
    {
      accessorKey: "action",
      header: t("action"),
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer gap-x-2">
                <Pencil size={14} />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-x-2">
                <Trash2 size={14} />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
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
    <div className="h-full rounded border p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-1/2 items-center gap-x-4">
          <Button
            onClick={() => {
              router.push(`/${themeId}/create/createTag`)
            }}
          >
            {t("createTag")}
          </Button>
          <Input
            placeholder={t("searchByTag")}
            value={(table.getColumn("tag")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("tag")?.setFilterValue(event.target.value)
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
