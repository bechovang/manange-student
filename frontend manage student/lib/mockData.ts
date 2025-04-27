import type {
  Student,
  Teacher,
  Class,
  Payment,
  TuitionRecord,
  ScheduleEvent,
  Attendance,
  Notification,
  Subject,
} from "./types"

// Danh sách các môn học
export const subjects: Subject[] = [
  { id: "math", label: "Toán" },
  { id: "physics", label: "Lý" },
  { id: "chemistry", label: "Hóa" },
  { id: "biology", label: "Sinh" },
  { id: "english", label: "Anh Văn" },
  { id: "literature", label: "Văn" },
]

// Mảng màu cho các giáo viên
export const teacherColors = [
  "bg-red-100 text-red-800 border-red-200",
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-orange-100 text-orange-800 border-orange-200",
]

// Dữ liệu mẫu giáo viên
export const teachers: Teacher[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    subject: "Toán",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 0,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    id: 2,
    name: "Trần Thị B",
    subject: "Anh Văn",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 1,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: 3,
    name: "Lê Văn C",
    subject: "Lý",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 2,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    subject: "Hóa",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 3,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    subject: "Sinh",
    avatar: "/placeholder.svg?height=40&width=40",
    colorIndex: 4,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
]

// Dữ liệu lớp học mẫu
export const classes: Class[] = [
  {
    id: "CLASS001",
    name: "Toán 10A",
    teacherId: 1,
    students: 15,
    schedule: "Thứ 2, 4, 6 (18:00 - 19:30)",
    status: "active",
  },
  {
    id: "CLASS002",
    name: "Anh Văn 11B",
    teacherId: 2,
    students: 12,
    schedule: "Thứ 3, 5, 7 (18:00 - 19:30)",
    status: "active",
  },
  {
    id: "CLASS003",
    name: "Lý 12A",
    teacherId: 3,
    students: 10,
    schedule: "Thứ 2, 4, 6 (19:30 - 21:00)",
    status: "active",
  },
  {
    id: "CLASS004",
    name: "Hóa 11A",
    teacherId: 4,
    students: 8,
    schedule: "Thứ 3, 5, 7 (19:30 - 21:00)",
    status: "upcoming",
  },
  {
    id: "CLASS005",
    name: "Sinh 10B",
    teacherId: 5,
    students: 14,
    schedule: "Thứ 2, 4, 6 (17:00 - 18:30)",
    status: "active",
  },
  {
    id: "CLASS006",
    name: "Toán 11C",
    teacherId: 1,
    students: 16,
    schedule: "Thứ 3, 5, 7 (17:00 - 18:30)",
    status: "active",
  },
  {
    id: "CLASS007",
    name: "Anh Văn 10C",
    teacherId: 2,
    students: 18,
    schedule: "Thứ 2, 4, 6 (15:30 - 17:00)",
    status: "completed",
  },
  {
    id: "CLASS008",
    name: "Lý 11D",
    teacherId: 3,
    students: 9,
    schedule: "Thứ 3, 5, 7 (15:30 - 17:00)",
    status: "upcoming",
  },
]

// Dữ liệu học sinh mẫu
export const students: Student[] = [
  {
    id: "STU001",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    parentPhone: "0909876543",
    facebook: "facebook.com/nguyenvana",
    school: "THPT Nguyễn Du",
    subjects: ["Toán", "Lý"],
    grade: "Lớp 10",
    teacher: "Nguyễn Văn X",
    classTime: "Tối 2-4-6",
    status: "active",
    notes: "Học sinh chăm chỉ",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "01/06/2023",
    balance: 1500000,
    balanceMonths: 1,
  },
  {
    id: "STU002",
    name: "Trần Thị B",
    phone: "0901234568",
    parentPhone: "0909876544",
    facebook: "facebook.com/tranthib",
    school: "THPT Lê Quý Đôn",
    subjects: ["Anh Văn"],
    grade: "Lớp 11",
    teacher: "Trần Văn Y",
    classTime: "Tối 3-5-7",
    status: "active",
    notes: "Học sinh năng động",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "15/05/2023",
    balance: -1800000,
    balanceMonths: -1,
  },
  {
    id: "STU003",
    name: "Lê Văn C",
    phone: "0901234569",
    parentPhone: "0909876545",
    facebook: "facebook.com/levanc",
    school: "THPT Chu Văn An",
    subjects: ["Lý", "Hóa"],
    grade: "Lớp 12",
    teacher: "Lê Văn Z",
    classTime: "Chiều 2-4-6",
    status: "inactive",
    notes: "Học sinh cần cải thiện",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "10/04/2023",
    balance: -4000000,
    balanceMonths: -2,
  },
  {
    id: "STU004",
    name: "Phạm Thị D",
    phone: "0901234570",
    parentPhone: "0909876546",
    facebook: "facebook.com/phamthid",
    school: "THPT Nguyễn Trãi",
    subjects: ["Hóa", "Sinh"],
    grade: "Lớp 11",
    teacher: "Phạm Văn W",
    classTime: "Chiều 3-5-7",
    status: "active",
    notes: "",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "20/05/2023",
    balance: 0,
    balanceMonths: 0,
  },
  {
    id: "STU005",
    name: "Hoàng Văn E",
    phone: "0901234571",
    parentPhone: "0909876547",
    facebook: "facebook.com/hoangvane",
    school: "THPT Lê Hồng Phong",
    subjects: ["Toán", "Anh Văn"],
    grade: "Lớp 10",
    teacher: "Hoàng Văn V",
    classTime: "Sáng 7-CN",
    status: "active",
    notes: "Học sinh tiến bộ",
    avatar: "/placeholder.svg?height=40&width=40",
    enrollmentDate: "05/06/2023",
    balance: 3000000,
    balanceMonths: 2,
  },
]

