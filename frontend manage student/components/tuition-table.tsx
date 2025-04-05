"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Search, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

type TuitionStatus = {
  id: string
  student: string
  class: string
  amount: number
  dueDate: string
  status: "paid" | "unpaid-1" | "unpaid-2"
  months: number
  lastPayment: string
}

// Dữ liệu mẫu - sẽ được thay thế bằng API call
const data: TuitionStatus[] = [
  {
    id: "STU001",
    student: "Nguyễn Văn A",
    class: "Toán 10A",
    amount: 1500000,
    dueDate: "05/07/2023",
    status: "paid",
    months: 0,
    lastPayment: "30/06/2023",
  },
  {
    id: "STU002",
    student: "Trần Thị B",
    class: "Anh Văn 11B",
    amount: 1800000,
    dueDate: "05/07/2023",
    status: "unpaid-1",
    months: 1,
    lastPayment: "31/05/2023",
  },
  {
    id: "STU003",
    student: "Lê Văn C",
    class: "Lý 12A",
    amount: 2000000,
    dueDate: "05/07/2023",
    status: "unpaid-2",
    months: 3,
    lastPayment: "31/03/2023",
  },
  {
    id: "STU004",
    student: "Phạm Thị D",
    class: "Hóa 11A",
    amount: 1800000,
    dueDate: "05/07/2023",
    status: "paid",
    months: 0,
    lastPayment: "28/06/2023",
  },
  {
    id: "STU005",
    student: "Hoàng Văn E",
    class: "Toán 9A",
    amount: 1500000,
    dueDate: "05/07/2023",
    status: "unpaid-2",
    months: 2,
    lastPayment: "30/04/2023",
  },
]

const columns: ColumnDef<TuitionStatus>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Mã học sinh
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "student",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Học sinh
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "class",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Lớp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Học phí hàng tháng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount)

      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Hạn đóng tiền
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "lastPayment",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Lần đóng gần nhất
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Trạng thái
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const months = row.original.months

      return (
        <Badge
          variant="outline"
          className={
            status === "paid"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : status === "unpaid-1"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
          }
        >
          {status === "paid" ? "Đã đóng" : status === "unpaid-1" ? "Chưa đóng 1 tháng" : `Chưa đóng ${months} tháng`}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast()

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast({
                title: "Gửi thông báo",
                description: `Đã gửi thông báo nhắc học phí đến phụ huynh của ${row.original.student}`,
              })
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Gửi thông báo</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem>Xem lịch sử thanh toán</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Gửi thông báo Zalo</DropdownMenuItem>
              <DropdownMenuItem>Gọi điện</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export function TuitionTable({ filterStatus }: { filterStatus?: "paid" | "unpaid-1" | "unpaid-2" }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const filteredData = filterStatus ? data.filter((item) => item.status === filterStatus) : data

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học sinh..."
            value={(table.getColumn("student")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("student")?.setFilterValue(event.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
              <Settings className="mr-2 h-4 w-4" />
              Hiển thị cột
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
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "id"
                      ? "Mã học sinh"
                      : column.id === "student"
                        ? "Học sinh"
                        : column.id === "class"
                          ? "Lớp"
                          : column.id === "amount"
                            ? "Học phí hàng tháng"
                            : column.id === "dueDate"
                              ? "Hạn đóng tiền"
                              : column.id === "lastPayment"
                                ? "Lần đóng gần nhất"
                                : column.id === "status"
                                  ? "Trạng thái"
                                  : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} học sinh</div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}

