"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "@/navigation"
import { UserData } from "@/types"
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

const UsersTable: React.FC<Props> = ({ id }) => {
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
  const [data, setData] = useState<UserData[]>([])
  const userPermission = useSelector(
    (state: RootState) => state.userData.user?.permissions
  )

  const columns: ColumnDef<UserData>[] = [
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
      accessorKey: "photo_url",
      header: t("photo_url"),
      cell: ({ row }) => (
        <div className="cursor-pointer capitalize">
          <AvatarFetch img_name={row.original.photo_url} />
        </div>
      ),
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("full_name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{row.original.full_name}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("email")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">
          <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
        </div>
      ),
    },
    {
      accessorKey: "company_name",
      header: t("company_name"),
      cell: ({ row }) => (
        <div className="capitalize">
          <p>
            {row.original.company_name
              ? row.original.company_name
              : t("nothing")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("role")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">
          <p>{t(row.original.role)}</p>
        </div>
      ),
    },
    {
      id: "actions",
      header: t("action"),
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center gap-x-2">
            {userPermission?.includes(Permission.EditUser) && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      onClick={() => {
                        setCookie("editUserData", user)
                        router.push(`/${id}/edit/editUser`)
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("edit")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {userPermission?.includes(Permission.DeleteUsers) &&
              row.original.role !== "moderator" && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("delete")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            {userPermission?.includes(Permission.DeleteModerator) &&
              row.original.role === "moderator" && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("delete")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            {userPermission?.includes(Permission.EditUser) && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      className="h-fit p-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                      onClick={() => isActiveUser(user.id, user.is_active)}
                    >
                      {user.is_active ? (
                        <PauseCircle size={14} />
                      ) : (
                        <PlayCircle size={14} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user.is_active ? t("stop") : t("resume")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )
      },
    },
  ]

  async function getUsersData() {
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.ok) {
      let rawData = (await res.json()) as UserData[]
      let enrichedData = rawData.map((user: UserData) => ({
        ...user,
        full_name: `${user.first_name} ${user.last_name}`,
      }))
      setData(enrichedData)
      setPending(false)
    } else {
      setPending(false)
      console.error("Get themes data ERROR")
    }
  }

  async function deleteUser(id: string) {
    setPending(true)
    setData([])
    const res = await fetch(`${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.ok) {
      getUsersData()
    } else {
      setPending(false)
      console.error("delete themes ERROR")
    }
  }

  async function isActiveUser(id: string, status: boolean) {
    setPending(true)
    setData([])
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SCANO_API}/api/v1/users/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_active: !status,
          }),
        }
      )
    } catch (e) {
      console.error("ban user ERROR")
    } finally {
      setPending(false)
      getUsersData()
    }
  }

  useEffect(() => {
    getUsersData()
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
          {userPermission?.includes(Permission.NewUser) && (
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => {
                router.push(`/${id}/create/createUser`)
              }}
            >
              {t("createUser")}
            </Button>
          )}
          <Input
            placeholder={t("searchByEmail")}
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
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
  )
}

export { UsersTable }
