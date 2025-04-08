"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { subjects } from "@/lib/mockData"
import { createStudent } from "@/lib/api"
import { StudentFormValues, studentFormSchema } from "./types"

export function AddStudentDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as any,
    defaultValues: {
      name: "",
      phoneStudent: "",
      phoneParent: "",
      facebookLink: "",
      school: "",
      subjects: [],
      grade: "",
      teacher: "",
      classTime: "",
      status: "active",
      note: "",
      dateOfBirth: "",
      gender: "male",
    },
  })

  const onSubmit: SubmitHandler<StudentFormValues> = async (values) => {
    try {
      setIsSubmitting(true)
      await createStudent(values)
      toast({
        title: "Thành công",
        description: "Đã thêm học sinh mới",
      })
      setOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm học sinh",
        variant: "destructive",
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
                name="phoneStudent"
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
                name="phoneParent"
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
                name="facebookLink"
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
              name="note"
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