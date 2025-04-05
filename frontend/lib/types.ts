// Student Types
export type StudentStatus = "active" | "inactive"

export type SubjectId = "math" | "physics" | "chemistry" | "biology" | "english" | "literature"

export interface Subject {
  id: SubjectId
  label: string
}

export type Student = {
  id: string
  name: string
  phone: string
  parentPhone: string
  facebook: string
  school: string
  subjects: string[]
  grade: string
  teacher: string
  classTime: string
  status: StudentStatus
  notes: string
  avatar: string
  enrollmentDate: string
  balance: number
  balanceMonths: number
}

// Class Types
export type ClassStatus = "active" | "upcoming" | "completed"

export interface Teacher {
  id: number
  name: string
  subject: string
  avatar: string
  colorIndex?: number
  color?: string
}

export interface Class {
  id: string
  name: string
  teacherId: number
  students: number
  schedule: string
  status: ClassStatus
}

// Payment Types
export type PaymentMethod = "cash" | "transfer"
export type PaymentStatus = "paid" | "unpaid" | "partial"

export interface Payment {
  id: string
  student: string
  class: string
  amount: number
  paymentDate: string
  status: PaymentStatus | "unpaid-1" | "unpaid-2"
  months?: number
  paymentMethod: PaymentMethod
  notes?: string
}

// Tuition Types
export type TuitionStatus = "paid" | "unpaid-1" | "unpaid-2"

export interface TuitionRecord {
  id: string
  student: string
  class: string
  amount: number
  dueDate: string
  status: TuitionStatus
  months: number
  lastPayment: string
}

// Schedule Types
export interface ScheduleEvent {
  id: number
  title: string
  teacherId: number
  day: number
  startTime: string
  endTime: string
  room: string
}

// Attendance Types
export type AttendanceStatus = "present" | "absent" | "late"

export interface Attendance {
  id: string
  name: string
  avatar: string
  status: AttendanceStatus
}

// Notification Types
export type NotificationStatus = "success" | "failed" | "partial"

export interface Notification {
  id: string
  title: string
  recipients: string
  sentDate: string
  status: NotificationStatus
  successRate: number
}

