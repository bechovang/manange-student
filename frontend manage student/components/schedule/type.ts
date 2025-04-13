export type TeacherWithSubjectType = {
    id: string
    name: string
    subject: string
  }
  
  export type ScheduleEvent = {
    id: string
    className: string
    teacherId: string
    teacherName: string
    subject: string
    room: string
    dayOfWeek: string // '2' | '3' | '4' | '5' | '6' | '7' | 'cn'
    startTime: string // "HH:mm"
    endTime: string   // "HH:mm"
    startDate: string // "YYYY-MM-DD"
    endDate: string   // "YYYY-MM-DD"
  }
  