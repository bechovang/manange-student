"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Student } from "./types"

export function ViewStudentDialog({ student }: { student: Student }) {
  const [open, setOpen] = useState(false)

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map(n => n[0] || "")
      .join("")
  }

  const getStatusDisplay = (status: string) => {
    if (!status) return "Không xác định"
    return status === "active" ? "Đang học" : status === "inactive" ? "Nghỉ học" : "Chưa có lớp"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Xem chi tiết</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Thông tin học sinh</DialogTitle>
          <DialogDescription>Chi tiết thông tin của học sinh {student.name || "Không có tên"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-semibold">
              {getInitials(student.name)}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{student.name || "Không có tên"}</h3>
              <p className="text-sm text-muted-foreground">{student.id || "Không có ID"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Số điện thoại học sinh</h4>
              <p>{student.phoneStudent || "Chưa cập nhật"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Số điện thoại phụ huynh</h4>
              <p>{student.phoneParent || "Chưa cập nhật"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Facebook</h4>
              <p>{student.facebookLink || "Không có"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Trường học</h4>
              <p>{student.school || "Chưa cập nhật"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Khối lớp</h4>
              <p>{student.grade || "Chưa cập nhật"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Giáo viên</h4>
              <p>{student.teacher || "Chưa phân công"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Ca học</h4>
              <p>{student.classTime || "Chưa sắp xếp"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Trạng thái</h4>
              <p>{getStatusDisplay(student.status)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Ngày sinh</h4>
              <p>{student.dateOfBirth || "Chưa cập nhật"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Giới tính</h4>
              <p>{student.gender === "male" ? "Nam" : "Nữ"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Số tiền dư/nợ</h4>
              <p className={student.balance > 0 ? "text-green-600" : student.balance < 0 ? "text-red-600" : ""}>
                {student.balance > 0 ? "+" : student.balance < 0 ? "-" : ""}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Math.abs(student.balance))}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Số tháng dư/nợ</h4>
              <p>{student.balanceMonths} tháng</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Môn học</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {Array.isArray(student.subjects) && student.subjects.length > 0 ? (
                student.subjects.map((subject: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                    {subject}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Chưa đăng ký môn học</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Ghi chú</h4>
            <p className="mt-1">{student.note || "Không có ghi chú"}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 