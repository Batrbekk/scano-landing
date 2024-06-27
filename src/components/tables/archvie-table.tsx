"use client"

import * as React from "react"
import { useEffect, useState } from "react"
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
import { format } from "date-fns"
import { ChevronDown, Download, Loader2, Trash2 } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type archiveData = {
  _id: string
  created_at: string
  document_id: string
  report_period: string
  format: string
  theme: {
    id: string
    name: string
  }
  user: {
    first_name: string
    last_name: string
    email: string
    organization_id: string
    company_name: string
  }
}

export function ArchiveTable() {
  const t = useTranslations()
  const path = usePathname()
  const token = useSelector((state: RootState) => state.auth.token)
  const [themeId, setThemeId] = useState<string>("")
  const [pending, setPending] = useState<boolean>(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = useState<archiveData[]>([])
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState("")

  const columns: ColumnDef<archiveData>[] = [
    {
      accessorKey: "_id",
      header: "#",
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2 capitalize">
          <p>{row.index + 1}</p>
        </div>
      ),
    },
    {
      accessorKey: "created",
      header: t("createdTime"),
      cell: ({ row }) => (
        <div className="capitalize">
          {format(row.original.created_at, "yyyy-MM-dd/HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "theme",
      header: t("theme"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.theme.name}</div>
      ),
    },
    {
      accessorKey: "period",
      header: t("period"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.report_period}</div>
      ),
    },
    {
      accessorKey: "format",
      header: t("format"),
      cell: ({ row }) => (
        <div className="capitalize">
          <Badge
            className={`
                            ${row.original.format.toUpperCase() === "DOCX" && "bg-blue-500"} 
                            ${row.original.format.toUpperCase() === "PDF" && "bg-red-500"}
                            ${row.original.format.toUpperCase() === "XLSX" && "bg-green-500"}
                        `}
          >
            {row.original.format.toUpperCase()}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "initiator",
      header: t("reportCreator"),
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.user.last_name} {row.original.user.first_name}
        </div>
      ),
    },
    {
      id: "actions",
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
                      getExport(row.original.document_id)
                    }}
                  >
                    <Download size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("download")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() => {
                      setOpen(true)
                      setSelectedId(row.original._id)
                    }}
                    variant="outline"
                    className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    <Trash2 size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("delete")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
      pagination: { pageSize: 10 },
    },
  })

  async function getData() {
    setData([])
    setPending(true)
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/report_archives`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (res.ok) {
      const data = await res.json()
      setData(data)
      setPending(false)
    } else {
      setPending(false)
      console.error("Get data ERROR")
    }
  }

  function getFileExtension(filename: string) {
    // Ensure the filename is a string and contains at least one dot.
    if (filename.indexOf(".") === -1) {
      return ""
    }

    // Split the filename by dot and return the last part.
    const parts = filename.split(".")
    return parts[parts.length - 1]
  }

  const getExport = async (id: string) => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/files/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "arraybuffer",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          try {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `report.${getFileExtension(id) === "word" ? "doc" : getFileExtension(id)}`
            document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click()
            a.remove()
          } catch (e) {
            console.log(e)
          }
        })
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteReport() {
    setPending(true)
    setData([])
    setOpen(false)
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/themes/report_archives/${selectedId}`,
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
      getData()
    } else {
      setPending(false)
      console.error("delete themes ERROR")
    }
  }

  useEffect(() => {
    setThemeId(path.split("/")[1])
  }, [path])

  useEffect(() => {
    if (themeId) {
      getData()
    }
  }, [themeId])
  return (
    <>
      <div className="mb-20 w-full">
        <div className="flex w-full items-center justify-between pb-4">
          <div className="flex w-1/2 items-center gap-x-4">
            <Input
              placeholder={t("searchByTheme")}
              value={
                (table.getColumn("theme")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("theme")?.setFilterValue(event.target.value)
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
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="flex flex-row items-center justify-between">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {t("confirmDelete", { item: t("report") })}
            </h4>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-x-4">
            <DialogClose>{t("no")}</DialogClose>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={deleteReport}
            >
              {t("yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
