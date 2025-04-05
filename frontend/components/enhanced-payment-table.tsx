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
import { ArrowUpDown, MoreHorizontal, Search, Printer, Eye, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Payment = {
  id: string
  student: string
  class: string
  amount: number
  paymentDate: string
  status: "paid" | "unpaid-1" | "unpaid-2"
  months: number
  paymentMethod: "cash" | "transfer"
}

// Dữ liệu mẫu - sẽ được thay thế bằng API call
const data: Payment[] = [
  {
    id: "INV001",
    student: "Nguyễn Văn A",
    class: "Toán 10A",
    amount: 1500000,
    paymentDate: "30/06/2023 08:15",
    status: "paid",
    months: 0,
    paymentMethod: "cash",
  },
  {
    id: "INV002",
    student: "Trần Thị B",
    class: "Anh Văn 11B",
    amount: 1800000,
    paymentDate: "25/06/2023 14:30",
    status: "unpaid-1",
    months: 1,
    paymentMethod: "transfer",
  },
  {
    id: "INV003",
    student: "Lê Văn C",
    class: "Lý 12A",
    amount: 2000000,
    paymentDate: "20/06/2023 09:45",
    status: "unpaid-2",
    months: 3,
    paymentMethod: "cash",
  },
  {
    id: "INV004",
    student: "Phạm Thị D",
    class: "Hóa 11A",
    amount: 1800000,
    paymentDate: "15/06/2023 16:20",
    status: "paid",
    months: 0,
    paymentMethod: "transfer",
  },
  {
    id: "INV005",
    student: "Hoàng Văn E",
    class: "Toán 9A",
    amount: 1500000,
    paymentDate: "10/06/2023 11:10",
    status: "unpaid-2",
    months: 2,
    paymentMethod: "cash",
  },
]

function PaymentDetailDialog({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Xem chi tiết</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Chi tiết thanh toán</DialogTitle>
          <DialogDescription>Thông tin chi tiết về giao dịch thanh toán</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-red-700 flex items-center justify-center text-white">ABM</div>
              <div>
                <h3 className="font-bold text-lg">Trung tâm Ánh Bình Minh</h3>
                <p className="text-sm text-muted-foreground">Biên lai thanh toán học phí</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">Mã hóa đơn: {payment.id}</p>
              <p className="text-sm text-muted-foreground">Ngày: {payment.paymentDate.split(" ")[0]}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Học sinh</h4>
                <p className="font-medium">{payment.student}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Lớp</h4>
                <p>{payment.class}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Số tiền</h4>
                <p className="font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(payment.amount)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Phương thức thanh toán</h4>
                <Badge
                  variant="outline"
                  className={
                    payment.paymentMethod === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }
                >
                  {payment.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Thời gian thanh toán</h4>
                <p>{payment.paymentDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Trạng thái</h4>
                <Badge
                  variant="outline"
                  className={
                    payment.status === "paid"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : payment.status === "unpaid-1"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {payment.status === "paid"
                    ? "Đã đóng"
                    : payment.status === "unpaid-1"
                      ? "Chưa đóng 1 tháng"
                      : `Chưa đóng ${payment.months} tháng`}
                </Badge>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Ghi chú</h4>
              <p className="text-sm">Thanh toán học phí tháng 6/2023</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Người thu</h4>
              <p className="text-sm">Admin</p>
            </div>
          </div>

          <div className="border-t pt-4 text-center">
            <p className="text-sm text-muted-foreground">Cảm ơn quý phụ huynh đã tin tưởng Trung tâm Ánh Bình Minh</p>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Đang in biên lai",
                description: `Đang in biên lai ${payment.id} cho học sinh ${payment.student}`,
              })
              setOpen(false)
            }}
            className="bg-red-700 hover:bg-red-800"
          >
            <Printer className="mr-2 h-4 w-4" />
            In biên lai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PrintReceiptButton({ payment }: { payment: Payment }) {
  const { toast } = useToast()

  return (
    <Button
      variant="ghost"
      className="h-8 w-8 p-0"
      onClick={() => {
        toast({
          title: "Đang in biên lai",
          description: `Đang in biên lai ${payment.id} cho học sinh ${payment.student}`,
        })
      }}
    >
      <Printer className="h-4 w-4" />
      <span className="sr-only">In biên lai</span>
    </Button>
  )
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Mã hóa đơn
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
          Số tiền
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
    accessorKey: "paymentDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Thời gian đóng tiền
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Phương thức
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string
      return (
        <Badge
          variant="outline"
          className={method === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
        >
          {method === "cash" ? "Tiền mặt" : "Chuyển khoản"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <PaymentDetailDialog payment={row.original} />
        <PrintReceiptButton payment={row.original} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem>Gửi thông báo</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

export function EnhancedPaymentTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("all")

  // Lọc dữ liệu theo lớp và phương thức thanh toán
  const filteredData = data.filter((item) => {
    // Lọc theo lớp
    if (selectedClass !== "all" && item.class !== selectedClass) {
      return false
    }

    // Lọc theo phương thức thanh toán
    if (selectedPaymentMethod !== "all" && item.paymentMethod !== selectedPaymentMethod) {
      return false
    }

    return true
  })

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

  // Lấy danh sách các lớp duy nhất từ dữ liệu
  const uniqueClasses = Array.from(new Set(data.map((item) => item.class)))

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm học sinh..."
              value={(table.getColumn("student")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("student")?.setFilterValue(event.target.value)}
              className="pl-8 w-full"
            />
          </div>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Lọc theo lớp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lớp</SelectItem>
              {uniqueClasses.map((className) => (
                <SelectItem key={className} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phương thức</SelectItem>
              <SelectItem value="cash">Tiền mặt</SelectItem>
              <SelectItem value="transfer">Chuyển khoản</SelectItem>
            </SelectContent>
          </Select>
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
                      ? "Mã hóa đơn"
                      : column.id === "student"
                        ? "Học sinh"
                        : column.id === "class"
                          ? "Lớp"
                          : column.id === "amount"
                            ? "Số tiền"
                            : column.id === "paymentDate"
                              ? "Thời gian đóng tiền"
                              : column.id === "paymentMethod"
                                ? "Phương thức"
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
        <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} giao dịch</div>
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

