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
import { StudentActions } from "@/components/student-crud/student-actions"
import { type Student } from "@/components/student-crud/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

// Dữ liệu mẫu fallback - chỉ sử dụng khi API lỗi
const fallbackData: Student[] = [
  {
    id: "STU001",
    name: "Nguyễn Văn A",
    phoneStudent: "0901234567",
    phoneParent: "0909876543",
    facebookLink: "facebook.com/nguyenvana",
    school: "THPT Nguyễn Du",
    subjects: ["Toán", "Lý"],
    grade: "Lớp 10",
    teacher: "Nguyễn Văn X",
    classTime: "Tối 2-4-6",
    status: "active",
    note: "Học sinh chăm chỉ",
    dateOfBirth: "01/06/2023",
    gender: "male",
    createdAt: "2023-06-05",
    balance: 1500000,
    balanceMonths: 1
  },
  {
    id: "STU002",
    name: "Trần Thị B",
    phoneStudent: "0901234568",
    phoneParent: "0909876544",
    facebookLink: "facebook.com/tranthib",
    school: "THPT Lê Quý Đôn",
    subjects: ["Anh Văn"],
    grade: "Lớp 11",
    teacher: "Trần Văn Y",
    classTime: "Tối 3-5-7",
    status: "active",
    note: "Học sinh năng động",
    dateOfBirth: "15/05/2023",
    gender: "female",
    createdAt: "2023-06-05",
    balance: -1800000,
    balanceMonths: -1
  },
]

export function EnhancedStudentTable() {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    name: true,
    createdAt: true,
    phoneStudent: true,
    phoneParent: true,
    facebookLink: true,
    note: true,
    school: true,
    subjects: true,
    grade: true,
    teacher: true,
    classTime: true,
    status: true,
    balance: true,
    balanceMonths: true,
    actions: true
  })
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
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Ngày nhập học
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div>{date.toLocaleDateString("vi-VN")}</div>
      },
    },
    {
      accessorKey: "phoneStudent",
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
      accessorKey: "phoneParent",
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
      accessorKey: "facebookLink",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Facebook
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const facebookLink = row.getValue("facebookLink") as string
        return facebookLink ? (
          <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {facebookLink}
          </a>
        ) : (
          <span className="text-muted-foreground">Không có</span>
        )
      },
    },
    {
      accessorKey: "note",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Ghi chú
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const note = row.getValue("note") as string
        return <div className="max-w-[200px] truncate">{note || "Không có ghi chú"}</div>
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
                : status === "inactive"
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            }
          >
            {status === "active"
              ? "Đang học"
              : status === "inactive"
              ? "Đã nghỉ"
              : "Chưa có lớp"}
          </Badge>
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
                        : column.id === "createdAt"
                        ? "Ngày nhập học"
                        : column.id === "phoneStudent"
                        ? "SĐT học sinh"
                        : column.id === "phoneParent"
                        ? "SĐT phụ huynh"
                        : column.id === "facebookLink"
                        ? "Facebook"
                        : column.id === "note"
                        ? "Ghi chú"
                        : column.id === "balance"
                        ? "Số tiền dư/nợ"
                        : column.id === "balanceMonths"
                        ? "Số tháng dư/nợ"
                        : column.id === "school"
                        ? "Trường"
                        : column.id === "subjects"
                        ? "Môn học"
                        : column.id === "grade"
                        ? "Lớp"
                        : column.id === "teacher"
                        ? "Giáo viên"
                        : column.id === "classTime"
                        ? "Lịch học"
                        : column.id === "status"
                        ? "Trạng thái"
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


