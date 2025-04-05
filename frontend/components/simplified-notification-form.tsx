"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, BookOpen, UserCheck } from "lucide-react"

const formSchema = z.object({
  template: z.string().optional(),
  title: z.string().min(1, {
    message: "Vui lòng nhập tiêu đề thông báo",
  }),
  content: z.string().min(10, {
    message: "Nội dung phải có ít nhất 10 ký tự",
  }),
  recipientType: z.enum(["class", "teacher", "all"], {
    required_error: "Vui lòng chọn loại người nhận",
  }),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
  sendNow: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

// Dữ liệu mẫu - sẽ được thay thế bằng API call
// API: GET /api/classes - Lấy danh sách lớp học
const classes = [
  { id: "class1", name: "Toán 10A", teacher: "Nguyễn Văn X", students: 15 },
  { id: "class2", name: "Anh Văn 11B", teacher: "Trần Thị Y", students: 12 },
  { id: "class3", name: "Lý 12A", teacher: "Lê Văn Z", students: 10 },
  { id: "class4", name: "Hóa 11A", teacher: "Phạm Thị W", students: 8 },
  { id: "class5", name: "Toán 9A", teacher: "Hoàng Văn V", students: 14 },
]

// API: GET /api/teachers - Lấy danh sách giáo viên
const teachers = [
  { id: "teacher1", name: "Nguyễn Văn X", subject: "Toán" },
  { id: "teacher2", name: "Trần Thị Y", subject: "Anh Văn" },
  { id: "teacher3", name: "Lê Văn Z", subject: "Lý" },
  { id: "teacher4", name: "Phạm Thị W", subject: "Hóa" },
  { id: "teacher5", name: "Hoàng Văn V", subject: "Sinh" },
]

// API: GET /api/notification-templates - Lấy danh sách mẫu thông báo
const templates = {
  fee_reminder: {
    title: "Nhắc đóng học phí tháng 6/2023",
    content:
      "Kính gửi Quý phụ huynh,\n\nTrung tâm Ánh Bình Minh xin thông báo học phí tháng 6/2023 của học sinh [Tên học sinh] là [Số tiền]đ.\n\nVui lòng đóng học phí trước ngày 05/06/2023.\n\nTrân trọng,\nTrung tâm Ánh Bình Minh",
    preview:
      "Kính gửi Quý phụ huynh,\n\nTrung tâm Ánh Bình Minh xin thông báo học phí tháng 6/2023 của học sinh Nguyễn Văn A là 1,500,000đ.\n\nVui lòng đóng học phí trước ngày 05/06/2023.\n\nTrân trọng,\nTrung tâm Ánh Bình Minh",
  },
  exam_schedule: {
    title: "Lịch thi cuối kỳ",
    content:
      "Kính gửi Quý phụ huynh,\n\nTrung tâm Ánh Bình Minh xin thông báo lịch thi cuối kỳ của học sinh [Tên học sinh] như sau:\n\n- Môn Toán: 15/06/2023 (8:00 - 9:30)\n- Môn Văn: 16/06/2023 (8:00 - 9:30)\n- Môn Anh: 17/06/2023 (8:00 - 9:30)\n\nVui lòng cho học sinh đi học đầy đủ và đúng giờ.\n\nTrân trọng,\nTrung tâm Ánh Bình Minh",
    preview:
      "Kính gửi Quý phụ huynh,\n\nTrung tâm Ánh Bình Minh xin thông báo lịch thi cuối kỳ của học sinh Nguyễn Văn A như sau:\n\n- Môn Toán: 15/06/2023 (8:00 - 9:30)\n- Môn Văn: 16/06/2023 (8:00 - 9:30)\n- Môn Anh: 17/06/2023 (8:00 - 9:30)\n\nVui lòng cho học sinh đi học đầy đủ và đúng giờ.\n\nTrân trọng,\nTrung tâm Ánh Bình Minh",
  },
  custom: {
    title: "",
    content: "",
    preview: "",
  },
}

export function SimplifiedNotificationForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [previewContent, setPreviewContent] = useState("")

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      template: "",
      title: "",
      content: "",
      recipientType: "class",
      sendNow: true,
    },
  })

  // Handle template selection
  const handleTemplateChange = (value: string) => {
    const template = templates[value as keyof typeof templates] || templates.custom

    form.setValue("title", template.title)
    form.setValue("content", template.content)
    form.setValue("template", value)

    setPreviewContent(template.preview)
  }

  // Handle content changes for custom template
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    form.setValue("content", newContent)

    // Only update preview for custom templates
    if (form.getValues("template") === "custom") {
      setPreviewContent(newContent)
    }
  }

  // Get recipient count based on current form values
  const getRecipientCount = () => {
    const recipientType = form.getValues("recipientType")
    const classId = form.getValues("classId")
    const teacherId = form.getValues("teacherId")

    switch (recipientType) {
      case "class":
        const selectedClass = classes.find((c) => c.id === classId)
        return selectedClass ? `${selectedClass.students} học sinh (Lớp ${selectedClass.name})` : "Chưa chọn lớp"
      case "teacher":
        const selectedTeacher = teachers.find((t) => t.id === teacherId)
        return selectedTeacher ? `Học sinh của giáo viên ${selectedTeacher.name}` : "Chưa chọn giáo viên"
      case "all":
        return "Tất cả học sinh"
      default:
        return "Chưa xác định"
    }
  }

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    try {
      // API: POST /api/notifications - Gửi thông báo
      // Request body: {
      //   title: string,
      //   content: string,
      //   recipientType: "class" | "teacher" | "all",
      //   classId?: string,
      //   teacherId?: string,
      //   sendNow: boolean
      // }
      // Response: { success: boolean, messageId: string, recipientCount: number }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Thông báo đã được gửi",
        description: "Thông báo đã được gửi thành công đến người nhận",
      })

      // Reset form
      form.reset({
        template: "",
        title: "",
        content: "",
        recipientType: "class",
        sendNow: true,
      })

      setPreviewContent("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi thông báo",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Soạn thông báo</CardTitle>
          <CardDescription>Soạn thông báo để gửi đến phụ huynh qua Zalo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mẫu thông báo</FormLabel>
                    <Select onValueChange={handleTemplateChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mẫu thông báo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fee_reminder">Nhắc đóng học phí</SelectItem>
                        <SelectItem value="exam_schedule">Lịch thi</SelectItem>
                        <SelectItem value="custom">Tùy chỉnh</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề thông báo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung thông báo"
                        className="min-h-32"
                        {...field}
                        onChange={handleContentChange}
                      />
                    </FormControl>
                    <FormDescription>Sử dụng [Tên học sinh], [Số tiền] để thay thế thông tin tự động</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người nhận</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đối tượng nhận" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="class">Theo lớp</SelectItem>
                        <SelectItem value="teacher">Theo giáo viên</SelectItem>
                        <SelectItem value="all">Tất cả học sinh</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("recipientType") === "class" && (
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lớp</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn lớp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name} - {cls.teacher} ({cls.students} học sinh)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("recipientType") === "teacher" && (
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giáo viên</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giáo viên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name} - {teacher.subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="sendNow"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Gửi ngay</FormLabel>
                      <FormDescription>Nếu không chọn, thông báo sẽ được lưu vào bản nháp</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Gửi thông báo
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xem trước</CardTitle>
          <CardDescription>Xem trước thông báo trước khi gửi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-700 flex items-center justify-center text-white">ABM</div>
                <div>
                  <p className="font-medium">Trung tâm Ánh Bình Minh</p>
                  <p className="text-xs text-muted-foreground">{form.watch("title") || "Tiêu đề thông báo"}</p>
                </div>
              </div>
              <div className="whitespace-pre-line">{previewContent || "Nội dung thông báo sẽ hiển thị ở đây"}</div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-4">
                {form.watch("recipientType") === "class" && <BookOpen className="h-5 w-5 text-red-700" />}
                {form.watch("recipientType") === "teacher" && <UserCheck className="h-5 w-5 text-red-700" />}
                {form.watch("recipientType") === "all" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-red-700"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )}
                <div>
                  <p className="font-medium">Người nhận</p>
                  <p className="text-sm text-muted-foreground">{getRecipientCount()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {form.watch("sendNow") ? "Thông báo sẽ được gửi ngay" : "Thông báo sẽ được lưu vào bản nháp"}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

