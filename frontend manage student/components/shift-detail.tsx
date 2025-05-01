"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { fetchCashierShiftById, reconcileShift } from "@/lib/api"
import type { CashierShift } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { ShiftTransactions } from "./shift-transactions"

interface ShiftDetailProps {
  shiftId: string
}

export function ShiftDetail({ shiftId }: ShiftDetailProps) {
  const [shift, setShift] = useState<CashierShift | null>(null)
  const [loading, setLoading] = useState(true)
  const [isReconciling, setIsReconciling] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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

  const handleReconcile = async () => {
    if (!shift) return

    setIsReconciling(true)
    try {
      const updatedShift = await reconcileShift(shiftId)
      setShift(updatedShift)
      toast({
        title: "Đối soát thành công",
        description: "Ca làm việc đã được đánh dấu là đã đối soát.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
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
