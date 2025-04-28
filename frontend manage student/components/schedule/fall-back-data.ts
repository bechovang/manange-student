//======================================================
//==== ĐANG LẤY ĐC TEACHER TU BE RỒI             =======
//==== doi thanh schedule/teachers + them corlor =======
//======================================================

import type { scheduleEvent, teacher } from "./types"

// Mảng màu cho các giáo viên - cập nhật với các class Tailwind đầy đủ
export const teacherColors = [
  "bg-red-100 text-red-800 border-red-200",
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-orange-100 text-orange-800 border-orange-200",
]

export const fallBackTeachers: teacher[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    subject: "Toán",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 0,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    id: 2,
    name: "Trần Thị B",
    subject: "Anh Văn",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 1,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  }
]

export const fallBackSchedules: scheduleEvent[] = [
  {
    id: 1,
    title: "Lớp mẫu",
    teacherId: 1,
    day: 1,
    startTime: "15:30",
    endTime: "17:00",
    room: "P.101"
  },
  {
    id: 2, // Sửa thành id khác (2 thay vì 1)
    title: "Lớp mẫu 2",
    teacherId: 2, // Thêm sự kiện cho giáo viên thứ 2
    day: 2,
    startTime: "15:30",
    endTime: "17:00",
    room: "P.102"
  }
]