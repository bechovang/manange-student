import type { scheduleEvent, teacher } from "./types"

export const fallBackTeachers: teacher[] = [
  {
    id: 1,
    name: "Giáo viên 1",
    subject: "Toán",
    avatar: "",
    colorIndex: 0,
    color: "bg-red-100"
  }
]

export const fallBackSchedules: scheduleEvent[] = [
  {
    id: 1,
    title: "Lớp mẫu",
    teacherId: 1,
    day: 1,
    startTime: "15:30",  // phải khớp với timeSlots ở bên trên, nếu không sẽ bị lỗi khi render ra màn hìn
    endTime: "17:00",
    room: "P.101"
  },
  {
    id: 1,
    title: "Lớp mẫu",
    teacherId: 1,
    day: 2,
    startTime: "15:30",
    endTime: "17:00",
    room: "P.101"
  }
]