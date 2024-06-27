"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "@/navigation"
import { TelegramsData } from "@/types"
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
import {
  ChevronDown,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { Permission } from "@/lib/store/userSlice"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

export type integrationData = {
  id: number
  acc: string
  accType: string
}

interface Props {
  id: string
}

const IntegrationTable: React.FC<Props> = ({ id }) => {
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations()
  const token = getCookie("scano_acess_token")
  const [pending, setPending] = useState<boolean>(true)
  const [data, setdata] = useState<TelegramsData[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const userPermission = useSelector(
    (state: RootState) => state.userData.user?.permissions
  )

  const columns: ColumnDef<TelegramsData>[] = [
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
      accessorKey: "acc",
      header: "ID",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.chat_id}</div>
      ),
    },
    {
      accessorKey: "name",
      header: t("telegramChannel"),
      cell: ({ row }) => <div className="">{row.original.name}</div>,
    },
    {
      id: "actions",
      header: t("action"),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          userPermission?.includes(Permission.DeleteTelegramChannels) && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                    onClick={() => {
                      deleteIntegration(row.original.id)
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("delete")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        )
      },
    },
  ]

  async function deleteIntegration(id: string) {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/subscriptions/telegram_channels/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast({
        variant: "success",
        title: "Успешно!",
        description: "Интеграция успешно удалена",
      })
    } catch (e) {
      console.error(e)
      toast({
        variant: "success",
        title: "Упс!",
        description: "Что-то пошло не так",
      })
    } finally {
      getSubsData()
    }
  }

  async function getSubsData() {
    setPending(true)
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/subscriptions/telegram_channels`,
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
      setdata(data)
      setPending(false)
    } else {
      setPending(false)
      console.error("Get themes data ERROR")
    }
  }

  useEffect(() => {
    if (token) {
      getSubsData()
    }
  }, [token])

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
    <div className="w-full">
      <div className="flex w-full items-center justify-between pb-4">
        <div className="flex w-1/2 items-center gap-x-4">
          <Input
            placeholder={t("searchTheme")}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-64"
          />
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
  )
}

export { IntegrationTable }
