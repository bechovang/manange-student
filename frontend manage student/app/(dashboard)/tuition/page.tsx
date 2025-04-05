import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TuitionTable } from "@/components/tuition-table"
import { Download, FileText } from "lucide-react"

export default function TuitionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý học phí</h1>
        <p className="text-muted-foreground">Theo dõi tình trạng học phí và thông báo nhắc nhở</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng học phí tháng</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128,500,000đ</div>
            <p className="text-xs text-muted-foreground">Đã thu: 98,500,000đ (76%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Học sinh chưa đóng</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Tổng nợ: 30,000,000đ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Học sinh nợ 2+ tháng</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Tổng nợ: 18,500,000đ</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="h-auto">
            <TabsTrigger
              value="all"
              className="px-3 py-1.5 whitespace-normal data-[state=active]:bg-gray-200 data-[state=active]:text-gray-800"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="unpaid-1"
              className="px-3 py-1.5 whitespace-normal data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800"
            >
              Chưa đóng
              <br />1 tháng
            </TabsTrigger>
            <TabsTrigger
              value="unpaid-2"
              className="px-3 py-1.5 whitespace-normal data-[state=active]:bg-red-100 data-[state=active]:text-red-800"
            >
              Chưa đóng
              <br />
              2+ tháng
            </TabsTrigger>
            <TabsTrigger
              value="paid"
              className="px-3 py-1.5 whitespace-normal data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
            >
              Đã đóng
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </div>
        <TabsContent value="all" className="space-y-4">
          <TuitionTable />
        </TabsContent>
        <TabsContent value="unpaid-1" className="space-y-4">
          <TuitionTable filterStatus="unpaid-1" />
        </TabsContent>
        <TabsContent value="unpaid-2" className="space-y-4">
          <TuitionTable filterStatus="unpaid-2" />
        </TabsContent>
        <TabsContent value="paid" className="space-y-4">
          <TuitionTable filterStatus="paid" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