// Dữ liệu thanh toán mẫu
export const payments: Payment[] = [
  {
    id: "INV001",
    student: "Nguyễn Văn A",
    class: "Toán 10A",
    amount: 1500000,
    paymentDate: "30/06/2023 08:15",
    status: "paid",
    months: 0,
    paymentMethod: "cash",
  },
  {
    id: "INV002",
    student: "Trần Thị B",
    class: "Anh Văn 11B",
    amount: 1800000,
    paymentDate: "25/06/2023 14:30",
    status: "unpaid-1",
    months: 1,
    paymentMethod: "transfer",
  },
  {
    id: "INV003",
    student: "Lê Văn C",
    class: "Lý 12A",
    amount: 2000000,
    paymentDate: "20/06/2023 09:45",
    status: "unpaid-2",
    months: 3,
    paymentMethod: "cash",
  },
  {
    id: "INV004",
    student: "Phạm Thị D",
    class: "Hóa 11A",
    amount: 1800000,
    paymentDate: "15/06/2023 16:20",
    status: "paid",
    months: 0,
    paymentMethod: "transfer",
  },
  {
    id: "INV005",
    student: "Hoàng Văn E",
    class: "Toán 9A",
    amount: 1500000,
    paymentDate: "10/06/2023 11:10",
    status: "unpaid-2",
    months: 2,
    paymentMethod: "cash",
  },
]

// Dữ liệu học phí mẫu
export const tuitionRecords: TuitionRecord[] = [
  {
    id: "STU001",
    student: "Nguyễn Văn A",
    class: "Toán 10A",
    amount: 1500000,
    dueDate: "05/07/2023",
    status: "paid",
    months: 0,
    lastPayment: "30/06/2023",
  },
  {
    id: "STU002",
    student: "Trần Thị B",
    class: "Anh Văn 11B",
    amount: 1800000,
    dueDate: "05/07/2023",
    status: "unpaid-1",
    months: 1,
    lastPayment: "31/05/2023",
  },
  {
    id: "STU003",
    student: "Lê Văn C",
    class: "Lý 12A",
    amount: 2000000,
    dueDate: "05/07/2023",
    status: "unpaid-2",
    months: 3,
    lastPayment: "31/03/2023",
  },
  {
    id: "STU004",
    student: "Phạm Thị D",
    class: "Hóa 11A",
    amount: 1800000,
    dueDate: "05/07/2023",
    status: "paid",
    months: 0,
    lastPayment: "28/06/2023",
  },
  {
    id: "STU005",
    student: "Hoàng Văn E",
    class: "Toán 9A",
    amount: 1500000,
    dueDate: "05/07/2023",
    status: "unpaid-2",
    months: 2,
    lastPayment: "30/04/2023",
  },
]

// Dữ liệu lịch học mẫu
export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 1,
    title: "Toán 10A",
    teacherId: 1,
    day: 1, // Thứ 2
    startTime: "18:00",
    endTime: "19:30",
    room: "P.201",
  },
  {
    id: 2,
    title: "Anh Văn 11B",
    teacherId: 2,
    day: 2, // Thứ 3
    startTime: "18:00",
    endTime: "19:30",
    room: "P.202",
  },
  {
    id: 3,
    title: "Lý 12A",
    teacherId: 3,
    day: 1, // Thứ 2
    startTime: "19:30",
    endTime: "21:00",
    room: "P.203",
  },
  {
    id: 4,
    title: "Hóa 11A",
    teacherId: 4,
    day: 2, // Thứ 3
    startTime: "19:30",
    endTime: "21:00",
    room: "P.204",
  },
  {
    id: 5,
    title: "Sinh 10B",
    teacherId: 5,
    day: 1, // Thứ 2
    startTime: "17:00",
    endTime: "18:30",
    room: "P.205",
  },
  {
    id: 6,
    title: "Toán 11C",
    teacherId: 1,
    day: 2, // Thứ 3
    startTime: "17:00",
    endTime: "18:30",
    room: "P.206",
  },
  {
    id: 7,
    title: "Anh Văn 10C",
    teacherId: 2,
    day: 1, // Thứ 2
    startTime: "15:30",
    endTime: "17:00",
    room: "P.207",
  },
  {
    id: 8,
    title: "Lý 11D",
    teacherId: 3,
    day: 2, // Thứ 3
    startTime: "15:30",
    endTime: "17:00",
    room: "P.208",
  },
]

