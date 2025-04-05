"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Download, Clock } from "lucide-react"

export function AttendanceResults() {
  const [attendanceResults] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      time: "18:05",
      status: "present",
    },
    {
      id: 2,
      name: "Trần Thị B",
      time: "18:02",
      status: "present",
    },
    {
      id: 3,
      name: "Lê Văn C",
      time: "18:10",
      status: "late",
    },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết quả điểm danh</CardTitle>
        <CardDescription>Danh sách học sinh đã điểm danh hôm nay</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Lớp: Toán 10A</p>
              <p className="text-xs text-muted-foreground">Ngày: 30/06/2023</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <UserCheck className="mr-1 h-3 w-3" />
                <span>{attendanceResults.filter((r) => r.status === "present").length} có mặt</span>
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                <Clock className="mr-1 h-3 w-3" />
                <span>{attendanceResults.filter((r) => r.status === "late").length} đi muộn</span>
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            {attendanceResults.map((student) => (
              <div key={student.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full ${student.status === "present" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} flex items-center justify-center`}
                  >
                    {student.status === "present" ? <UserCheck className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Điểm danh lúc: {student.time}</p>
                  </div>
                </div>
                <Badge
                  className={
                    student.status === "present"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }
                >
                  {student.status === "present" ? "Có mặt" : "Đi muộn"}
                </Badge>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

