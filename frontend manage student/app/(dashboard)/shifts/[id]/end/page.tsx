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
import { toast } from "sonner"
import React from 'react'

// Types
type ShiftStatus = "open" | "closed" | "reconciled"
type PaymentMethod = "cash" | "transfer"
type TransactionType = "payment" | "refund" | "expense" | "adjustment"

interface CashierShift {
  id: string
  userId: string
  userName: string
  userAvatar: string
  shiftStartTime: string
  shiftEndTime: string | null
  startingCash: number
  endingCashCounted: number | null
  calculatedEndingCash: number | null
  cashDiscrepancy: number | null
  status: ShiftStatus
  notes: string | null
  closedBy: string | null
}

interface Transaction {
  id: string
  shiftId: string
  createdAt: string
  type: TransactionType
  method: PaymentMethod
  amount: number
  createdBy: string
  invoiceId: string | null
  description: string | null
}

// Mock Data
const cashierShifts: CashierShift[] = [
  {
    id: "SHIFT001",
    userId: "USER001",
    userName: "Quản trị viên",
    userAvatar: "/placeholder.svg?height=40&width=40",
    shiftStartTime: "2023-07-01T08:00:00.000Z",
    shiftEndTime: "2023-07-01T17:00:00.000Z",
    startingCash: 2000000,
    endingCashCounted: 3500000,
    calculatedEndingCash: 3500000,
    cashDiscrepancy: 0,
    status: "reconciled",
    notes: null,
    closedBy: "USER001",
  },
  {
    id: "SHIFT002",
    userId: "USER002",
    userName: "Thu ngân 1",
    userAvatar: "/placeholder.svg?height=40&width=40",
    shiftStartTime: "2023-07-02T08:00:00.000Z",
    shiftEndTime: "2023-07-02T17:00:00.000Z",
    startingCash: 2000000,
    endingCashCounted: 4200000,
    calculatedEndingCash: 4250000,
    cashDiscrepancy: -50000,
    status: "closed",
    notes: "Thiếu 50,000đ, có thể do nhầm lẫn khi thối tiền.",
    closedBy: "USER002",
  },
  {
    id: "SHIFT003",
    userId: "USER001",
    userName: "Quản trị viên",
    userAvatar: "/placeholder.svg?height=40&width=40",
    shiftStartTime: "2023-07-03T08:00:00.000Z",
    shiftEndTime: null,
    startingCash: 2000000,
    endingCashCounted: null,
    calculatedEndingCash: null,
    cashDiscrepancy: null,
    status: "open",
    notes: null,
    closedBy: null,
  },
]

const transactions: Transaction[] = [
  {
    id: "TRANS001",
    shiftId: "SHIFT001",
    createdAt: "2023-07-01T09:15:00.000Z",
    type: "payment",
    method: "cash",
    amount: 1500000,
    createdBy: "USER001",
    invoiceId: "INV001",
    description: "Thanh toán học phí tháng 7/2023 - Nguyễn Văn A",
  },
  {
    id: "TRANS002",
    shiftId: "SHIFT001",
    createdAt: "2023-07-01T10:30:00.000Z",
    type: "payment",
    method: "transfer",
    amount: 1800000,
    createdBy: "USER001",
    invoiceId: "INV002",
    description: "Thanh toán học phí tháng 7/2023 - Trần Thị B",
  },
  // ... other transactions
]

// Utility Functions
const FAKE_DELAY = 500
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Format currency in VND
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// API Functions
async function fetchCashierShiftById(id: string): Promise<CashierShift | undefined> {
  await delay(FAKE_DELAY)
  return cashierShifts.find((shift) => shift.id === id)
}

