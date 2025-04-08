/**
 * Đây là file mẫu API client để tương tác với backend.
 * Trong môi trường thực tế, các hàm này sẽ gọi đến các API endpoint thực.
 * Hiện tại, chúng sử dụng dữ liệu mẫu để mô phỏng các cuộc gọi API.
 */

import type { Student, Class, Payment, TuitionRecord, Attendance, ScheduleEvent, Notification } from "./types"
import { students, classes, payments, tuitionRecords, attendanceData, scheduleEvents, notifications } from "./mockData"
import axios from "axios"
import Cookies from "js-cookie"
import { StudentFormValues } from "@/components/student-crud/types"

// Axios instance cho API calls
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookies
})

// Thêm interceptor để tự động gắn token vào request
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Thêm interceptor để tự động refresh token khi token hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Thử refresh token
        const refreshToken = Cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
        if (!refreshToken) throw new Error("No refresh token")

        const response = await apiClient.post(
          `${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/refresh`,
          { refreshToken }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Lưu token mới
        Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken", accessToken)
        Cookies.set(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken", newRefreshToken)

        // Cập nhật token trong header và thử lại request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (error) {
        // Nếu refresh token lỗi, đăng xuất
        Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
        Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")

        // Chuyển về trang login
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

// API Authentication
export const login = async (username: string, password: string) => {
  try {
    console.log("Calling login API with:", { username });
    const response = await apiClient.post(`${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/login`, {
      username,
      password,
    });
    
    console.log("Login response:", response.data);
    const { accessToken, refreshToken } = response.data;
    
    // Lưu token vào cookies
    Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken", accessToken);
    Cookies.set(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken", refreshToken);
    
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export const logout = async () => {
  try {
    await apiClient.post(`${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/logout`)
  } catch (error) {
    console.error("Logout API failed:", error)
  } finally {
    // Xóa token
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
  }
}

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

export const createStudent = async (studentData: StudentFormValues): Promise<Student> => {
  try {
    const response = await apiClient.post("/api/students", studentData)
    return response.data
  } catch (error) {
    console.error("Error creating student:", error)
    throw error
  }
}

export const updateStudent = async (id: string, studentData: StudentFormValues): Promise<Student> => {
  try {
    const response = await apiClient.put(`/api/students/${id}`, studentData)
    return response.data
  } catch (error) {
    console.error("Error updating student:", error)
    throw error
  }
}

export const deleteStudent = async (id: string): Promise<boolean> => {
  await delay(FAKE_DELAY)

  // TODOTrong môi trường thực tế, đây sẽ là API DELETE
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

