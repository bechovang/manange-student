"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import React from 'react'

// Types
type PaymentMethod = "cash" | "transfer"
type TransactionType = "payment" | "refund" | "expense" | "adjustment"

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
async function fetchShiftTransactions(shiftId: string): Promise<Transaction[]> {
  await delay(FAKE_DELAY)
  return transactions
    .filter((t) => t.shiftId === shiftId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Component
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
export default function ShiftTransactionsPage({ params }: { params: { id: string } }) {
  // Using React.use() to unwrap params for future compatibility
  const unwrappedParams = React.use(params as any) as { id: string };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Giao dịch trong ca</h1>
        <p className="text-muted-foreground">Xem danh sách các giao dịch được thực hiện trong ca làm việc</p>
      </div>

      <ShiftTransactions shiftId={unwrappedParams.id} />
    </div>
  )
}
