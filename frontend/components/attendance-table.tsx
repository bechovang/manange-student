"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Download, Search } from "lucide-react"

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

export function AttendanceTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Điểm danh thủ công</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="date">Ngày</Label>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>30/06/2023</span>
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="class">Lớp</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="math10a">Toán 10A</SelectItem>
                  <SelectItem value="english11b">Anh Văn 11B</SelectItem>
                  <SelectItem value="physics12a">Lý 12A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
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
                        {student.status === "present" ? "Có mặt" : student.status === "absent" ? "Vắng mặt" : "Đi muộn"}
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
  )
}

