"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { fetchCashierShifts } from "@/lib/api"
import type { CashierShift } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export function ShiftList() {
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
      const response = await fetch(`/api/shifts/${shiftId}/reconcile`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reconcile shift")
      }

      // Revalidate the path to update the server cache
      revalidatePath("/shifts")

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
