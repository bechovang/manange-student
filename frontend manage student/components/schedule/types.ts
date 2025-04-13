
import { z } from "zod"

export type TeacherWithSubjectType = {
    id: string
    name: string
    subject: string
}
  
// những gì chứa trong từng thẻ gg calendar
export type Schedule = { 
  scheduleID : string | number
  className: string
  TeacherWithSubjectType: string
  room: string
  dayOfWeek: string // mon|tue|wed|thu|fri|sat|sun , từng thẻ nên ko có mảng
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  startDate: string // "YYYY-MM-DD"  pịa
  endDate: string   // "YYYY-MM-DD"  pịa
}

// những gì cần để add và edit 1 thẻ gg calendar
export type ScheduleFormValues = { 
  classID: string | number
  className: string 
  teacherId: string | number // fetch api để có ds gv. hiển thị teacher_subject
  room: string
  dayweek: string[] // mon|tue|wed|thu|fri|sat|sun
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  startDate: string // "YYYY-MM-DD"  pịa
  endDate: string   // "YYYY-MM-DD"  pịa
}
// dùng classID truy ra nhiều schedule, truy ra teacher


export const ScheduleFormSchema = z.object({
  className: z.string().min(1, "Vui lòng nhập tên lớp học"),
  teacherId: z.string().min(1, "Vui lòng chọn giáo viên"),
  room: z.string().min(1, "Vui lòng nhập phòng học"),
  dayweek: z.string().min(1, "Vui lòng chọn thứ mấy trong tuần"),
  startTime: z.string().min(1, "Vui lòng nhập thời gian bắt đầu ca học"),
  endTime: z.string().min(1, "Vui lòng nhập thời gian kết thúc ca học"),
  startDate: z.string().min(1, "Vui lòng nhập ngày bắt đầu ca học"),
  endDate: z.string().min(1, "Vui lòng nhập ngày kết thúc ca học"),
}) 