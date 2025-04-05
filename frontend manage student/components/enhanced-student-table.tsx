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
import { ChevronDown, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StudentActions } from "@/components/student-crud"

type Student = {
  id: string
  name: string
  phone: string
  parentPhone: string
  facebook: string
  school: string
  subjects: string[]
  grade: string
  teacher: string
  classTime: string
  status: "active" | "inactive"
  notes: string
  avatar: string
  enrollmentDate: string
  balance: number
  balanceMonths: number
}

// Dữ liệu mẫu - sẽ được thay thế bằng API call
const data: Student[] = [
  {
    id: "STU001",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    parentPhone: "0909876543",
    facebook: "facebook.com/nguyenvana",
    school: "THPT Nguyễn Du",
    subjects: ["Toán", "Lý"],
    grade: "Lớp 10",
    teacher: "Nguyễn Văn X",
    classTime: "Tối 2-4-6",
    status: "active",
    notes: "Học sinh chăm chỉ",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "01/06/2023",
    balance: 1500000,
    balanceMonths: 1,
  },
  {
    id: "STU002",
    name: "Trần Thị B",
    phone: "0901234568",
    parentPhone: "0909876544",
    facebook: "facebook.com/tranthib",
    school: "THPT Lê Quý Đôn",
    subjects: ["Anh Văn"],
    grade: "Lớp 11",
    teacher: "Trần Văn Y",
    classTime: "Tối 3-5-7",
    status: "active",
    notes: "Học sinh năng động",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "15/05/2023",
    balance: -1800000,
    balanceMonths: -1,
  },
  {
    id: "STU003",
    name: "Lê Văn C",
    phone: "0901234569",
    parentPhone: "0909876545",
    facebook: "facebook.com/levanc",
    school: "THPT Chu Văn An",
    subjects: ["Lý", "Hóa"],
    grade: "Lớp 12",
    teacher: "Lê Văn Z",
    classTime: "Chiều 2-4-6",
    status: "inactive",
    notes: "Học sinh cần cải thiện",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "10/04/2023",
    balance: -4000000,
    balanceMonths: -2,
  },
  {
    id: "STU004",
    name: "Phạm Thị D",
    phone: "0901234570",
    parentPhone: "0909876546",
    facebook: "facebook.com/phamthid",
    school: "THPT Nguyễn Trãi",
    subjects: ["Hóa", "Sinh"],
    grade: "Lớp 11",
    teacher: "Phạm Văn W",
    classTime: "Chiều 3-5-7",
    status: "active",
    notes: "",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "20/05/2023",
    balance: 0,
    balanceMonths: 0,
  },
  {
    id: "STU005",
    name: "Hoàng Văn E",
    phone: "0901234571",
    parentPhone: "0909876547",
    facebook: "facebook.com/hoangvane",
    school: "THPT Lê Hồng Phong",
    subjects: ["Toán", "Anh Văn"],
    grade: "Lớp 10",
    teacher: "Hoàng Văn V",
    classTime: "Sáng 7-CN",
    status: "active",
    notes: "Học sinh tiến bộ",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "05/06/2023",
    balance: 3000000,
    balanceMonths: 2,
  },
]

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Học sinh
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>
            {row.original.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.id}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "enrollmentDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ngày nhập học
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          SĐT học sinh
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "parentPhone",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          SĐT phụ huynh
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Số tiền dư/nợ
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Math.abs(balance))

      return (
        <div className={balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : ""}>
          {balance > 0 ? "+" : balance < 0 ? "-" : ""}
          {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: "balanceMonths",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Số tháng dư/nợ
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const months = row.getValue("balanceMonths") as number
      return (
        <Badge
          variant="outline"
          className={
            months > 0
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : months < 0
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : ""
          }
        >
          {months > 0 ? "+" : months < 0 ? "-" : ""}
          {Math.abs(months)} tháng
        </Badge>
      )
    },
  },
  {
    accessorKey: "school",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Trường
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "subjects",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Môn học
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.subjects.map((subject, index) => (
          <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {subject}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "grade",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Khối lớp
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
        {row.getValue("grade")}
      </Badge>
    ),
  },
  {
    accessorKey: "teacher",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Giáo viên
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
        {row.getValue("teacher")}
      </Badge>
    ),
  },
  {
    accessorKey: "classTime",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ca học
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
        {row.getValue("classTime")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Trạng thái
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "secondary"}
        className={
          row.original.status === "active"
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
      >
        {row.original.status === "active" ? "Đang học" : "Nghỉ học"}
      </Badge>
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ghi chú
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <StudentActions student={row.original} />,
  },
]

export function EnhancedStudentTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    facebook: false,
    notes: false,
  })

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm học sinh..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Khối lớp <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
                Tất cả
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Lớp 10
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Lớp 11
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Lớp 12
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Môn học <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
                Tất cả
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Toán
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Lý
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Hóa
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Sinh
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Anh Văn
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Giáo viên <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
                Tất cả
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Nguyễn Văn X
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Trần Văn Y
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Lê Văn Z
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Ca học <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
                Tất cả
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Sáng 7-CN
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Chiều 2-4-6
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Chiều 3-5-7
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Tối 2-4-6
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => {}}>
                Tối 3-5-7
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
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
                      {column.id === "name"
                        ? "Học sinh"
                        : column.id === "phone"
                          ? "SĐT học sinh"
                          : column.id === "parentPhone"
                            ? "SĐT phụ huynh"
                            : column.id === "enrollmentDate"
                              ? "Ngày nhập học"
                              : column.id === "balance"
                                ? "Số tiền dư/nợ"
                                : column.id === "balanceMonths"
                                  ? "Số tháng dư/nợ"
                                  : column.id === "school"
                                    ? "Trường"
                                    : column.id === "subjects"
                                      ? "Môn học"
                                      : column.id === "grade"
                                        ? "Khối lớp"
                                        : column.id === "teacher"
                                          ? "Giáo viên"
                                          : column.id === "classTime"
                                            ? "Ca học"
                                            : column.id === "status"
                                              ? "Trạng thái"
                                              : column.id === "notes"
                                                ? "Ghi chú"
                                                : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
            Xuất Excel
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
            In danh sách
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