// Dữ liệu điểm danh mẫu
export const attendanceData: Attendance[] = [
  {
    id: "STU001",
    name: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "present",
  },
  {
    id: "STU002",
    name: "Trần Thị B",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "present",
  },
  {
    id: "STU003",
    name: "Lê Văn C",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "absent",
  },
  {
    id: "STU004",
    name: "Phạm Thị D",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "present",
  },
  {
    id: "STU005",
    name: "Hoàng Văn E",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "late",
  },
]

// Lịch sử điểm danh
export const attendanceHistory = [
  {
    date: "30/06/2023",
    present: 12,
    absent: 2,
    late: 1,
  },
  {
    date: "28/06/2023",
    present: 13,
    absent: 1,
    late: 1,
  },
  {
    date: "26/06/2023",
    present: 14,
    absent: 1,
    late: 0,
  },
  {
    date: "23/06/2023",
    present: 11,
    absent: 3,
    late: 1,
  },
  {
    date: "21/06/2023",
    present: 12,
    absent: 2,
    late: 1,
  },
]

// Dữ liệu lịch sử thông báo
export const notifications: Notification[] = [
  {
    id: "NOT001",
    title: "Nhắc đóng học phí tháng 6/2023",
    recipients: "Tất cả học sinh",
    sentDate: "01/06/2023 08:15",
    status: "success",
    successRate: 100,
  },
  {
    id: "NOT002",
    title: "Lịch thi cuối kỳ",
    recipients: "Lớp Toán 10A",
    sentDate: "05/06/2023 10:30",
    status: "partial",
    successRate: 90,
  },
  {
    id: "NOT003",
    title: "Thông báo nghỉ lễ",
    recipients: "Tất cả học sinh",
    sentDate: "10/06/2023 14:45",
    status: "success",
    successRate: 100,
  },
  {
    id: "NOT004",
    title: "Nhắc đóng học phí tháng 6/2023",
    recipients: "Học sinh chưa đóng học phí",
    sentDate: "15/06/2023 09:00",
    status: "partial",
    successRate: 85,
  },
  {
    id: "NOT005",
    title: "Thông báo họp phụ huynh",
    recipients: "Lớp Lý 12A",
    sentDate: "20/06/2023 16:30",
    status: "failed",
    successRate: 0,
  },
]

// Thông tin mẫu thông báo
export const notificationTemplates = {
  fee_reminder: {
    title: "Nhắc đóng học phí tháng 6/2023",
    content:
      "Kính gửi Quý phụ huynh,\n\nBechovang xin thông báo học phí tháng 6/2023 của học sinh [Tên học sinh] là [Số tiền]đ.\n\nVui lòng đóng học phí trước ngày 05/06/2023.\n\nTrân trọng,\nBechovang",
    preview:
      "Kính gửi Quý phụ huynh,\n\nBechovang xin thông báo học phí tháng 6/2023 của học sinh Nguyễn Văn A là 1,500,000đ.\n\nVui lòng đóng học phí trước ngày 05/06/2023.\n\nTrân trọng,\nBechovang",
  },
  exam_schedule: {
    title: "Lịch thi cuối kỳ",
    content:
      "Kính gửi Quý phụ huynh,\n\nBechovang xin thông báo lịch thi cuối kỳ của học sinh [Tên học sinh] như sau:\n\n- Môn Toán: 15/06/2023 (8:00 - 9:30)\n- Môn Văn: 16/06/2023 (8:00 - 9:30)\n- Môn Anh: 17/06/2023 (8:00 - 9:30)\n\nVui lòng cho học sinh đi học đầy đủ và đúng giờ.\n\nTrân trọng,\nBechovang",
    preview:
      "Kính gửi Quý phụ huynh,\n\nBechovang xin thông báo lịch thi cuối kỳ của học sinh Nguyễn Văn A như sau:\n\n- Môn Toán: 15/06/2023 (8:00 - 9:30)\n- Môn Văn: 16/06/2023 (8:00 - 9:30)\n- Môn Anh: 17/06/2023 (8:00 - 9:30)\n\nVui lòng cho học sinh đi học đầy đủ và đúng giờ.\n\nTrân trọng,\nBechovang",
  },
  custom: {
    title: "",
    content: "",
    preview: "",
  },
}

// Thời gian học
export const timeSlots = [
  "07:00 - 08:30",
  "08:30 - 10:00",
  "10:00 - 11:30",
  "13:30 - 15:00",
  "15:30 - 17:00",
  "17:00 - 18:30",
  "18:00 - 19:30",
  "19:30 - 21:00",
]

// Tên các ngày trong tuần
export const weekDays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]

