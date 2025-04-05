import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedPaymentTable } from "@/components/enhanced-payment-table"
import { Download, CreditCard, Users, Wallet, Calendar } from "lucide-react"
import { PaymentForm } from "@/components/payment-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShiftSummary } from "@/components/shift-summary"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ghi nhận thanh toán</h1>
        <p className="text-muted-foreground">Ghi nhận các khoản thanh toán học phí từ học sinh</p>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">
            <Wallet className="mr-2 h-4 w-4" />
            Tổng kết ca
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="mr-2 h-4 w-4" />
            Lịch sử giao dịch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <ShiftSummary />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng kết ca làm việc</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,500,000đ</div>
                <p className="text-xs text-muted-foreground">Tiền mặt: 8,500,000đ | CK: 7,000,000đ</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Số học sinh đã đóng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Trong tổng số 24 học sinh cần đóng</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giao dịch gần nhất</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10:15</div>
                <p className="text-xs text-muted-foreground">Nguyễn Văn A - 1,500,000đ</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            <PaymentForm />
          </div>

          <EnhancedPaymentTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

