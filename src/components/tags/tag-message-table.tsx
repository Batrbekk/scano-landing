"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
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
import { getCookie, setCookie } from "cookies-next"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { useSelector } from "react-redux"
import { useLocale, useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import {
  setTableTagData,
  setTableTagPending,
  tagRow,
} from "@/lib/store/analytic/tag/tableTagSlice"
import { RootState, useAppDispatch } from "@/lib/store/store"
import { fetchTagTable } from "@/lib/store/thunks/analytic/tag/tableTagThunk"
import { fetchTags } from "@/lib/store/thunks/tagThunk"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TagMessageTable() {
  const router = useRouter()
  const t = useTranslations()
  const params = useParams()
  const dispatch = useAppDispatch()
  const data = useSelector((state: RootState) => state.tableTag.data)
  const pending = useSelector((state: RootState) => state.tableTag.pending)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const token = useSelector((state: RootState) => state.auth.token)
  const [themeId, setThemeId] = useState<string>("")

  const columns: ColumnDef<tagRow>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2 capitalize">
          <p>{row.index + 1}</p>
        </div>
      ),
    },
    {
      accessorKey: "tag",
      header: t("tags"),
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2 capitalize">
          <p>{row.original.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: t("message"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.materials_count}</div>
      ),
    },
    {
      accessorKey: "action",
      header: t("action"),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                    onClick={() => {
                      setCookie("editTagData", row.original)
                      router.push(`/${themeId}/edit/editTag`)
                    }}
                  >
                    <Pencil size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("edit")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Dialog>
              <DialogTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("delete")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {t("confirmDelete", { item: t("tag") })}
                  </h4>
                </DialogHeader>
                <DialogFooter className="flex items-center gap-x-4">
                  <DialogClose>{t("no")}</DialogClose>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => deleteTag(row.original.id)}
                  >
                    {t("yes")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )
      },
    },
  ]

  async function deleteTag(id: string) {
    dispatch(setTableTagPending(true))
    dispatch(setTableTagData([]))
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/tags/${id}/${themeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (res.ok) {
      dispatch(fetchTagTable(themeId))
    } else {
      dispatch(setTableTagPending(false))
      console.error("delete themes ERROR")
    }
  }

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

  useEffect(() => {
    setThemeId(params.theme_id.toString())
  }, [params])

  return (
    <div className="flex h-full flex-col gap-y-2 rounded border bg-white p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center justify-end gap-x-4">
          <Input
            placeholder={t("searchByTag")}
            value={(table.getColumn("tag")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("tag")?.setFilterValue(event.target.value)
            }
            className="w-full max-w-xs"
          />
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
      <div className="flex items-center justify-end">
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
    </div>
  )
}
