"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import React from 'react'

// Types and API functions from the main file
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

async function reconcileShift(shiftId: string): Promise<CashierShift> {
  await delay(FAKE_DELAY)

  const shiftIndex = cashierShifts.findIndex((s) => s.id === shiftId)
  if (shiftIndex === -1) {
    throw new Error("Không tìm thấy ca làm việc")
  }

  const updatedShift: CashierShift = {
    ...cashierShifts[shiftIndex],
    status: "reconciled",
  }

  cashierShifts[shiftIndex] = updatedShift
  return updatedShift
}

// Components
function ShiftDetail({ shiftId }: { shiftId: string }) {
  const [shift, setShift] = useState<CashierShift | null>(null)
  const [loading, setLoading] = useState(true)
  const [isReconciling, setIsReconciling] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadShift = async () => {
      setLoading(true)
      try {
        const shiftData = await fetchCashierShiftById(shiftId)
        if (shiftData) {
          setShift(shiftData)
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
  }, [shiftId])

  const handleReconcile = async () => {
    if (!shift) return

    setIsReconciling(true)
    try {
      const updatedShift = await reconcileShift(shiftId)
      setShift(updatedShift)
      toast.success("Đối soát thành công", {
        description: "Ca làm việc đã được đánh dấu là đã đối soát.",
      })
    } catch (error) {
      toast.error("Lỗi", {
        description: "Không thể đối soát ca làm việc. Vui lòng thử lại sau.",
      })
    } finally {
      setIsReconciling(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-500">Đang mở</Badge>
      case "closed":
        return <Badge className="bg-yellow-500">Đã đóng</Badge>
      case "reconciled":
        return <Badge className="bg-blue-500">Đã đối soát</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết ca làm việc #{shift.id}</CardTitle>
          <CardDescription>Thông tin chi tiết về ca làm việc</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nhân viên</h3>
              <div className="mt-1 flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                <p className="ml-2 text-lg font-medium">{shift.userName}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
              <div className="mt-1">{getStatusBadge(shift.status)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Thời gian bắt đầu</h3>
              <p className="text-lg font-medium">
                {format(new Date(shift.shiftStartTime), "dd/MM/yyyy HH:mm", { locale: vi })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Thời gian kết thúc</h3>
              <p className="text-lg font-medium">
                {shift.shiftEndTime
                  ? format(new Date(shift.shiftEndTime), "dd/MM/yyyy HH:mm", { locale: vi })
                  : "Đang mở"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tiền mặt đầu ca</h3>
              <p className="text-lg font-medium">{formatCurrency(shift.startingCash)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tiền mặt cuối ca (Đếm)</h3>
              <p className="text-lg font-medium">
                {shift.endingCashCounted !== null ? formatCurrency(shift.endingCashCounted) : "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tiền mặt cuối ca (Tính)</h3>
              <p className="text-lg font-medium">
                {shift.calculatedEndingCash !== null ? formatCurrency(shift.calculatedEndingCash) : "-"}
              </p>
            </div>
          </div>

          {shift.cashDiscrepancy !== null && (
            <div className={`rounded-lg p-4 ${shift.cashDiscrepancy !== 0 ? "bg-red-50" : "bg-green-50"}`}>
              <h3 className="text-sm font-medium text-gray-500">Chênh lệch</h3>
              <p className={`text-xl font-bold ${shift.cashDiscrepancy !== 0 ? "text-red-600" : "text-green-600"}`}>
                {formatCurrency(shift.cashDiscrepancy)}
              </p>
            </div>
          )}

          {shift.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ghi chú</h3>
              <p className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3">{shift.notes}</p>
            </div>
          )}

          {shift.closedBy && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Người đóng ca</h3>
              <p className="text-lg font-medium">{shift.closedBy === shift.userId ? "Tự đóng" : shift.closedBy}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/shifts")}>
            Quay lại
          </Button>
          {shift.status === "closed" && (
            <Button onClick={handleReconcile} disabled={isReconciling}>
              {isReconciling ? "Đang xử lý..." : "Đánh dấu đã đối soát"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <ShiftTransactions shiftId={shiftId} />
    </div>
  )
}

function ShiftTransactions({ shiftId }: { shiftId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true)
      try {
        const data = await fetchShiftTransactions(shiftId)
        setTransactions(data)
      } catch (error) {
        console.error("Error loading transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [shiftId])

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case "payment":
        return <Badge className="bg-green-500">Thanh toán</Badge>
      case "refund":
        return <Badge className="bg-orange-500">Hoàn tiền</Badge>
      case "expense":
        return <Badge className="bg-red-500">Chi phí</Badge>
      case "adjustment":
        return <Badge className="bg-blue-500">Điều chỉnh</Badge>
      default:
        return <Badge className="bg-gray-500">{type}</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700">
            Tiền mặt
          </Badge>
        )
      case "transfer":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Chuyển khoản
          </Badge>
        )
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giao dịch trong ca</CardTitle>
        <CardDescription>Danh sách các giao dịch được thực hiện trong ca làm việc này</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Phương thức</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Mã hóa đơn</TableHead>
              <TableHead>Mô tả</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không có giao dịch nào trong ca này
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}</TableCell>
                  <TableCell>{getTransactionTypeBadge(transaction.type)}</TableCell>
                  <TableCell>{getPaymentMethodBadge(transaction.method)}</TableCell>
                  <TableCell className={transaction.amount < 0 ? "text-red-600" : ""}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>{transaction.invoiceId || "-"}</TableCell>
                  <TableCell>{transaction.description || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Main Component
export default function ShiftDetailPage({ params }: { params: { id: string } }) {
  // Using React.use() to unwrap params for future compatibility
  const unwrappedParams = React.use(params as any) as { id: string };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chi tiết ca làm việc</h1>
        <p className="text-muted-foreground">Xem thông tin chi tiết về ca làm việc</p>
      </div>

      <ShiftDetail shiftId={unwrappedParams.id} />
    </div>
  )
}
