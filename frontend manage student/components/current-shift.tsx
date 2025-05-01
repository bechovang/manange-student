"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchCurrentUserActiveShift, fetchShiftTransactions } from "@/lib/api"
import type { CashierShift } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export function CurrentShift() {
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
