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

const scheduleFormSchema = z.object({
  className: z.string().min(1, { message: "Vui lòng nhập tên lớp học" }),
  teacher: z.string().min(1, { message: "Vui lòng chọn giáo viên" }),
  subject: z.string().min(1, { message: "Vui lòng chọn môn học" }),
  room: z.string().min(1, { message: "Vui lòng nhập phòng học" }),
  dayOfWeek: z.array(z.string()).min(1, { message: "Vui lòng chọn ít nhất một ngày trong tuần" }),
  startTime: z.string().min(1, { message: "Vui lòng nhập giờ bắt đầu" }),
  endTime: z.string().min(1, { message: "Vui lòng nhập giờ kết thúc" }),
  startDate: z.string().min(1, { message: "Vui lòng nhập ngày bắt đầu" }),
  endDate: z.string().min(1, { message: "Vui lòng nhập ngày kết thúc" }),
})

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>

export function AddScheduleForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      className: "",
      teacher: "",
      subject: "",
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
      // Mô phỏng gọi API
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Môn học</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn môn học" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="math">Toán</SelectItem>
                        <SelectItem value="physics">Lý</SelectItem>
                        <SelectItem value="chemistry">Hóa</SelectItem>
                        <SelectItem value="biology">Sinh</SelectItem>
                        <SelectItem value="english">Anh Văn</SelectItem>
                        <SelectItem value="literature">Văn</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

