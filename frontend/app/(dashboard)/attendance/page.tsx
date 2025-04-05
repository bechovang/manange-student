import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrScanner } from "@/components/qr-scanner"
import { AttendanceResults } from "@/components/attendance-results"
import { QrCode } from "lucide-react"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Điểm danh QR</h1>
        <p className="text-muted-foreground">Quét mã QR để điểm danh học sinh nhanh chóng</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quét mã QR</CardTitle>
            <CardDescription>Chọn lớp học và quét mã QR của học sinh để điểm danh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="class" className="text-sm font-medium">
                  Chọn lớp học
                </label>
                <Select defaultValue="math10a">
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math10a">Toán 10A (Thứ 2, 4, 6 - 18:00)</SelectItem>
                    <SelectItem value="english11b">Anh Văn 11B (Thứ 3, 5, 7 - 18:00)</SelectItem>
                    <SelectItem value="physics12a">Lý 12A (Thứ 2, 4, 6 - 19:30)</SelectItem>
                    <SelectItem value="chemistry11a">Hóa 11A (Thứ 3, 5, 7 - 19:30)</SelectItem>
                    <SelectItem value="biology10b">Sinh 10B (Thứ 2, 4, 6 - 17:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <QrScanner />
            </div>
          </CardContent>
        </Card>

        <AttendanceResults />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lớp học hôm nay</CardTitle>
            <CardDescription>Các lớp học diễn ra trong ngày hôm nay</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Xem tất cả
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                name: "Toán 10A",
                time: "18:00 - 19:30",
                teacher: "Nguyễn Văn A",
                room: "P.201",
                status: "pending",
              },
              {
                id: 2,
                name: "Anh Văn 11B",
                time: "18:00 - 19:30",
                teacher: "Trần Thị B",
                room: "P.202",
                status: "in-progress",
              },
              { id: 3, name: "Lý 12A", time: "19:30 - 21:00", teacher: "Lê Văn C", room: "P.203", status: "pending" },
              {
                id: 4,
                name: "Hóa 11A",
                time: "19:30 - 21:00",
                teacher: "Phạm Thị D",
                room: "P.204",
                status: "completed",
              },
            ].map((cls) => (
              <div key={cls.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      cls.status === "pending"
                        ? "bg-gray-100 text-gray-500"
                        : cls.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.time} | {cls.teacher} | {cls.room}
                    </p>
                  </div>
                </div>
                <Button
                  variant={cls.status === "completed" ? "outline" : "default"}
                  className={cls.status === "completed" ? "" : "bg-red-700 hover:bg-red-800"}
                  size="sm"
                >
                  {cls.status === "pending"
                    ? "Bắt đầu điểm danh"
                    : cls.status === "in-progress"
                      ? "Đang điểm danh"
                      : "Xem kết quả"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

