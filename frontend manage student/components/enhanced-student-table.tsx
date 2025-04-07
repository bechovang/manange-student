"use client"

import { useState, useEffect } from "react"
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
import { ChevronDown, Settings, Search, Loader2 } from "lucide-react"
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
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

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

// Dữ liệu mẫu fallback - chỉ sử dụng khi API lỗi
const fallbackData: Student[] = [
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

export function EnhancedStudentTable() {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from API
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const accessToken = Cookies.get('accessToken')
        if (!accessToken) {
          router.push('/login')
          return
        }

        const response = await axios.get('http://localhost:8080/api/students', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        setStudents(response.data)
        setError(null)
      } catch (error: any) {
        console.error('Error fetching students:', error)
        if (error.response?.status === 403) {
          // Token hết hạn hoặc không hợp lệ, chuyển về trang login
          router.push('/login')
          return
        }
        setError('Không thể tải dữ liệu học sinh. Đang sử dụng dữ liệu mẫu.')
        setStudents(fallbackData) // Sử dụng dữ liệu mẫu khi API lỗi
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [router])

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
        const balance = parseFloat(row.getValue("balance") as string)
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
        const months = parseInt(row.getValue("balanceMonths") as string)
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
      cell: ({ row }) => {
        const subjects = row.getValue("subjects") as string[]
        return (
          <div className="flex flex-wrap gap-1">
            {subjects.map((subject) => (
              <Badge key={subject} variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">
                {subject}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "grade",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Lớp
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
    },
    {
      accessorKey: "classTime",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Lịch học
            <ChevronDown className="ml-2 h-4 w-4" />
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
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant="outline"
            className={
              status === "active"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            }
          >
            {status === "active" ? "Đang học" : "Đã nghỉ"}
          </Badge>
        )
      },
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
      cell: ({ row }) => {
        return <div className="max-w-[200px] truncate">{row.getValue("notes")}</div>
      },
    },
    {
      accessorKey: "facebook",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Facebook
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original
        return <StudentActions student={student} />
      },
    },
  ]

  const table = useReactTable({
    data: students,
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
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={() => table.getColumn("status")?.setFilterValue("active")}>
            Đang học
          </Button>
          <Button
            variant="outline"
            onClick={() => table.getColumn("status")?.setFilterValue("inactive")}
          >
            Đã nghỉ
          </Button>
          <Button variant="outline" onClick={() => table.getColumn("status")?.setFilterValue("")}>
            Tất cả
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings className="mr-2 h-4 w-4" />
                <span>Cột hiển thị</span>
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
                        : column.id === "enrollmentDate"
                        ? "Ngày nhập học"
                        : column.id === "phone"
                        ? "SĐT học sinh"
                        : column.id === "parentPhone"
                        ? "SĐT phụ huynh"
                        : column.id === "balance"
                        ? "Số tiền dư/nợ"
                        : column.id === "balanceMonths"
                        ? "Số tháng dư/nợ"
                        : column.id === "school"
                        ? "Trường"
                        : column.id === "grade"
                        ? "Lớp"
                        : column.id === "subjects"
                        ? "Môn học"
                        : column.id === "teacher"
                        ? "Giáo viên"
                        : column.id === "classTime"
                        ? "Lịch học"
                        : column.id === "status"
                        ? "Trạng thái"
                        : column.id === "notes"
                        ? "Ghi chú"
                        : column.id === "facebook"
                        ? "Facebook"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>Thêm học sinh mới</Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="rounded-md bg-yellow-50 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Không có dữ liệu học sinh</p>
        </div>
      ) : (
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
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
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
      )}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground text-sm">
          Trang{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>{" "}
          | Tổng <strong>{table.getFilteredRowModel().rows.length}</strong> học sinh
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Sau
        </Button>
      </div>
    </div>
  )
}

