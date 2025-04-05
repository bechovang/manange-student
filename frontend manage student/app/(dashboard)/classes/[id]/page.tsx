import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClassAttendance } from "@/components/class-attendance"
import { ArrowLeft, BookOpen, Calendar, Clock, Users } from "lucide-react"

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  // Trong thực tế, bạn sẽ lấy dữ liệu lớp học từ API dựa trên params.id
  const classData = {
    id: params.id,
    name: "Toán 10A",
    teacher: {
      id: 1,
      name: "Nguyễn Văn A",
      subject: "Toán",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    students: 15,
    schedule: "Thứ 2, 4, 6 (18:00 - 19:30)",
    status: "active",
    startDate: "01/06/2023",
    endDate: "31/08/2023",
    room: "P.201",
    description: "Lớp Toán nâng cao dành cho học sinh lớp 10, chuẩn bị cho kỳ thi học kỳ và thi chuyển cấp.",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/classes">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Quay lại</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{classData.name}</h1>
        <Badge
          variant="outline"
          className={
            classData.status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : classData.status === "upcoming"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {classData.status === "active"
            ? "Đang hoạt động"
            : classData.status === "upcoming"
              ? "Sắp khai giảng"
              : "Đã kết thúc"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin lớp học</CardTitle>
            <CardDescription>Chi tiết về lớp {classData.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={classData.teacher.avatar} alt={classData.teacher.name} />
                <AvatarFallback>
                  {classData.teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{classData.teacher.name}</p>
                <p className="text-sm text-muted-foreground">Giáo viên {classData.teacher.subject}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{classData.students} học sinh</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{classData.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Từ {classData.startDate} đến {classData.endDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>Phòng: {classData.room}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">{classData.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
            <CardDescription>Tổng quan về tình hình lớp học</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Tỷ lệ điểm danh</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Tỷ lệ đóng học phí</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
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
                    className="h-6 w-6"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Số buổi đã học</p>
                  <p className="text-2xl font-bold">24/36</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
          <TabsTrigger value="students">Danh sách học sinh</TabsTrigger>
          <TabsTrigger value="schedule">Lịch học</TabsTrigger>
          <TabsTrigger value="payments">Học phí</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="space-y-4">
          <ClassAttendance classId={params.id} />
        </TabsContent>
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách học sinh</CardTitle>
              <CardDescription>Học sinh đang theo học lớp {classData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Chức năng đang được phát triển...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch học</CardTitle>
              <CardDescription>Lịch học chi tiết của lớp {classData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Chức năng đang được phát triển...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Học phí</CardTitle>
              <CardDescription>Tình hình đóng học phí của lớp {classData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Chức năng đang được phát triển...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

