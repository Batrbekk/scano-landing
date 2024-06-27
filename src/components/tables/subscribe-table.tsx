"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "@/navigation"
import { NotificationData, SubscribeData, UserData } from "@/types"
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
  PlayCircle,
  Trash2,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { Permission } from "@/lib/store/userSlice"
import { AvatarFetch } from "@/components/ui/avatar-fetch"
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

interface Props {
  id: string
}

const SubscribeTable: React.FC<Props> = ({ id }) => {
  const router = useRouter()
  const t = useTranslations()
  const token = getCookie("scano_acess_token")
  const [pending, setPending] = useState<boolean>(true)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = useState<SubscribeData[]>([])
  const userPermission = useSelector(
    (state: RootState) => state.userData.user?.permissions
  )

  const columns: ColumnDef<SubscribeData>[] = [
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
      accessorKey: "theme",
      header: t("theme"),
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.original.theme.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "file_format_types",
      header: t("format"),
      cell: ({ row }) => (
        <div className="capitalize">
          <ul className="list-none">
            {row.original.file_format_types.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      accessorKey: "email_list",
      header: "E-mail",
      cell: ({ row }) => (
        <div className="capitalize">
          <ul className="list-none">
            {row.original.emails.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      accessorKey: "header",
      header: t("header"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.header}</div>
      ),
    },
    {
      accessorKey: "subheader",
      header: t("subheader"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.subheader}</div>
      ),
    },
    {
      id: "actions",
      header: t("action"),
      enableHiding: false,
      cell: ({ row }) => {
        const notif = row.original

        return (
          <div className="flex items-center gap-x-2">
            {userPermission?.includes(Permission.EditSubscriptions) && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      onClick={() => {
                        setCookie("editSubsData", notif)
                        router.push(`/${id}/edit/editSubs`)
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("edit")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {userPermission?.includes(Permission.DeleteSubscriptions) && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      onClick={() => deleteSubs(notif.id)}
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

  async function getSubsData() {
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/subscriptions/`,
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
      console.error("Get subs data ERROR")
    }
  }

  async function deleteSubs(id: string) {
    setPending(true)
    setData([])
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/subscriptions/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (res.ok) {
      getSubsData()
    } else {
      setPending(false)
      getSubsData()
      console.error("delete notif ERROR")
    }
  }

  useEffect(() => {
    getSubsData()
  }, [])

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
      <div className="flex w-full items-center justify-between py-4">
        <div className="flex w-1/2 items-center gap-x-4">
          {userPermission?.includes(Permission.CreateSubscriptions) && (
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => {
                router.push(`/${id}/create/createSubs`)
              }}
            >
              {t("createSubs")}
            </Button>
          )}
          <Input
            placeholder={t("searchByTheme")}
            value={(table.getColumn("theme")?.getFilterValue() as string) ?? ""}
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
                    <TableCell key={cell.id} className="align-top">
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

export { SubscribeTable }
