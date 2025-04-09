import { z } from "zod"

export type StudentStatus = "no class" | "present" | "absent" | "late"

export type Student = {
  id: string | number
  name: string
  phoneStudent: string
  phoneParent: string
  facebookLink: string
  school: string
  subjects: string[]
  grade: string
  teacher: string
  classTime: string
  status: StudentStatus
  note: string
  dateOfBirth: string
  gender: "male" | "female"
  balance: number
  balanceMonths: number
  enrollDate?: string
}

export type StudentFormValues = {
  name: string
  phoneStudent: string
  phoneParent: string
  facebookLink: string
  school: string
  note: string
  dateOfBirth: string
  gender: "male" | "female"
  enrollDate: string
}



export const studentFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên học sinh"),
  phoneStudent: z.string().min(1, "Vui lòng nhập số điện thoại học sinh"),
  phoneParent: z.string().min(1, "Vui lòng nhập số điện thoại phụ huynh"),
  facebookLink: z.string().default(""),
  school: z.string().min(1, "Vui lòng nhập trường đang học"),
  subjects: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một môn học"),
  grade: z.string().min(1, "Vui lòng chọn khối lớp"),
  teacher: z.string().min(1, "Vui lòng chọn giáo viên"),
  classTime: z.string().min(1, "Vui lòng chọn ca học"),
  status: z.enum(["no class", "present", "absent", "late"] as const),
  note: z.string().default(""),
  dateOfBirth: z.string().min(1, "Vui lòng nhập ngày sinh"),
  gender: z.enum(["male", "female"] as const)
}) 