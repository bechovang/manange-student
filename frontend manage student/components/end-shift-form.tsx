"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { fetchCashierShiftById, fetchShiftTransactions, endShift } from "@/lib/api"
import type { CashierShift } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface EndShiftFormProps {
  shiftId: string
}

const formSchema = z.object({
  endingCashCounted: z
    .string()
    .min(1, "Vui lòng nhập số tiền")
    .transform((val) => Number.parseInt(val, 10)),
  notes: z.string().optional(),
})

export function EndShiftForm({ shiftId }: EndShiftFormProps) {
  const [shift, setShift] = useState<CashierShift | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cashTotal, setCashTotal] = useState(0)
  const [expectedCash, setExpectedCash] = useState(0)
  const [discrepancy, setDiscrepancy] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endingCashCounted: "",
      notes: "",
    },
  })

  const watchEndingCash = form.watch("endingCashCounted")

  useEffect(() => {
    const loadShift = async () => {
      setLoading(true)
      try {
        const shiftData = await fetchCashierShiftById(shiftId)
        if (shiftData) {
          setShift(shiftData)

          // Fetch transactions for this shift
          const transactions = await fetchShiftTransactions(shiftData.id)

          // Calculate cash total
          const cashSum = transactions.filter((t) => t.method === "cash").reduce((sum, t) => sum + t.amount, 0)

          setCashTotal(cashSum)
          setExpectedCash(shiftData.startingCash + cashSum)
        }
      } catch (error) {
        console.error("Error loading shift:", error)
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin ca làm việc.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadShift()
  }, [shiftId, toast])

  useEffect(() => {
    if (watchEndingCash && expectedCash) {
      const endingCash = Number.parseInt(watchEndingCash, 10) || 0
      setDiscrepancy(endingCash - expectedCash)
    } else {
      setDiscrepancy(0)
    }
  }, [watchEndingCash, expectedCash])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await endShift(shiftId, values.endingCashCounted, values.notes)
      toast({
        title: "Kết thúc ca thành công",
        description: "Ca làm việc đã được kết thúc thành công.",
      })
      router.push("/shifts")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể kết thúc ca làm việc. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-700 border-t-transparent"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!shift) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>Không tìm thấy thông tin ca làm việc.</p>
            <Button className="mt-4" onClick={() => router.push("/shifts")}>
              Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết thúc ca làm việc</CardTitle>
        <CardDescription>Nhập số tiền mặt thực tế đếm được để kết thúc ca làm việc.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nhân viên</h3>
                <p className="text-lg font-medium">{shift.userName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Thời gian bắt đầu</h3>
                <p className="text-lg font-medium">{new Date(shift.shiftStartTime).toLocaleString("vi-VN")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tiền mặt đầu ca</h3>
                <p className="text-lg font-medium">{formatCurrency(shift.startingCash)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tổng tiền mặt đã thu</h3>
                <p className="text-lg font-medium">{formatCurrency(cashTotal)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tiền mặt lý thuyết cuối ca</h3>
                <p className="text-lg font-medium">{formatCurrency(expectedCash)}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="endingCashCounted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiền mặt thực tế đếm được</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số tiền" type="number" {...field} />
                  </FormControl>
                  <FormDescription>Nhập số tiền mặt thực tế đếm được trong két khi kết thúc ca.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchEndingCash && (
              <div className={`rounded-lg p-4 ${discrepancy !== 0 ? "bg-red-50" : "bg-green-50"}`}>
                <h3 className="text-sm font-medium text-gray-500">Chênh lệch</h3>
                <p className={`text-xl font-bold ${discrepancy !== 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(discrepancy)}
                </p>
                {discrepancy !== 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    {discrepancy > 0
                      ? "Tiền mặt thực tế nhiều hơn dự kiến. Vui lòng kiểm tra lại."
                      : "Tiền mặt thực tế ít hơn dự kiến. Vui lòng kiểm tra lại."}
                  </p>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập ghi chú (nếu có)" {...field} />
                  </FormControl>
                  <FormDescription>Ghi chú về chênh lệch tiền mặt hoặc các vấn đề khác.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/shifts")}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Xác nhận kết thúc ca"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