async function fetchShiftTransactions(shiftId: string): Promise<Transaction[]> {
  await delay(FAKE_DELAY)
  return transactions
    .filter((t) => t.shiftId === shiftId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function endShift(shiftId: string, endingCashCounted: number, notes?: string): Promise<CashierShift> {
  await delay(FAKE_DELAY)

  const shiftIndex = cashierShifts.findIndex((s) => s.id === shiftId)
  if (shiftIndex === -1) {
    throw new Error("Không tìm thấy ca làm việc")
  }

  const shift = cashierShifts[shiftIndex]

  // Tính toán tổng tiền mặt đã thu trong ca
  const shiftTransactions = transactions.filter(
    (t) =>
      t.shiftId === shiftId &&
      t.method === "cash" &&
      (t.type === "payment" || t.type === "refund" || t.type === "expense"),
  )

  const totalCashReceived = shiftTransactions.reduce((sum, t) => sum + t.amount, 0)
  const calculatedEndingCash = shift.startingCash + totalCashReceived
  const cashDiscrepancy = endingCashCounted - calculatedEndingCash

  const updatedShift: CashierShift = {
    ...shift,
    shiftEndTime: new Date().toISOString(),
    endingCashCounted,
    calculatedEndingCash,
    cashDiscrepancy,
    status: "closed",
    notes: notes || null,
    closedBy: "USER001", // Assuming current user
  }

  cashierShifts[shiftIndex] = updatedShift
  return updatedShift
}

// End Shift Form Component
function EndShiftForm({ shiftId }: { shiftId: string }) {
  const [shift, setShift] = useState<CashierShift | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cashTotal, setCashTotal] = useState(0)
  const [expectedCash, setExpectedCash] = useState(0)
  const [discrepancy, setDiscrepancy] = useState(0)
  const router = useRouter()

  // Reverted Zod Schema: Keep as string, validate format
  const formSchema = z.object({
    endingCashCounted: z
      .string()
      .min(1, "Vui lòng nhập số tiền")
      .regex(/^\d+$/, "Vui lòng chỉ nhập số"), // Ensure it contains only digits
    notes: z.string().optional(),
  })

  // Define the type based on the (string) schema inference
  type EndShiftFormValues = z.infer<typeof formSchema>;

  const form = useForm<EndShiftFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Default is now string
      endingCashCounted: "",
      notes: "",
    },
    mode: "onChange"
  })

  // Watch the string value
  const watchEndingCashString = form.watch("endingCashCounted")

  useEffect(() => {
    const loadShift = async () => {
      setLoading(true)
      try {
        const shiftData = await fetchCashierShiftById(shiftId)
        if (shiftData) {
          setShift(shiftData)
          const transactions = await fetchShiftTransactions(shiftData.id)
          const cashSum = transactions
            .filter((t) => t.method === "cash" && (t.type === "payment" || t.type === "expense" || t.type === "refund"))
            .reduce((sum, t) => sum + t.amount, 0)
          setCashTotal(cashSum)
          setExpectedCash(shiftData.startingCash + cashSum)
        } else {
            toast.error("Lỗi", { description: "Không tìm thấy ca làm việc." });
            router.push("/shifts");
        }
      } catch (error) {
        console.error("Error loading shift:", error)
        toast.error("Lỗi", {
          description: "Không thể tải thông tin ca làm việc.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadShift()
  }, [shiftId, router])

  useEffect(() => {
    // Parse the string value here for discrepancy calculation
    const endingCashNum = Number.parseInt(watchEndingCashString, 10);
    if (!isNaN(endingCashNum) && expectedCash !== null) {
      setDiscrepancy(endingCashNum - expectedCash)
    } else {
      setDiscrepancy(0) // Reset if input is invalid or not a number string
    }
  }, [watchEndingCashString, expectedCash])

  // onSubmit receives string, parse it here
  async function onSubmit(values: EndShiftFormValues) {
    const endingCashNumber = Number.parseInt(values.endingCashCounted, 10);

    // Double check parsing, although regex should have caught non-digits
    if (isNaN(endingCashNumber)) {
      toast.error("Lỗi", { description: "Số tiền nhập không hợp lệ." });
      form.setError("endingCashCounted", { type: "manual", message: "Số không hợp lệ" });
      return;
    }

    setIsSubmitting(true)
    try {
      // Pass the parsed number to the API function
      await endShift(shiftId, endingCashNumber, values.notes)
      toast.success("Kết thúc ca thành công", {
        description: "Ca làm việc đã được kết thúc thành công.",
      })
      router.push("/shifts")
    } catch (error) {
      toast.error("Lỗi", { description: `Không thể kết thúc ca: ${error instanceof Error ? error.message : String(error)}` })
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
             {/* ... (Display Shift Info - remains the same) ... */}
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
                    {/* Input type number is fine for UX, value is string */}
                    <Input placeholder="Nhập số tiền" type="number" {...field} />
                  </FormControl>
                  <FormDescription>Nhập số tiền mặt thực tế đếm được trong két khi kết thúc ca.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Check watchEndingCashString is a valid number string before showing discrepancy */}
            {/^[0-9]+$/.test(watchEndingCashString) && (
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

             {/* ... (Notes Field remains the same) ... */}
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
            <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
              {isSubmitting ? "Đang xử lý..." : "Xác nhận kết thúc ca"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

// Main Component
export default function EndShiftPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kết thúc ca làm việc</h1>
        <p className="text-muted-foreground">Nhập số tiền mặt thực tế để kết thúc ca làm việc</p>
      </div>

      <EndShiftForm shiftId={params.id} />
    </div>
  )
}
