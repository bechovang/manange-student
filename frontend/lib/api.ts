/**
 * Đây là file mẫu API client để tương tác với backend.
 * Trong môi trường thực tế, các hàm này sẽ gọi đến các API endpoint thực.
 * Hiện tại, chúng sử dụng dữ liệu mẫu để mô phỏng các cuộc gọi API.
 */

import type { Student, Class, Payment, TuitionRecord, Attendance, ScheduleEvent, Notification } from "./types"
import { students, classes, payments, tuitionRecords, attendanceData, scheduleEvents, notifications } from "./mockData"

// Thời gian trễ giả lập cho API
const FAKE_DELAY = 500

// Hàm trợ giúp để tạo độ trễ giả lập
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// API STUDENTS
export const fetchStudents = async (): Promise<Student[]> => {
  await delay(FAKE_DELAY)
  return [...students]
}

export const fetchStudentById = async (id: string): Promise<Student | undefined> => {
  await delay(FAKE_DELAY)
  return students.find((student) => student.id === id)
}

export const createStudent = async (
  studentData: Omit<Student, "id" | "avatar" | "balance" | "balanceMonths">,
): Promise<Student> => {
  await delay(FAKE_DELAY)

  // Tạo học sinh mới với ID tự động và các giá trị mặc định
  const newStudent: Student = {
    id: `STU${String(students.length + 1).padStart(3, "0")}`,
    avatar: "/placeholder.svg?height=40&width=40",
    balance: 0,
    balanceMonths: 0,
    ...studentData,
  }

  // Trong môi trường thực tế, đây sẽ là API POST
  return newStudent
}

export const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
  await delay(FAKE_DELAY)

  const studentIndex = students.findIndex((student) => student.id === id)
  if (studentIndex === -1) {
    throw new Error("Không tìm thấy học sinh")
  }

  // Trong môi trường thực tế, đây sẽ là API PUT hoặc PATCH
  const updatedStudent = { ...students[studentIndex], ...studentData }
  return updatedStudent
}

export const deleteStudent = async (id: string): Promise<boolean> => {
  await delay(FAKE_DELAY)

  // Trong môi trường thực tế, đây sẽ là API DELETE
  return true
}

// API CLASSES
export const fetchClasses = async (filterStatus?: string): Promise<Class[]> => {
  await delay(FAKE_DELAY)

  if (filterStatus) {
    return classes.filter((cls) => cls.status === filterStatus)
  }

  return [...classes]
}

export const fetchClassById = async (id: string): Promise<Class | undefined> => {
  await delay(FAKE_DELAY)
  return classes.find((cls) => cls.id === id)
}

// API PAYMENTS
export const fetchPayments = async (): Promise<Payment[]> => {
  await delay(FAKE_DELAY)
  return [...payments]
}

export const createPayment = async (paymentData: Omit<Payment, "id">): Promise<Payment> => {
  await delay(FAKE_DELAY)

  const newPayment: Payment = {
    id: `INV${String(payments.length + 1).padStart(3, "0")}`,
    ...paymentData,
  }

  return newPayment
}

// API TUITION
export const fetchTuition = async (filterStatus?: string): Promise<TuitionRecord[]> => {
  await delay(FAKE_DELAY)

  if (filterStatus) {
    return tuitionRecords.filter((record) => record.status === filterStatus)
  }

  return [...tuitionRecords]
}

// API ATTENDANCE
export const fetchAttendance = async (classId?: string, date?: string): Promise<Attendance[]> => {
  await delay(FAKE_DELAY)
  return [...attendanceData]
}

export const saveAttendance = async (
  classId: string,
  date: string,
  attendance: Partial<Attendance>[],
): Promise<boolean> => {
  await delay(FAKE_DELAY)
  return true
}

// API SCHEDULE
export const fetchSchedule = async (view: "day" | "week" | "month"): Promise<ScheduleEvent[]> => {
  await delay(FAKE_DELAY)
  return [...scheduleEvents]
}

export const createScheduleEvent = async (eventData: Omit<ScheduleEvent, "id">): Promise<ScheduleEvent> => {
  await delay(FAKE_DELAY)

  const newEvent: ScheduleEvent = {
    id: scheduleEvents.length + 1,
    ...eventData,
  }

  return newEvent
}

export const updateScheduleEvent = async (id: number, eventData: Partial<ScheduleEvent>): Promise<ScheduleEvent> => {
  await delay(FAKE_DELAY)

  const eventIndex = scheduleEvents.findIndex((event) => event.id === id)
  if (eventIndex === -1) {
    throw new Error("Không tìm thấy sự kiện lịch học")
  }

  const updatedEvent = { ...scheduleEvents[eventIndex], ...eventData }
  return updatedEvent
}

export const deleteScheduleEvent = async (id: number): Promise<boolean> => {
  await delay(FAKE_DELAY)
  return true
}

// API NOTIFICATIONS
export const fetchNotifications = async (): Promise<Notification[]> => {
  await delay(FAKE_DELAY)
  return [...notifications]
}

export const sendNotification = async (
  title: string,
  content: string,
  recipientType: string,
  recipients?: string[],
): Promise<boolean> => {
  await delay(FAKE_DELAY)
  return true
}

