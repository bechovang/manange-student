"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Search, Users } from "lucide-react"

// Mảng màu cho các giáo viên
const teacherColors = [
  "bg-red-100 text-red-800 border-red-200",
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-orange-100 text-orange-800 border-orange-200",
]

// Dữ liệu giáo viên mẫu
const teachers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    subject: "Toán",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 0,
  },
  {
    id: 2,
    name: "Trần Thị B",
    subject: "Anh Văn",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 1,
  },
  {
    id: 3,
    name: "Lê Văn C",
    subject: "Lý",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 2,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    subject: "Hóa",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 3,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    subject: "Sinh",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 4,
  },
]

// Dữ liệu lớp học mẫu
const classes = [
  {
    id: "CLASS001",
    name: "Toán 10A",
    teacherId: 1,
    students: 15,
    schedule: "Thứ 2, 4, 6 (18:00 - 19:30)",
    status: "active",
  },
  {
    id: "CLASS002",
    name: "Anh Văn 11B",
    teacherId: 2,
    students: 12,
    schedule: "Thứ 3, 5, 7 (18:00 - 19:30)",
    status: "active",
  },
  {
    id: "CLASS003",
    name: "Lý 12A",
    teacherId: 3,
    students: 10,
    schedule: "Thứ 2, 4, 6 (19:30 - 21:00)",
    status: "active",
  },
  {
    id: "CLASS004",
    name: "Hóa 11A",
    teacherId: 4,
    students: 8,
    schedule: "Thứ 3, 5, 7 (19:30 - 21:00)",
    status: "upcoming",
  },
  {
    id: "CLASS005",
    name: "Sinh 10B",
    teacherId: 5,
    students: 14,
    schedule: "Thứ 2, 4, 6 (17:00 - 18:30)",
    status: "active",
  },
  {
    id: "CLASS006",
    name: "Toán 11C",
    teacherId: 1,
    students: 16,
    schedule: "Thứ 3, 5, 7 (17:00 - 18:30)",
    status: "active",
  },
  {
    id: "CLASS007",
    name: "Anh Văn 10C",
    teacherId: 2,
    students: 18,
    schedule: "Thứ 2, 4, 6 (15:30 - 17:00)",
    status: "completed",
  },
  {
    id: "CLASS008",
    name: "Lý 11D",
    teacherId: 3,
    students: 9,
    schedule: "Thứ 3, 5, 7 (15:30 - 17:00)",
    status: "upcoming",
  },
]

export function ClassList({ filterStatus }: { filterStatus?: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  // Lọc lớp học theo trạng thái và tìm kiếm
  const filteredClasses = classes.filter((cls) => {
    // Lọc theo trạng thái
    if (filterStatus && cls.status !== filterStatus) {
      return false
    }

    // Lọc theo giáo viên
    if (selectedTeacher !== "all" && cls.teacherId !== Number.parseInt(selectedTeacher)) {
      return false
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm && !cls.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  // Nhóm lớp học theo giáo viên
  const classesByTeacher = teachers
    .map((teacher) => {
      return {
        teacher,
        classes: filteredClasses.filter((cls) => cls.teacherId === teacher.id),
      }
    })
    .filter((group) => group.classes.length > 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm lớp học..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Giáo viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả giáo viên</SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </TabsTrigger>
              <TabsTrigger value="list">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="space-y-6">
          {classesByTeacher.map((group) => (
            <div key={group.teacher.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={group.teacher.avatar} alt={group.teacher.name} />
                  <AvatarFallback>
                    {group.teacher.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{group.teacher.name}</h3>
                  <p className="text-sm text-muted-foreground">Giáo viên {group.teacher.subject}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.classes.map((cls) => {
                  const teacher = teachers.find((t) => t.id === cls.teacherId)!
                  const colorClass = teacherColors[teacher.colorIndex]

                  return (
                    <Link href={`/classes/${cls.id}`} key={cls.id}>
                      <Card className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${colorClass}`}>
                        <CardHeader className="pb-2">
                          <CardTitle>{cls.name}</CardTitle>
                          <CardDescription>Giáo viên: {teacher.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{cls.students} học sinh</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{cls.schedule}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Badge
                            variant="outline"
                            className={
                              cls.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : cls.status === "upcoming"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {cls.status === "active"
                              ? "Đang hoạt động"
                              : cls.status === "upcoming"
                                ? "Sắp khai giảng"
                                : "Đã kết thúc"}
                          </Badge>
                        </CardFooter>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Lớp học</th>
                <th className="py-3 px-4 text-left font-medium">Giáo viên</th>
                <th className="py-3 px-4 text-left font-medium">Học sinh</th>
                <th className="py-3 px-4 text-left font-medium">Lịch học</th>
                <th className="py-3 px-4 text-left font-medium">Trạng thái</th>
                <th className="py-3 px-4 text-right font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls) => {
                const teacher = teachers.find((t) => t.id === cls.teacherId)!

                return (
                  <tr key={cls.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-sm text-muted-foreground">{cls.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback>
                            {teacher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-xs text-muted-foreground">{teacher.subject}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{cls.students}</td>
                    <td className="py-3 px-4">{cls.schedule}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          cls.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : cls.status === "upcoming"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {cls.status === "active"
                          ? "Đang hoạt động"
                          : cls.status === "upcoming"
                            ? "Sắp khai giảng"
                            : "Đã kết thúc"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/classes/${cls.id}`}>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

