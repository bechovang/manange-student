import { ScheduleEvent, TeacherWithSubjectType } from "./type"

const BASE_URL = "https://your-api-domain.com/api/schedule"

// Giả lập dữ liệu mẫu
const fallbackTeachers: TeacherWithSubjectType[] = [
  { id: "teacher1", name: "Nguyễn Văn A", subject: "Toán" },
  { id: "teacher2", name: "Trần Thị B", subject: "Lý" },
  { id: "teacher3", name: "Lê Văn C", subject: "Hóa" },
  { id: "teacher4", name: "Phạm Thị D", subject: "Sinh" },
  { id: "teacher5", name: "Hoàng Văn E", subject: "Anh Văn" },
]

const fallbackSchedule: ScheduleEvent[] = [
  {
    id: "1",
    className: "Toán 10A",
    teacherId: "teacher1",
    teacherName: "Nguyễn Văn A",
    subject: "Toán",
    room: "P.201",
    dayOfWeek: "2",
    startTime: "07:00",
    endTime: "08:30",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
  },
  // Thêm lịch mẫu nếu muốn
]

// ================= API ===================

export async function fetchTeachers(): Promise<TeacherWithSubjectType[]> {
  try {
    const res = await fetch(`${BASE_URL}/teachers`)
    if (!res.ok) throw new Error("Failed to fetch")
    return await res.json()
  } catch {
    console.warn("Sử dụng dữ liệu mẫu giáo viên")
    return fallbackTeachers
  }
}

export async function fetchSchedule(): Promise<ScheduleEvent[]> {
  try {
    const res = await fetch(`${BASE_URL}/events`)
    if (!res.ok) throw new Error("Failed to fetch")
    return await res.json()
  } catch {
    console.warn("Sử dụng dữ liệu mẫu lịch học")
    return fallbackSchedule
  }
}

export async function createScheduleEvent(data: Omit<ScheduleEvent, "id" | "teacherName" | "subject">) {
  try {
    const res = await fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to create")
    return await res.json()
  } catch (error) {
    throw new Error("Không thể thêm lịch học.")
  }
}

export async function updateScheduleEvent(id: string, data: Partial<ScheduleEvent>) {
  try {
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update")
    return await res.json()
  } catch (error) {
    throw new Error("Không thể cập nhật lịch học.")
  }
}

export async function deleteScheduleEvent(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/events/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete")
    return true
  } catch (error) {
    throw new Error("Không thể xóa lịch học.")
  }
}

export async function fetchTeacherById(id: string): Promise<TeacherWithSubjectType | undefined> {
  try {
    const teachers = await fetchTeachers()
    return teachers.find((t) => t.id === id)
  } catch {
    return undefined
  }
}
