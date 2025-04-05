import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Hàm định dạng tiền tệ
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Lấy ngày hiện tại trong tuần (0 = Chủ nhật, 1 = Thứ 2, ...)
export const getCurrentDay = (): number => {
  return new Date().getDay()
}

// Hàm lấy số tuần trong năm
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Hàm lấy ngày trong tuần dựa trên ngày hiện tại
export function getDateForDay(currentDate: Date, day: number): Date {
  const result = new Date(currentDate)
  const currentDay = currentDate.getDay()
  const diff = day - currentDay
  result.setDate(result.getDate() + diff)
  return result
}

// Hàm tạo các ngày trong tháng cho lịch
export function generateCalendarDays(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()

  // Ngày đầu tiên của tháng
  const firstDay = new Date(year, month, 1)
  // Ngày cuối cùng của tháng
  const lastDay = new Date(year, month + 1, 0)

  // Ngày trong tuần của ngày đầu tiên (0 = Chủ nhật, 1 = Thứ 2, ...)
  const firstDayOfWeek = firstDay.getDay()
  // Điều chỉnh để tuần bắt đầu từ Thứ 2
  const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  // Số ngày trong tháng
  const daysInMonth = lastDay.getDate()

  // Mảng chứa các ngày
  const days = []

  // Thêm các ngày của tháng trước
  for (let i = adjustedFirstDayOfWeek - 1; i >= 0; i--) {
    const prevMonthDay = new Date(year, month, -i)
    days.push({
      date: prevMonthDay,
      currentMonth: false,
    })
  }

  // Thêm các ngày của tháng hiện tại
  for (let i = 1; i <= daysInMonth; i++) {
    const currentMonthDay = new Date(year, month, i)
    days.push({
      date: currentMonthDay,
      currentMonth: true,
    })
  }

  // Thêm các ngày của tháng sau để đủ 42 ô (6 hàng x 7 cột)
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDay = new Date(year, month + 1, i)
    days.push({
      date: nextMonthDay,
      currentMonth: false,
    })
  }

  return days
}

// Hàm lấy trạng thái CSS dựa trên trạng thái thanh toán
export function getTuitionStatusClass(status: string): string {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "unpaid-1":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "unpaid-2":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    default:
      return ""
  }
}

// Hàm lấy trạng thái CSS dựa trên phương thức thanh toán
export function getPaymentMethodClass(method: string): string {
  return method === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
}

// Hàm lấy trạng thái CSS dựa trên trạng thái điểm danh
export function getAttendanceStatusClass(status: string): string {
  switch (status) {
    case "present":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "absent":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "late":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    default:
      return ""
  }
}

