"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, CreditCard, Wallet, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Dữ liệu mẫu - sẽ được thay thế bằng API call
const transactions = [
  {
    id: "INV001",
    student: "Nguyễn Văn A",
    class: "Toán 10A",
    amount: 1500000,
    time: "08:15",
    paymentMethod: "cash",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "INV002",
    student: "Trần Thị B",
    class: "Anh Văn 11B",
    amount: 1800000,
    time: "09:30",
    paymentMethod: "transfer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "INV003",
    student: "Lê Văn C",
    class: "Lý 12A",
    amount: 2000000,
    time: "10:45",
    paymentMethod: "cash",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "INV004",
    student: "Phạm Thị D",
    class: "Hóa 11A",
    amount: 1800000,
    time: "11:20",
    paymentMethod: "transfer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "INV005",
    student: "Hoàng Văn E",
    class: "Toán 9A",
    amount: 1500000,
    time: "13:10",
    paymentMethod: "cash",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function ShiftSummary() {
  const [activeTab, setActiveTab] = useState("today")
  const { toast } = useToast()

  // Tính tổng số tiền
  const totalCash = transactions.filter((t) => t.paymentMethod === "cash").reduce((sum, t) => sum + t.amount, 0)

  const totalTransfer = transactions.filter((t) => t.paymentMethod === "transfer").reduce((sum, t) => sum + t.amount, 0)

  const totalAmount = totalCash + totalTransfer

  // Số lượng học sinh đã đóng tiền
  const studentCount = transactions.length

  // Số lượng giao dịch theo phương thức
  const cashTransactions = transactions.filter((t) => t.paymentMethod === "cash").length
  const transferTransactions = transactions.filter((t) => t.paymentMethod === "transfer").length

  const handlePrintSummary = () => {
    toast({
      title: "Đang in tổng kết ca",
      description: "Đang in báo cáo tổng kết ca làm việc",
    })
  }

  const handleExportExcel = () => {
    toast({
      title: "Đang xuất Excel",
      description: "Đang xuất báo cáo tổng kết ca làm việc ra Excel",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thu</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng số tiền đã thu trong ca</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiền mặt</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalCash)}
            </div>
            <p className="text-xs text-muted-foreground">{cashTransactions} giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chuyển khoản</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalTransfer)}
            </div>
            <p className="text-xs text-muted-foreground">{transferTransactions} giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Học sinh đã đóng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount}</div>
            <p className="text-xs text-muted-foreground">Số học sinh đã đóng tiền</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Giao dịch trong ca</CardTitle>
              <CardDescription>Danh sách các giao dịch đã thực hiện</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="today">Hôm nay</TabsTrigger>
                <TabsTrigger value="yesterday">Hôm qua</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={transaction.avatar} alt={transaction.student} />
                    <AvatarFallback>
                      {transaction.student
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{transaction.student}</p>
                    <p className="text-sm text-muted-foreground">{transaction.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(transaction.amount)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{transaction.time}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      transaction.paymentMethod === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }
                  >
                    {transaction.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={handlePrintSummary}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button className="bg-red-700 hover:bg-red-800" onClick={handlePrintSummary}>
            <Printer className="mr-2 h-4 w-4" />
            In tổng kết ca
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

