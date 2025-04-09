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

/**
 * API Client với xử lý authentication hoàn chỉnh
 */

// 1. Cấu hình Axios Client
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookies
})

// 2. Hàm tiện ích để log chi tiết lỗi
const logErrorDetails = (error: any) => {
  try {
    if (error && axios.isAxiosError(error)) {
      console.error("Axios Error Details:", {
        message: error?.message || 'Unknown error message',
        code: error?.code || 'Unknown error code',
        status: error?.response?.status || 'No status code',
        statusText: error?.response?.statusText || 'No status text',
        url: error?.config?.url || 'Unknown URL',
        method: error?.config?.method || 'Unknown method',
        requestData: error?.config?.data ? JSON.stringify(error.config.data).substring(0, 200) : 'No request data',
        responseData: error?.response?.data ? JSON.stringify(error.response.data).substring(0, 200) : 'No response data'
      })
    } else {
      console.error("Non-Axios Error:", error instanceof Error ? error.message : String(error || 'Unknown error'))
    }
  } catch (loggingError) {
    // Nếu có lỗi khi logging, ghi log một cách an toàn hơn
    console.error("Error while logging error details:", loggingError)
    console.error("Original error:", error?.message || String(error) || 'Unknown error')
  }
}

// 3. Interceptor để tự động gắn token vào request
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`, { hasToken: !!token })
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("Request Interceptor Error:", error)
    return Promise.reject(error)
  }
)

// 4. Interceptor xử lý refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthRequest = originalRequest?.url?.includes("/auth/")
    
    // Bỏ qua nếu là request auth hoặc đã thử refresh
    if (isAuthRequest || originalRequest?._retry) {
      return Promise.reject(error)
    }

    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      console.log("Attempting token refresh...")
      originalRequest._retry = true
      
      try {
        // Thử refresh token
        const refreshToken = Cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
        if (!refreshToken) throw new Error("No refresh token available")
        
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/refresh`,
          { refreshToken },
          { withCredentials: true }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data
        
        // Lưu token mới
        Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken", accessToken)
        Cookies.set(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken", newRefreshToken || refreshToken)
        
        // Cập nhật token trong header và thử lại request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        logErrorDetails(refreshError)
        console.log("Refresh token failed, redirecting to login...")
        
        // Xóa tokens và chuyển hướng
        Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
        Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
        
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = `/login?sessionExpired=true`
        }
        return Promise.reject(refreshError)
      }
    }

    // Xử lý lỗi 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error("Access forbidden (403)", error.response?.data)
      
      // Xóa token
      Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
      Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
      
      // Chuyển về trang login nếu không phải đang ở trang login
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = `/login?accessDenied=true`
      }
    }

    return Promise.reject(error)
  }
)

// 5. API Authentication
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
    logErrorDetails(error);
    throw error;
  }
}

export const logout = async () => {
  try {
    await apiClient.post(`${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/logout`)
  } catch (error) {
    logErrorDetails(error);
  } finally {
    // Xóa token
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
  }
}

// 6. API kiểm tra token
export const checkToken = async () => {
  try {
    // Chỉ cần kiểm tra xem có token không, backend sẽ tự xác thực bằng JWT filter
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken");
    if (!token) {
      throw new Error("No token found");
    }
    
    // Giả định token hợp lệ nếu tồn tại
    return true;
  } catch (error) {
    logErrorDetails(error);
    throw error;
  }
}

// Thời gian trễ giả lập cho API
const FAKE_DELAY = 500

