import { useEffect, useState } from "react"
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
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import { useTranslations } from "use-intl"

import { env } from "@/env.mjs"
import { RootState } from "@/lib/store/store"
import { Button } from "@/components/ui/button"
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

interface JournalData {
  created_at: string
  general_id: string
  message: string
  model_name: string
  organization_id: string
  updated_at: string
  user_id: string
  _id: string
}
const listSize = ["5", "10", "20", "50"]
const JournalActions = () => {
  const t = useTranslations()
  const token = getCookie("scano_acess_token")
  const userData = useSelector((state: RootState) => state.userData.user)

  const [pending, setPending] = useState<boolean>(true)
  const [data, setData] = useState<JournalData[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<any>({})
  const [count, setCount] = useState<string>("10")

  const onChangeCount = (value: string) => {
    setCount(value)
    // dispatch(fetchMaterials(value, currentPage, theme_id))
    // dispatch(fetchFilterCountThunk(theme_id))
  }

  const columns: ColumnDef<JournalData>[] = [
    {
      accessorKey: "date",
      header: t("date"),
      cell: ({ row }) => (
        <div>
          {format(row.original.created_at, "dd.MM.yyyy")} в{" "}
          {format(row.original.created_at, "HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "themeName",
      header: t("themeName"),
      cell: ({ row }) => (
        <div className="capitalize">{row.original.model_name}</div>
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
      pagination: { pageSize: Number(count) },
    },
  })

  const getJournal = async (organization_id: string) => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_SCANO_API}/api/v1/journal/?organization_id=${organization_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (res.ok) {
      setPending(false)
      const localData = await res.json()
      setData(
        localData.sort(
          (a: JournalData, b: JournalData) =>
            // @ts-ignore
            new Date(b.created_at) - new Date(a.created_at)
        )
      )
    } else {
      setPending(false)
      console.error("Get journal data ERROR")
    }
  }

  useEffect(() => {
    if (!userData?.organization_id) {
      return
    }
    getJournal(userData.organization_id)
  }, [userData])
  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Input
            placeholder={t("searchByTheme")}
            // value={
            //   (table.getColumn("name")?.getFilterValue() as string) ?? ""
            // }
            // onChange={(event) =>
            //   table.getColumn("name")?.setFilterValue(event.target.value)
            // }
            className="w-64"
          />
          <Select value={count} onValueChange={onChangeCount}>
            <SelectTrigger className="w-[72px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {listSize.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
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
  )
}

export { JournalActions }
