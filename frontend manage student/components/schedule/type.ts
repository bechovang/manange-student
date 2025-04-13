
import { z } from "zod"

export type TeacherWithSubjectType = {
    id: string
    name: string
    subject: string
}
  
// những gì chứa trong 1 thẻ gg calendar
export type Schedule = { 
  scheduleID : string | number
  className: string
  teacherName: string
  subject: string
  room: string
  dayOfWeek: string // mon|tue|wed|thu|fri|sat|sun
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  startDate: string // "YYYY-MM-DD"  pịa
  endDate: string   // "YYYY-MM-DD"  pịa
}

// những gì cần để add và edit 1 thẻ gg calendar
export type ScheduleFormValues = { 
  className: string
  teacherId: string | number // fetch api để có ds gv. hiển thị teacher_subject
  room: string
  dayOfWeek: string // mon|tue|wed|thu|fri|sat|sun
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  startDate: string // "YYYY-MM-DD"  pịa
  endDate: string   // "YYYY-MM-DD"  pịa
}
// dùng scheduleID truy ra class, truy ra teacher


export const ScheduleFormSchema = z.object({
  className: z.string().min(1, "Vui lòng nhập tên lớp học"),
  teacherId: z.string().min(1, "Vui lòng chọn giáo viên"),
  room: z.string().min(1, "Vui lòng nhập phòng học"),
  dayOfWeek: z.string().min(1, "Vui lòng chọn thứ mấy trong tuần"),
  startTime: z.string().min(1, "Vui lòng nhập thời gian bắt đầu ca học"),
  endTime: z.string().min(1, "Vui lòng nhập thời gian kết thúc ca học"),
  startDate: z.string().min(1, "Vui lòng nhập ngày bắt đầu ca học"),
  endDate: z.string().min(1, "Vui lòng nhập ngày kết thúc ca học"),
}) 