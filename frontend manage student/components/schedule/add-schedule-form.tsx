// add schedule form 

"use client"

import { useEffect, useState } from "react"
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
import { createScheduleEvent, fetchTeachers } from "./api"
import type { teacher } from "./types"

// Danh sách các khung giờ học cố định
const TIME_SLOTS = [
  { id: "slot1", label: "07:00 - 08:30", start: "07:00", end: "08:30" },
  { id: "slot2", label: "08:30 - 10:00", start: "08:30", end: "10:00" },
  { id: "slot3", label: "10:00 - 11:30", start: "10:00", end: "11:30" },
  { id: "slot4", label: "13:30 - 15:00", start: "13:30", end: "15:00" },
  { id: "slot5", label: "15:30 - 17:00", start: "15:30", end: "17:00" },
  { id: "slot6", label: "17:00 - 18:30", start: "17:00", end: "18:30" },
  { id: "slot7", label: "18:00 - 19:30", start: "18:00", end: "19:30" },
  { id: "slot8", label: "19:30 - 21:00", start: "19:30", end: "21:00" },
]

// Ánh xạ từ mã ngày trong tuần tới tên ngày tiếng Anh cho backend
const DAY_TO_WEEKDAY = {
  "2": "mon",
  "3": "tue",
  "4": "wed",
  "5": "thu",
  "6": "fri",
  "7": "sat",
  "cn": "sun"
};

// Định nghĩa schema cho biểu mẫu thêm lịch học sử dụng Zod
const scheduleFormSchema = z.object({
  className: z.string().min(1, { message: "Vui lòng nhập tên lớp học" }),
  teacherWithSubject: z.string().min(1, { message: "Vui lòng chọn giáo viên" }),
  room: z.string().min(1, { message: "Vui lòng nhập phòng học" }),
  dayOfWeek: z.array(z.string()).min(1, { message: "Vui lòng chọn ít nhất một ngày trong tuần" }),
  timeSlot: z.string().min(1, { message: "Vui lòng chọn khung giờ học" }),
  startDate: z.string().min(1, { message: "Vui lòng nhập ngày bắt đầu" }),
  endDate: z.string().min(1, { message: "Vui lòng nhập ngày kết thúc" }),
})

// Loại dữ liệu cho biểu mẫu
type ScheduleFormValues = z.infer<typeof scheduleFormSchema>

// Component hiển thị debug data
const DebugDataDisplay = ({ data }: { data: any }) => {
  if (!data || Object.keys(data).length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black text-white rounded-md shadow-lg z-50 max-w-md max-h-96 overflow-auto opacity-80">
      <div className="font-bold mb-2">Debug Data:</div>
      <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

// Component thêm lịch học
export function AddScheduleForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teachers, setTeachers] = useState<teacher[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [debugData, setDebugData] = useState<any>({})
  const { toast } = useToast()

  // Lấy danh sách giáo viên từ API
  useEffect(() => {
    const getTeachers = async () => {
      setIsLoading(true)
      try {
        const teachersData = await fetchTeachers()
        setTeachers(teachersData)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giáo viên:", error)
        toast({
          variant: "destructive",
          title: "Lỗi dữ liệu",
          description: "Không thể lấy danh sách giáo viên. Vui lòng thử lại sau.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    getTeachers()
  }, [toast])

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      className: "",
      teacherWithSubject: "",
      room: "",
      dayOfWeek: [],
      timeSlot: "",
      startDate: "",
      endDate: "",
    },
  })

  async function onSubmit(values: ScheduleFormValues) {
    setIsSubmitting(true)

    try {
      // Lấy thông tin chi tiết về khung giờ đã chọn
      const selectedTimeSlot = TIME_SLOTS.find(slot => slot.id === values.timeSlot)
      

      // Lấy ID của giáo viên và môn học từ giá trị đã chọn (format: "teacherId-subject")
      const [teacherId, subject] = values.teacherWithSubject.split('-');
      
      // Tạo một mảng yêu cầu tạo lịch học cho mỗi ngày trong tuần được chọn
      const createRequests = values.dayOfWeek.map(day => {
        // Ánh xạ mã ngày (2, 3, 4, ..., cn) sang tên ngày tiếng Anh (mon, tue, wed, ...)
        const weekday = DAY_TO_WEEKDAY[day as keyof typeof DAY_TO_WEEKDAY];
        
        return {
          title: values.className,  // Tên lớp học
          teacherId: teacherId,     // ID của giáo viên
          subject: subject,        // Môn học 
          room: values.room,        // Phòng học
          weekday: weekday,         // Ngày trong tuần dạng chuỗi tiếng Anh
          startTime: selectedTimeSlot?.start,
          endTime: selectedTimeSlot?.end,
          startDate: values.startDate,
          endDate: values.endDate
        }
      })
      
      // Hiển thị debug data
      setDebugData({
        formValues: values,
        createRequests: createRequests,
        selectedTimeSlot
      })
      
      console.log("DEBUG - Form Values:", values);
      console.log("DEBUG - Create Requests to be sent:", createRequests);
      
      // Gửi các yêu cầu tạo lịch học lên server
      const createPromises = createRequests.map(request => createScheduleEvent({
        ...request,
        teacherId: parseInt(teacherId) // Convert teacherId from string to number
      }))
      await Promise.all(createPromises)

      toast({
        title: "Thêm lịch học thành công",
        description: `Đã thêm lịch học lớp ${values.className} vào hệ thống.`,
      })

      // Xóa debug data sau 10 giây
      setTimeout(() => {
        setDebugData({})
      }, 10000)
      
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Lỗi khi thêm lịch học:", error)
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
    <>
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
              {/* Nhập tên lớp học */}
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
                          <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn giáo viên và môn học"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
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

              {/* Chọn khung giờ học cố định */}
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khung giờ học</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khung giờ học" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem 
                            key={slot.id} 
                            value={slot.id}
                          >
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
      
      {/* Hiển thị debug data */}
      <DebugDataDisplay data={debugData} />
    </>
  )
}