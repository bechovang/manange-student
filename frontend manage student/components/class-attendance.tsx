"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Download, Search } from "lucide-react"

// Dữ liệu học sinh mẫu
const students = [
  {
    id: "STU001",
    name: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "present",
  },
  {
    id: "STU002",
    name: "Trần Thị B",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "present",
  },
  {
    id: "STU003",
    name: "Lê Văn C",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "absent",
  },
  {
    id: "STU004",
    name: "Phạm Thị D",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "present",
  },
  {
    id: "STU005",
    name: "Hoàng Văn E",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "late",
  },
]

// Dữ liệu lịch sử điểm danh mẫu
const attendanceHistory = [
  {
    date: "30/06/2023",
    present: 12,
    absent: 2,
    late: 1,
  },
  {
    date: "28/06/2023",
    present: 13,
    absent: 1,
    late: 1,
  },
  {
    date: "26/06/2023",
    present: 14,
    absent: 1,
    late: 0,
  },
  {
    date: "23/06/2023",
    present: 11,
    absent: 3,
    late: 1,
  },
  {
    date: "21/06/2023",
    present: 12,
    absent: 2,
    late: 1,
  },
]

export function ClassAttendance({ classId }: { classId: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("30/06/2023")

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Điểm danh lớp học</CardTitle>
            <CardDescription>Điểm danh học sinh ngày {selectedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="date">Ngày</Label>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{selectedDate}</span>
                  </Button>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="search">Tìm kiếm</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Tìm theo tên học sinh"
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Học sinh</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ghi chú</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">{student.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              student.status === "present"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : student.status === "absent"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {student.status === "present"
                              ? "Có mặt"
                              : student.status === "absent"
                                ? "Vắng mặt"
                                : "Đi muộn"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input placeholder="Nhập ghi chú" className="h-8" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Select defaultValue={student.status}>
                            <SelectTrigger className="h-8 w-28">
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Có mặt</SelectItem>
                              <SelectItem value="absent">Vắng mặt</SelectItem>
                              <SelectItem value="late">Đi muộn</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất Excel
                </Button>
                <Button className="bg-red-700 hover:bg-red-800">Lưu điểm danh</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử điểm danh</CardTitle>
            <CardDescription>Thống kê điểm danh các buổi học trước</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div>
                    <p className="font-medium">{record.date}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {record.present} có mặt
                      </Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {record.absent} vắng
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        {record.late} muộn
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(record.date)}>
                    Xem
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Xem tất cả
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