// Hàm trợ giúp để tạo độ trễ giả lập
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 7. API STUDENTS
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    // Báo lỗi thay vì sử dụng dữ liệu mẫu
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải danh sách học sinh: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải danh sách học sinh: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const fetchStudentById = async (id: string): Promise<Student | undefined> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    // Báo lỗi thay vì sử dụng dữ liệu mẫu
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải thông tin học sinh: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải thông tin học sinh: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const createStudent = async (studentData: StudentFormValues): Promise<Student> => {
  try {
    console.log("Creating student with data:", studentData)
    
    // Kiểm tra dữ liệu đầu vào
    if (!studentData) {
      throw new Error("Dữ liệu học sinh không hợp lệ")
    }
    
    // Đảm bảo cung cấp createdAt từ client
    if (!studentData.enrollDate) {
      studentData.enrollDate = new Date().toISOString().split('T')[0];
    }
    
    // Đổi tên field enrollDate thành createdAt để backend hiểu
    const requestData = {
      ...studentData,
      createdAt: studentData.enrollDate,
    };
    
    // Lấy token trực tiếp từ cookies
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    // Log thông tin API call
    console.log(`Calling API: POST ${process.env.NEXT_PUBLIC_API_URL}/api/students`)
    
    // Gọi API trực tiếp với axios
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    console.log("Create student response:", response.data)
    return response.data
  } catch (error) {
    console.log("Error in createStudent:", error)
    
    logErrorDetails(error)
    
    // Báo lỗi thay vì sử dụng dữ liệu mẫu
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tạo học sinh: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tạo học sinh: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const updateStudent = async (id: string, studentData: StudentFormValues): Promise<Student> => {
  try {
    console.log(`Updating student ${id} with data:`, studentData)
    // Lấy token trực tiếp từ cookies
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    // Gọi API trực tiếp với axios
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`, studentData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    console.log("Update student response:", response.data)
    return response.data
  } catch (error) {
    logErrorDetails(error)
    
    // Báo lỗi thay vì sử dụng dữ liệu mẫu
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể cập nhật học sinh: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể cập nhật học sinh: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting student ${id}`)
    // Lấy token trực tiếp từ cookies
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    // Gọi API trực tiếp với axios
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    console.log(`Student ${id} deleted successfully`)
  return true
  } catch (error) {
    logErrorDetails(error)
    
    // Báo lỗi thay vì giả lập xóa thành công
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể xóa học sinh: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể xóa học sinh: " + (error instanceof Error ? error.message : String(error)))
  }
}

// API CLASSES
export const fetchClasses = async (filterStatus?: string): Promise<Class[]> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`, {
      params: filterStatus ? { status: filterStatus } : undefined,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải danh sách lớp học: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải danh sách lớp học: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const fetchClassById = async (id: string): Promise<Class | undefined> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải thông tin lớp học: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải thông tin lớp học: " + (error instanceof Error ? error.message : String(error)))
  }
}

// API PAYMENTS
export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải danh sách thanh toán: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải danh sách thanh toán: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const createPayment = async (paymentData: Omit<Payment, "id">): Promise<Payment> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tạo thanh toán: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tạo thanh toán: " + (error instanceof Error ? error.message : String(error)))
  }
}

// API TUITION
export const fetchTuition = async (filterStatus?: string): Promise<TuitionRecord[]> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tuition`, {
      params: filterStatus ? { status: filterStatus } : undefined,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải dữ liệu học phí: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải dữ liệu học phí: " + (error instanceof Error ? error.message : String(error)))
  }
}

// API ATTENDANCE
export const fetchAttendance = async (classId?: string, date?: string): Promise<Attendance[]> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance`, {
      params: { classId, date },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải dữ liệu điểm danh: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải dữ liệu điểm danh: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const saveAttendance = async (
  classId: string,
  date: string,
  attendance: Partial<Attendance>[],
): Promise<boolean> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance`, {
      classId,
      date,
      attendance
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  return true
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể lưu dữ liệu điểm danh: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể lưu dữ liệu điểm danh: " + (error instanceof Error ? error.message : String(error)))
  }
}

// API SCHEDULE
export const fetchSchedule = async (view: "day" | "week" | "month"): Promise<ScheduleEvent[]> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule`, {
      params: { view },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải dữ liệu lịch: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải dữ liệu lịch: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const createScheduleEvent = async (eventData: Omit<ScheduleEvent, "id">): Promise<ScheduleEvent> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule`, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tạo sự kiện lịch: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tạo sự kiện lịch: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const updateScheduleEvent = async (id: number, eventData: Partial<ScheduleEvent>): Promise<ScheduleEvent> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${id}`, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể cập nhật sự kiện lịch: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể cập nhật sự kiện lịch: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const deleteScheduleEvent = async (id: number): Promise<boolean> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
  return true
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể xóa sự kiện lịch: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể xóa sự kiện lịch: " + (error instanceof Error ? error.message : String(error)))
  }
}

// API NOTIFICATIONS
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tải thông báo: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tải thông báo: " + (error instanceof Error ? error.message : String(error)))
  }
}

export const sendNotification = async (
  title: string,
  content: string,
  recipientType: string,
  recipients?: string[],
): Promise<boolean> => {
  try {
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/send`, {
      title,
      content,
      recipientType,
      recipients
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return true
  } catch (error) {
    logErrorDetails(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể gửi thông báo: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể gửi thông báo: " + (error instanceof Error ? error.message : String(error)))
  }
}

// 8. Utility để kiểm tra auth status
export const checkAuth = async () => {
  try {
    // Chỉ cần kiểm tra xem có token không
    return await checkToken();
  } catch (error) {
    return false;
  }
}

// 9. Hàm khởi tạo API (để debug)
export const initApiClient = () => {
  console.log("API Client initialized with:")
  console.log("- API URL:", process.env.NEXT_PUBLIC_API_URL)
  console.log("- API Auth Endpoint:", process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT)
  console.log("- JWT Cookie Name:", process.env.NEXT_PUBLIC_JWT_COOKIE_NAME)
  console.log("- Refresh Token Cookie Name:", process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME)
}

