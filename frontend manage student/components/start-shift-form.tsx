"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useToast } from "@/components/ui/use-toast"
import { startNewShift } from "@/lib/api"

const formSchema = z.object({
  startingCash: z
    .string()
    .min(1, "Vui lòng nhập số tiền")
    .transform((val) => Number.parseInt(val, 10)),
})

export function StartShiftForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startingCash: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await startNewShift(values.startingCash)
      toast({
        title: "Bắt đầu ca thành công",
        description: "Ca làm việc mới đã được bắt đầu.",
      })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể bắt đầu ca làm việc. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Bắt đầu ca mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bắt đầu ca làm việc mới</DialogTitle>
          <DialogDescription>Nhập số tiền mặt ban đầu trong két để bắt đầu ca làm việc mới.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startingCash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiền mặt đầu ca</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số tiền" type="number" {...field} />
                  </FormControl>
                  <FormDescription>Nhập số tiền mặt có sẵn trong két khi bắt đầu ca.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Xác nhận bắt đầu ca"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
