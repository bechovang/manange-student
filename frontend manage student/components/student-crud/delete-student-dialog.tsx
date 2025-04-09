"use client"

import { useState } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { deleteStudent } from "@/lib/api"
import { Student } from "./types"

export function DeleteStudentDialog({ student, onSuccess }: { student: Student, onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map(n => n[0] || "")
      .join("")
  }

  async function handleDelete() {
    setIsDeleting(true)

    try {
      await deleteStudent(student.id.toString())

      toast({
        title: "Xóa học sinh thành công",
        description: `Đã xóa học sinh ${student.name || "Không có tên"} khỏi hệ thống.`,
      })

      setOpen(false)
      
      // Gọi callback để cập nhật danh sách
      if (onSuccess) {
        onSuccess()
      }
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
            {getInitials(student.name)}
          </div>
          <div>
            <h3 className="font-medium">{student.name || "Không có tên"}</h3>
            <p className="text-sm text-muted-foreground">{student.id || "Không có ID"}</p>
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