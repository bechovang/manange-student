"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, AlertCircle } from "lucide-react"
import React from 'react'

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { toast } from "sonner"

// Types
export type ShiftStatus = "open" | "closed" | "reconciled"
export type PaymentMethod = "cash" | "transfer"
export type TransactionType = "payment" | "refund" | "expense" | "adjustment"

export interface CashierShift {
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

export interface Transaction {
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

export interface User {
  id: string
  username: string
  name: string
  role: string
  avatar: string
}

// Mock Data
const currentUser: User = {
  id: "USER001",
  username: "admin",
  name: "Quản trị viên",
  role: "admin",
  avatar: "/placeholder.svg?height=40&width=40",
}

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
  {
    id: "TRANS003",
    shiftId: "SHIFT001",
    createdAt: "2023-07-01T11:45:00.000Z",
    type: "expense",
    method: "cash",
    amount: -200000,
    createdBy: "USER001",
    invoiceId: null,
    description: "Chi phí văn phòng phẩm",
  },
  {
    id: "TRANS004",
    shiftId: "SHIFT001",
    createdAt: "2023-07-01T14:20:00.000Z",
    type: "payment",
    method: "cash",
    amount: 2000000,
    createdBy: "USER001",
    invoiceId: "INV003",
    description: "Thanh toán học phí tháng 7/2023 - Lê Văn C",
  },
  {
    id: "TRANS005",
    shiftId: "SHIFT001",
    createdAt: "2023-07-01T15:40:00.000Z",
    type: "refund",
    method: "cash",
    amount: -800000,
    createdBy: "USER001",
    invoiceId: "INV004",
    description: "Hoàn tiền học phí - Phạm Thị D",
  },
  {
    id: "TRANS006",
    shiftId: "SHIFT002",
    createdAt: "2023-07-02T09:10:00.000Z",
    type: "payment",
    method: "cash",
    amount: 1500000,
    createdBy: "USER002",
    invoiceId: "INV005",
    description: "Thanh toán học phí tháng 7/2023 - Hoàng Văn E",
  },
  {
    id: "TRANS007",
    shiftId: "SHIFT002",
    createdAt: "2023-07-02T10:25:00.000Z",
    type: "payment",
    method: "transfer",
    amount: 1800000,
    createdBy: "USER002",
    invoiceId: "INV006",
    description: "Thanh toán học phí tháng 7/2023 - Ngô Thị F",
  },
  {
    id: "TRANS008",
    shiftId: "SHIFT002",
    createdAt: "2023-07-02T13:15:00.000Z",
    type: "payment",
    method: "cash",
    amount: 1500000,
    createdBy: "USER002",
    invoiceId: "INV007",
    description: "Thanh toán học phí tháng 7/2023 - Đỗ Văn G",
  },
  {
    id: "TRANS009",
    shiftId: "SHIFT002",
    createdAt: "2023-07-02T14:30:00.000Z",
    type: "expense",
    method: "cash",
    amount: -300000,
    createdBy: "USER002",
    invoiceId: null,
    description: "Chi phí tiếp khách",
  },
  {
    id: "TRANS010",
    shiftId: "SHIFT003",
    createdAt: "2023-07-03T09:45:00.000Z",
    type: "payment",
    method: "cash",
    amount: 1500000,
    createdBy: "USER001",
    invoiceId: "INV008",
    description: "Thanh toán học phí tháng 7/2023 - Vũ Thị H",
  },
  {
    id: "TRANS011",
    shiftId: "SHIFT003",
    createdAt: "2023-07-03T11:20:00.000Z",
    type: "payment",
    method: "transfer",
    amount: 2000000,
    createdBy: "USER001",
    invoiceId: "INV009",
    description: "Thanh toán học phí tháng 7-8/2023 - Bùi Văn I",
  },
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
async function fetchCashierShifts(filters?: {
  userId?: string
  startDate?: string
  endDate?: string
  status?: string
}): Promise<CashierShift[]> {
  await delay(FAKE_DELAY)

  let filteredShifts = [...cashierShifts]

  if (filters) {
    if (filters.userId) {
      filteredShifts = filteredShifts.filter((shift) =>
        shift.userName.toLowerCase().includes(filters.userId!.toLowerCase()),
      )
    }

    if (filters.startDate) {
      filteredShifts = filteredShifts.filter((shift) => new Date(shift.shiftStartTime) >= new Date(filters.startDate!))
    }

    if (filters.endDate) {
      filteredShifts = filteredShifts.filter((shift) => new Date(shift.shiftStartTime) <= new Date(filters.endDate!))
    }

    if (filters.status && filters.status !== "all") {
      filteredShifts = filteredShifts.filter((shift) => shift.status === filters.status)
    }
  }

  return filteredShifts.sort((a, b) => new Date(b.shiftStartTime).getTime() - new Date(a.shiftStartTime).getTime())
}

async function fetchCashierShiftById(id: string): Promise<CashierShift | undefined> {
  await delay(FAKE_DELAY)
  return cashierShifts.find((shift) => shift.id === id)
}

async function fetchCurrentUserActiveShift(): Promise<CashierShift | undefined> {
  await delay(FAKE_DELAY)
  return cashierShifts.find((shift) => shift.userId === currentUser.id && shift.status === "open")
}

async function startNewShift(startingCash: number): Promise<CashierShift> {
  await delay(FAKE_DELAY)

  const newShift: CashierShift = {
    id: `SHIFT${String(cashierShifts.length + 1).padStart(3, "0")}`,
    userId: currentUser.id,
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    shiftStartTime: new Date().toISOString(),
    shiftEndTime: null,
    startingCash,
    endingCashCounted: null,
    calculatedEndingCash: null,
    cashDiscrepancy: null,
    status: "open",
    notes: null,
    closedBy: null,
  }

  cashierShifts.push(newShift)
  return newShift
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
    closedBy: currentUser.id,
  }

