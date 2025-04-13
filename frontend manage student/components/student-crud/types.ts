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
  grade: string
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
  grade: z.string().min(1, "Vui lòng nhập khối lớp"),
  note: z.string().default(""),
  dateOfBirth: z.string().min(1, "Vui lòng nhập ngày sinh"),
  gender: z.enum(["male", "female"] as const),
  enrollDate: z.string().optional()
}) 