"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, CreditCard, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const paymentFormSchema = z.object({
  studentId: z.string().min(1, { message: "Vui lòng chọn học sinh" }),
  amount: z.string().min(1, { message: "Vui lòng nhập số tiền" }),
  paymentMethod: z.enum(["cash", "transfer"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
  receiptImage: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => {
        return (
          !files ||
          files.length === 0 ||
          Array.from(files).every((file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type))
        )
      },
      {
        message: "Chỉ chấp nhận file ảnh (JPEG, PNG)",
      },
    ),
  notes: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

// Dữ liệu mẫu học sinh
const students = [
  {
    id: "STU001",
    name: "Nguyễn Văn A",
    class: "Toán 10A",
    avatar: "/placeholder.svg?height=40&width=40",
    debt: 1500000,
  },
  {
    id: "STU002",
    name: "Trần Thị B",
    class: "Anh Văn 11B",
    avatar: "/placeholder.svg?height=40&width=40",
    debt: 1800000,
  },
  {
    id: "STU003",
    name: "Lê Văn C",
    class: "Lý 12A",
    avatar: "/placeholder.svg?height=40&width=40",
    debt: 2000000,
  },
  {
    id: "STU004",
    name: "Phạm Thị D",
    class: "Hóa 11A",
    avatar: "/placeholder.svg?height=40&width=40",
    debt: 1800000,
  },
  {
    id: "STU005",
    name: "Hoàng Văn E",
    class: "Toán 9A",
    avatar: "/placeholder.svg?height=40&width=40",
    debt: 1500000,
  },
]

export function PaymentForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<(typeof students)[0] | null>(null)
  const [shiftSummary, setShiftSummary] = useState({
    cash: 0,
    transfer: 0,
    total: 0,
  })
  const { toast } = useToast()

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: "",
      amount: "",
      paymentMethod: "cash",
      notes: "",
    },
  })

  const watchPaymentMethod = form.watch("paymentMethod")

  // Lọc học sinh theo từ khóa tìm kiếm
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Cập nhật số tiền khi chọn học sinh
  const previousStudentRef = useRef<string | null>(null)

  useEffect(() => {
    if (selectedStudent && previousStudentRef.current !== selectedStudent.id) {
      previousStudentRef.current = selectedStudent.id

      const newAmount = selectedStudent.debt.toString()
      form.setValue("amount", newAmount)
    }
  }, [selectedStudent, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const selectStudent = (student: (typeof students)[0]) => {
    setSelectedStudent(student)
    form.setValue("studentId", student.id)
  }

  async function onSubmit(values: PaymentFormValues) {
    setIsSubmitting(true)

    try {
      // Mô phỏng gọi API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log(values)

      // Cập nhật tổng kết ca làm việc
      const amount = Number.parseInt(values.amount.replace(/[^0-9]/g, ""))
      setShiftSummary((prev) => {
        const newSummary = {
          cash: values.paymentMethod === "cash" ? prev.cash + amount : prev.cash,
          transfer: values.paymentMethod === "transfer" ? prev.transfer + amount : prev.transfer,
          total: prev.total + amount,
        }
        return newSummary
      })

      toast({
        title: "Ghi nhận thanh toán thành công",
        description: `Đã ghi nhận thanh toán học phí cho học sinh ${selectedStudent?.name}.`,
      })

      form.reset()
      setPreviewUrl(null)
      setSelectedStudent(null)
      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể ghi nhận thanh toán. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-800">
          <CreditCard className="mr-2 h-4 w-4" />
          Ghi nhận thanh toán
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ghi nhận thanh toán học phí</DialogTitle>
          <DialogDescription>Nhập thông tin thanh toán học phí vào biểu mẫu bên dưới.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Chọn học sinh</CardTitle>
                <CardDescription>Tìm kiếm và chọn học sinh cần thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm học sinh..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer border ${
                        selectedStudent?.id === student.id
                          ? "bg-red-50 border-red-200"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => selectStudent(student)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.class}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(student.debt)}
                      </Badge>
                    </div>
                  ))}
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">Không tìm thấy học sinh phù hợp</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tiền</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập số tiền (VD: 1,500,000)"
                          {...field}
                          onChange={(e) => {
                            // Chỉ cho phép nhập số và dấu phẩy
                            const value = e.target.value.replace(/[^0-9,]/g, "")
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Nhập số tiền không có đơn vị, chỉ dùng dấu phẩy để ngăn cách hàng nghìn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Phương thức thanh toán</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal">Tiền mặt</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="transfer" />
                            </FormControl>
                            <FormLabel className="font-normal">Chuyển khoản</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchPaymentMethod === "transfer" && (
                  <FormField
                    control={form.control}
                    name="receiptImage"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Ảnh chụp hóa đơn chuyển khoản</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={(e) => {
                                  onChange(e.target.files)
                                  handleFileChange(e)
                                }}
                                {...fieldProps}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => document.getElementById("receipt-upload")?.click()}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>

                            {previewUrl && (
                              <div className="mt-2 border rounded-md overflow-hidden">
                                <img
                                  src={previewUrl || "/placeholder.svg"}
                                  alt="Ảnh hóa đơn"
                                  className="max-h-[200px] object-contain mx-auto"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>Tải lên ảnh chụp màn hình hoặc ảnh chụp hóa đơn chuyển khoản</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập ghi chú về thanh toán (nếu có)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-800"
                  disabled={isSubmitting || !selectedStudent}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Ghi nhận thanh toán"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Tổng kết ca làm việc</CardTitle>
            <CardDescription>Tổng hợp số tiền đã thu trong ca làm việc hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Tiền mặt</p>
                <p className="text-xl font-bold text-green-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(shiftSummary.cash)}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Chuyển khoản</p>
                <p className="text-xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(shiftSummary.transfer)}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center bg-gray-50">
                <p className="text-sm text-muted-foreground">Tổng cộng</p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(shiftSummary.total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

