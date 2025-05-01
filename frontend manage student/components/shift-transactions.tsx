"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fetchShiftTransactions } from "@/lib/api"
import type { Transaction } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface ShiftTransactionsProps {
  shiftId: string
}

export function ShiftTransactions({ shiftId }: ShiftTransactionsProps) {
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