  cashierShifts[shiftIndex] = updatedShift
  return updatedShift
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

async function fetchShiftTransactions(shiftId: string): Promise<Transaction[]> {
  await delay(FAKE_DELAY)

  return transactions
    .filter((t) => t.shiftId === shiftId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function getCurrentUser(): Promise<User> {
  await delay(FAKE_DELAY)
  return { ...currentUser }
}

// Components
function ShiftList() {
  const [shifts, setShifts] = useState<CashierShift[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    userId: "",
    startDate: "",
    endDate: "",
    status: "",
  })

  useEffect(() => {
    const loadShifts = async () => {
      setLoading(true)
      try {
        const data = await fetchCashierShifts(filters)
        setShifts(data)
      } catch (error) {
        console.error("Error loading shifts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadShifts()
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
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

  const handleReconcile = async (shiftId: string) => {
    try {
      // Optimistically update the UI
      setShifts((prevShifts) =>
        prevShifts.map((shift) => (shift.id === shiftId ? { ...shift, status: "reconciled" } : shift)),
      )

      // Call the API to reconcile the shift
      await reconcileShift(shiftId)

      // Show a success toast
      toast.success("Ca làm việc đã được đối soát!")
    } catch (error: any) {
      // If there was an error, revert the UI
      setShifts((prevShifts) =>
        prevShifts.map((shift) => (shift.id === shiftId ? { ...shift, status: "closed" } : shift)),
      )
      // Show an error toast
      toast.error("Không thể đối soát ca làm việc. Vui lòng thử lại.")
      console.error("Error reconciling shift:", error)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="cashier">Thu ngân</Label>
              <Input
                id="cashier"
                placeholder="Tìm theo tên thu ngân"
                className="mt-1"
                onChange={(e) => handleFilterChange("userId", e.target.value)}
              />
            </div>
            <div>
              <Label>Từ ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mt-1 w-full justify-start text-left font-normal">
                    {filters.startDate ? format(new Date(filters.startDate), "dd/MM/yyyy") : <span>Chọn ngày</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate ? new Date(filters.startDate) : undefined}
                    onSelect={(date) => handleFilterChange("startDate", date ? date.toISOString() : "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Đến ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mt-1 w-full justify-start text-left font-normal">
                    {filters.endDate ? format(new Date(filters.endDate), "dd/MM/yyyy") : <span>Chọn ngày</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate ? new Date(filters.endDate) : undefined}
                    onSelect={(date) => handleFilterChange("endDate", date ? date.toISOString() : "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="open">Đang mở</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem>
                  <SelectItem value="reconciled">Đã đối soát</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Ca</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Bắt đầu</TableHead>
                <TableHead>Kết thúc</TableHead>
                <TableHead>Tiền đầu ca</TableHead>
                <TableHead>Tiền cuối ca (Đếm)</TableHead>
                <TableHead>Tiền cuối ca (Tính)</TableHead>
                <TableHead>Chênh lệch</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : shifts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    Không tìm thấy ca làm việc nào
                  </TableCell>
                </TableRow>
              ) : (
                shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{shift.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                        <div className="ml-2">
                          <div className="font-medium">{shift.userName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(shift.shiftStartTime), "dd/MM/yyyy HH:mm", { locale: vi })}</TableCell>
                    <TableCell>
                      {shift.shiftEndTime
                        ? format(new Date(shift.shiftEndTime), "dd/MM/yyyy HH:mm", { locale: vi })
                        : "Đang mở"}
                    </TableCell>
                    <TableCell>{formatCurrency(shift.startingCash)}</TableCell>
                    <TableCell>
                      {shift.endingCashCounted !== null ? formatCurrency(shift.endingCashCounted) : "-"}
                    </TableCell>
                    <TableCell>
                      {shift.calculatedEndingCash !== null ? formatCurrency(shift.calculatedEndingCash) : "-"}
                    </TableCell>
                    <TableCell>
                      {shift.cashDiscrepancy !== null ? (
                        <span className={shift.cashDiscrepancy !== 0 ? "font-bold text-red-600" : ""}>
                          {formatCurrency(shift.cashDiscrepancy)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(shift.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/shifts/${shift.id}`}>Chi tiết</Link>
                        </Button>
                        {shift.status === "closed" && (
                          <Button variant="outline" size="sm" onClick={() => handleReconcile(shift.id)}>
                            Đối soát
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function CurrentShift() {
  const [shift, setShift] = useState<CashierShift | null>(null)
  const [loading, setLoading] = useState(true)
  const [cashTotal, setCashTotal] = useState(0)
  const [nonCashTotal, setNonCashTotal] = useState(0)
  const [expectedCash, setExpectedCash] = useState(0)

  useEffect(() => {
    const loadShift = async () => {
      setLoading(true)
      try {
        const activeShift = await fetchCurrentUserActiveShift()
        if (activeShift) {
          setShift(activeShift)

          // Fetch transactions for this shift
          const transactions = await fetchShiftTransactions(activeShift.id)

          // Calculate totals
          let cashSum = 0
          let nonCashSum = 0

          transactions.forEach((transaction) => {
            if (transaction.method === "cash") {
              cashSum += transaction.amount
            } else {
              nonCashSum += transaction.amount
            }
          })

          setCashTotal(cashSum)
          setNonCashTotal(nonCashSum)
          setExpectedCash(activeShift.startingCash + cashSum)
        }
      } catch (error) {
        console.error("Error loading active shift:", error)
      } finally {
        setLoading(false)
      }
    }

    loadShift()
  }, [])

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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không có ca làm việc</AlertTitle>
        <AlertDescription>Bạn chưa bắt đầu ca làm việc nào. Vui lòng bắt đầu ca mới để tiếp tục.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin ca hiện tại</CardTitle>
        <CardDescription>Ca làm việc đang diễn ra của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nhân viên</h3>
            <p className="text-lg font-medium">{shift.userName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Thời gian bắt đầu</h3>
            <p className="text-lg font-medium">
              {format(new Date(shift.shiftStartTime), "dd/MM/yyyy HH:mm", { locale: vi })}
            </p>
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
            <h3 className="text-sm font-medium text-gray-500">Tổng tiền không tiền mặt</h3>
            <p className="text-lg font-medium">{formatCurrency(nonCashTotal)}</p>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-500">Tiền mặt dự kiến hiện có</h3>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(expectedCash)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/shifts/${shift.id}/transactions`}>Xem giao dịch trong ca</Link>
        </Button>
        <Button variant="default" asChild>
          <Link href={`/shifts/${shift.id}/end`}>Kết thúc ca</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function StartShiftForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const formSchema = z.object({
    startingCash: z
      .string()
      .min(1, "Vui lòng nhập số tiền")
      .regex(/^\d+$/, "Vui lòng chỉ nhập số"),
  })

  type StartShiftFormValues = z.infer<typeof formSchema>;

  const form = useForm<StartShiftFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startingCash: "",
    },
    mode: "onChange",
  })

  async function onSubmit(values: StartShiftFormValues) {
    const startingCashNumber = Number.parseInt(values.startingCash, 10);

    if (isNaN(startingCashNumber)) {
        toast.error("Lỗi", { description: "Số tiền nhập không hợp lệ." });
        form.setError("startingCash", { type: "manual", message: "Số không hợp lệ" });
        return;
    }

    setIsSubmitting(true)
    try {
      await startNewShift(startingCashNumber)
      toast.success("Bắt đầu ca thành công", {
        description: "Ca làm việc mới đã được bắt đầu.",
      })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Lỗi", {
        description: `Không thể bắt đầu ca làm việc: ${error instanceof Error ? error.message : String(error)}`,
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
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                {isSubmitting ? "Đang xử lý..." : "Xác nhận bắt đầu ca"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
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
export default function ShiftsPage() {
  const [activeShift, setActiveShift] = useState<CashierShift | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [shift, user] = await Promise.all([fetchCurrentUserActiveShift(), getCurrentUser()])
        setActiveShift(shift || null)
        setCurrentUser(user)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const isCashier = currentUser?.role === "cashier" || currentUser?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý ca làm việc</h1>
          <p className="text-muted-foreground">Quản lý ca làm việc và giao dịch của thu ngân</p>
        </div>
        {isCashier && !activeShift && <StartShiftForm />}
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Ca hiện tại</TabsTrigger>
          <TabsTrigger value="history">Lịch sử ca</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-700 border-t-transparent"></div>
                  <span className="ml-2">Đang tải...</span>
                </div>
              </CardContent>
            </Card>
          ) : isCashier ? (
            activeShift ? (
              <CurrentShift />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Không có ca làm việc</CardTitle>
                  <CardDescription>
                    Bạn chưa bắt đầu ca làm việc nào. Vui lòng bắt đầu ca mới để tiếp tục.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StartShiftForm />
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="p-6">
                <p>Chỉ thu ngân mới có thể bắt đầu ca làm việc.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="history">
          <ShiftList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
