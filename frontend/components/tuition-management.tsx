"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Download } from "lucide-react"
import { fetchTuition } from "@/lib/api"
import { getTuitionStatusClass } from "@/lib/utils"
import type { TuitionRecord } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface TuitionManagementProps {
  filterStatus?: string
}

export function TuitionManagement({ filterStatus }: TuitionManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [tuitionData, setTuitionData] = useState<TuitionRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch data khi component mount hoặc filterStatus thay đổi
  useState(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchTuition(filterStatus)
        setTuitionData(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi dữ liệu",
          description: "Không thể tải dữ liệu học phí. Vui lòng thử lại sau.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  })

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredData = tuitionData.filter((record) => record.student.toLowerCase().includes(searchTerm.toLowerCase()))

  const sendNotification = (record: TuitionRecord) => {
    toast({
      title: "Gửi thông báo",
      description: `Đã gửi thông báo nhắc học phí đến phụ huynh của ${record.student}`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học sinh..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã học sinh</TableHead>
              <TableHead>Học sinh</TableHead>
              <TableHead>Lớp</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Hạn đóng</TableHead>
              <TableHead>Lần đóng gần nhất</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.student}</TableCell>
                  <TableCell>{record.class}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(record.amount)}
                  </TableCell>
                  <TableCell>{record.dueDate}</TableCell>
                  <TableCell>{record.lastPayment}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTuitionStatusClass(record.status)}>
                      {record.status === "paid"
                        ? "Đã đóng"
                        : record.status === "unpaid-1"
                          ? "Chưa đóng 1 tháng"
                          : `Chưa đóng ${record.months} tháng`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => sendNotification(record)}>
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">Gửi thông báo</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="text-red-700 border-red-200">
          Gửi thông báo cho tất cả học sinh nợ học phí
        </Button>
      </div>
    </div>
  )
}

