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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, PlusCircle } from "lucide-react"

// Danh sách giáo viên và môn học tương ứng
const TEACHERS = [
  { id: "teacher1", name: "Nguyễn Văn A", subject: "Toán" },
  { id: "teacher2", name: "Trần Thị B", subject: "Lý" },
  { id: "teacher3", name: "Lê Văn C", subject: "Hóa" },
  { id: "teacher4", name: "Phạm Thị D", subject: "Sinh" },
  { id: "teacher5", name: "Hoàng Văn E", subject: "Anh Văn" },
]

// Định nghĩa schema cho biểu mẫu thêm lịch học sử dụng Zod
const scheduleFormSchema = z.object({
  className: z.string().min(1, { message: "Vui lòng nhập tên lớp học" }),
  teacherWithSubject: z.string().min(1, { message: "Vui lòng chọn giáo viên" }),
  room: z.string().min(1, { message: "Vui lòng nhập phòng học" }),
  dayOfWeek: z.array(z.string()).min(1, { message: "Vui lòng chọn ít nhất một ngày trong tuần" }),
  startTime: z.string().min(1, { message: "Vui lòng nhập giờ bắt đầu" }),
  endTime: z.string().min(1, { message: "Vui lòng nhập giờ kết thúc" }),
  startDate: z.string().min(1, { message: "Vui lòng nhập ngày bắt đầu" }),
  endDate: z.string().min(1, { message: "Vui lòng nhập ngày kết thúc" }),
})

// Loại dữ liệu cho biểu mẫu
type ScheduleFormValues = z.infer<typeof scheduleFormSchema>

// Component thêm lịch học
export function AddScheduleForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      className: "",
      teacherWithSubject: "",
      room: "",
      dayOfWeek: [],
      startTime: "",
      endTime: "",
      startDate: "",
      endDate: "",
    },
  })

  async function onSubmit(values: ScheduleFormValues) {
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log(values)

      toast({
        title: "Thêm lịch học thành công",
        description: `Đã thêm lịch học lớp ${values.className} vào hệ thống.`,
      })

      form.reset()
      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể thêm lịch học. Vui lòng thử lại sau.",
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
          Thêm lịch học
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm lịch học mới</DialogTitle>
          <DialogDescription>Nhập thông tin lịch học mới vào biểu mẫu bên dưới.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Input cho tên lớp học */}
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên lớp học</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên lớp học (VD: Toán 10A)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chọn giáo viên và môn học (gộp chung) */}
            <FormField
              control={form.control}
              name="teacherWithSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giáo viên - Môn học</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giáo viên và môn học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEACHERS.map((teacher) => (
                        <SelectItem 
                          key={teacher.id} 
                          value={`${teacher.id}-${teacher.subject}`}
                        >
                          {teacher.name} - {teacher.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nhập phòng học */}
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng học</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập phòng học (VD: P.201)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chọn ngày học trong tuần (vẫn giữ nguyên chọn nhiều ngày) */}
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày học trong tuần</FormLabel>
                  <FormDescription>Chọn các ngày học trong tuần</FormDescription>
                  <div className="grid grid-cols-7 gap-2">
                    {[
                      { value: "2", label: "Thứ 2" },
                      { value: "3", label: "Thứ 3" },
                      { value: "4", label: "Thứ 4" },
                      { value: "5", label: "Thứ 5" },
                      { value: "6", label: "Thứ 6" },
                      { value: "7", label: "Thứ 7" },
                      { value: "cn", label: "CN" },
                    ].map((day) => (
                      <Button
                        key={day.value}
                        type="button"
                        variant={field.value.includes(day.value) ? "default" : "outline"}
                        className={field.value.includes(day.value) ? "bg-red-700 hover:bg-red-800" : ""}
                        onClick={() => {
                          const updatedValue = field.value.includes(day.value)
                            ? field.value.filter((val) => val !== day.value)
                            : [...field.value, day.value]
                          field.onChange(updatedValue)
                        }}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nhập giờ bắt đầu và kết thúc */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ kết thúc</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nhập ngày bắt đầu và kết thúc */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nút xác nhận và hủy */}
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
                  "Thêm lịch học"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}