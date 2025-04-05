"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { subjects } from "@/lib/mockData"
import { createStudent, updateStudent, deleteStudent } from "@/lib/api"

const studentFormSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập họ và tên" }),
  phone: z.string().min(1, { message: "Vui lòng nhập số điện thoại học sinh" }),
  parentPhone: z.string().min(1, { message: "Vui lòng nhập số điện thoại phụ huynh" }),
  facebook: z.string().optional(),
  school: z.string().min(1, { message: "Vui lòng nhập trường đang học" }),
  subjects: z.array(z.string()).min(1, { message: "Vui lòng chọn ít nhất một môn học" }),
  grade: z.string().min(1, { message: "Vui lòng chọn khối lớp" }),
  teacher: z.string().min(1, { message: "Vui lòng chọn giáo viên" }),
  classTime: z.string().min(1, { message: "Vui lòng chọn ca học" }),
  status: z.string().min(1, { message: "Vui lòng chọn trạng thái" }),
  notes: z.string().optional(),
})

type StudentFormValues = z.infer<typeof studentFormSchema>

export function AddStudentDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      parentPhone: "",
      facebook: "",
      school: "",
      subjects: [],
      grade: "",
      teacher: "",
      classTime: "",
      status: "active",
      notes: "",
    },
  })

  async function onSubmit(values: StudentFormValues) {
    setIsSubmitting(true)

    try {
      await createStudent(values)

      toast({
        title: "Thêm học sinh thành công",
        description: `Đã thêm học sinh ${values.name} vào hệ thống.`,
      })

      form.reset()
      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể thêm học sinh. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-800">
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm học sinh
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm học sinh mới</DialogTitle>
          <DialogDescription>Nhập thông tin học sinh mới vào biểu mẫu bên dưới.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên học sinh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại học sinh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại học sinh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại phụ huynh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại phụ huynh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập link Facebook học sinh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trường đang học</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên trường đang học" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subjects"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Môn học</FormLabel>
                    <FormDescription>Chọn các môn học sinh đăng ký</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {subjects.map((subject) => (
                      <FormField
                        key={subject.id}
                        control={form.control}
                        name="subjects"
                        render={({ field }) => {
                          return (
                            <FormItem key={subject.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(subject.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, subject.id])
                                      : field.onChange(field.value?.filter((value) => value !== subject.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{subject.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khối lớp</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khối lớp" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="grade10">Lớp 10</SelectItem>
                        <SelectItem value="grade11">Lớp 11</SelectItem>
                        <SelectItem value="grade12">Lớp 12</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giáo viên</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giáo viên" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="teacher1">Nguyễn Văn A</SelectItem>
                        <SelectItem value="teacher2">Trần Thị B</SelectItem>
                        <SelectItem value="teacher3">Lê Văn C</SelectItem>
                        <SelectItem value="teacher4">Phạm Thị D</SelectItem>
                        <SelectItem value="teacher5">Hoàng Văn E</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ca học</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ca học" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Sáng 7-CN</SelectItem>
                        <SelectItem value="afternoon246">Chiều 2-4-6</SelectItem>
                        <SelectItem value="afternoon357">Chiều 3-5-7</SelectItem>
                        <SelectItem value="evening246">Tối 2-4-6</SelectItem>
                        <SelectItem value="evening357">Tối 3-5-7</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Đang học</SelectItem>
                      <SelectItem value="inactive">Nghỉ học</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập ghi chú về học sinh (nếu có)" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-red-700 hover:bg-red-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Thêm học sinh"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function EditStudentDialog({ student }: { student: any }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: student.name,
      phone: student.phone,
      parentPhone: student.parentPhone,
      facebook: student.facebook || "",
      school: student.school,
      subjects: student.subjects.map((s: any) => s.toLowerCase()),
      grade: student.grade.toLowerCase().replace(" ", ""),
      teacher: `teacher${student.teacher.split(" ").pop()}`,
      classTime: student.classTime.includes("Tối") ? "evening246" : "morning",
      status: student.status,
      notes: student.notes || "",
    },
  })

  async function onSubmit(values: StudentFormValues) {
    setIsSubmitting(true)

    try {
      await updateStudent(student.id, values)

      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật thông tin học sinh ${values.name}.`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật thông tin học sinh. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Chỉnh sửa</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin học sinh trong biểu mẫu bên dưới.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Giữ nguyên nội dung form giống như AddStudentDialog */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên học sinh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại học sinh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại học sinh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại phụ huynh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại phụ huynh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập link Facebook học sinh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trường đang học</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên trường đang học" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subjects"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Môn học</FormLabel>
                    <FormDescription>Chọn các môn học sinh đăng ký</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {subjects.map((subject) => (
                      <FormField
                        key={subject.id}
                        control={form.control}
                        name="subjects"
                        render={({ field }) => {
                          return (
                            <FormItem key={subject.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(subject.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, subject.id])
                                      : field.onChange(field.value?.filter((value) => value !== subject.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{subject.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khối lớp</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khối lớp" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="grade10">Lớp 10</SelectItem>
                        <SelectItem value="grade11">Lớp 11</SelectItem>
                        <SelectItem value="grade12">Lớp 12</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giáo viên</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giáo viên" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="teacher1">Nguyễn Văn A</SelectItem>
                        <SelectItem value="teacher2">Trần Thị B</SelectItem>
                        <SelectItem value="teacher3">Lê Văn C</SelectItem>
                        <SelectItem value="teacher4">Phạm Thị D</SelectItem>
                        <SelectItem value="teacher5">Hoàng Văn E</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ca học</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ca học" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Sáng 7-CN</SelectItem>
                        <SelectItem value="afternoon246">Chiều 2-4-6</SelectItem>
                        <SelectItem value="afternoon357">Chiều 3-5-7</SelectItem>
                        <SelectItem value="evening246">Tối 2-4-6</SelectItem>
                        <SelectItem value="evening357">Tối 3-5-7</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Đang học</SelectItem>
                      <SelectItem value="inactive">Nghỉ học</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập ghi chú về học sinh (nếu có)" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-red-700 hover:bg-red-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function ViewStudentDialog({ student }: { student: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Xem chi tiết</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Thông tin học sinh</DialogTitle>
          <DialogDescription>Chi tiết thông tin của học sinh {student.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-semibold">
              {student.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Số điện thoại học sinh</h4>
              <p>{student.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Số điện thoại phụ huynh</h4>
              <p>{student.parentPhone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Facebook</h4>
              <p>{student.facebook || "Không có"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Trường học</h4>
              <p>{student.school}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Khối lớp</h4>
              <p>{student.grade}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Giáo viên</h4>
              <p>{student.teacher}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Ca học</h4>
              <p>{student.classTime}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Trạng thái</h4>
              <p>{student.status === "active" ? "Đang học" : "Nghỉ học"}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Môn học</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {student.subjects.map((subject: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Ghi chú</h4>
            <p className="mt-1">{student.notes || "Không có ghi chú"}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteStudentDialog({ student }: { student: any }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  async function handleDelete() {
    setIsDeleting(true)

    try {
      await deleteStudent(student.id)

      toast({
        title: "Xóa học sinh thành công",
        description: `Đã xóa học sinh ${student.name} khỏi hệ thống.`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể xóa học sinh. Vui lòng thử lại sau.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
          <span className="sr-only">Xóa</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xóa học sinh</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa học sinh này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 p-4 border rounded-md">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
            {student.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="font-medium">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.id}</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xóa học sinh"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function StudentActions({ student }: { student: any }) {
  return (
    <div className="flex items-center gap-1">
      <ViewStudentDialog student={student} />
      <EditStudentDialog student={student} />
      <DeleteStudentDialog student={student} />
    </div>
  )
}

