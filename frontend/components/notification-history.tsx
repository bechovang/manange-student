"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// API: GET /api/notifications/history - Lấy lịch sử thông báo
// Params: { page: number, limit: number, search?: string }
// Response: { data: Notification[], total: number, page: number, limit: number }
type Notification = {
  id: string
  title: string
  recipients: string
  sentDate: string
  status: "success" | "failed" | "partial"
  successRate: number
}

// Dữ liệu mẫu - sẽ được thay thế bằng API call
const data: Notification[] = [
  {
    id: "NOT001",
    title: "Nhắc đóng học phí tháng 6/2023",
    recipients: "Tất cả học sinh",
    sentDate: "01/06/2023 08:15",
    status: "success",
    successRate: 100,
  },
  {
    id: "NOT002",
    title: "Lịch thi cuối kỳ",
    recipients: "Lớp Toán 10A",
    sentDate: "05/06/2023 10:30",
    status: "partial",
    successRate: 90,
  },
  {
    id: "NOT003",
    title: "Thông báo nghỉ lễ",
    recipients: "Tất cả học sinh",
    sentDate: "10/06/2023 14:45",
    status: "success",
    successRate: 100,
  },
  {
    id: "NOT004",
    title: "Nhắc đóng học phí tháng 6/2023",
    recipients: "Học sinh chưa đóng học phí",
    sentDate: "15/06/2023 09:00",
    status: "partial",
    successRate: 85,
  },
  {
    id: "NOT005",
    title: "Thông báo họp phụ huynh",
    recipients: "Lớp Lý 12A",
    sentDate: "20/06/2023 16:30",
    status: "failed",
    successRate: 0,
  },
]

const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "recipients",
    header: "Người nhận",
  },
  {
    accessorKey: "sentDate",
    header: "Ngày gửi",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge
          variant="outline"
          className={
            status === "success"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : status === "failed"
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          }
        >
          {status === "success" ? "Thành công" : status === "failed" ? "Thất bại" : "Một phần"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "successRate",
    header: "Tỷ lệ thành công",
    cell: ({ row }) => {
      const rate = Number.parseFloat(row.getValue("successRate"))

      return <div>{rate}%</div>
    },
  },
]

export function NotificationHistory() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thông báo..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="pl-8"
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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

