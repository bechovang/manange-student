// page test điểm danh bằng mã QR
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCodeGenerator } from "@/components/qr-code-generator"
import { QrScanner } from "@/components/qr-scanner"
import { AttendanceResults } from "@/components/attendance-results"

export default function TestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Test Điểm Danh QR</h1>
        <p className="text-muted-foreground">Trang này dùng để kiểm tra chức năng điểm danh bằng mã QR</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Tạo mã QR</TabsTrigger>
          <TabsTrigger value="scan">Quét mã QR</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tạo mã QR cho học sinh</CardTitle>
                <CardDescription>Chọn học sinh và tạo mã QR điểm danh</CardDescription>
              </CardHeader>
              <CardContent>
                <QrCodeGenerator />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hướng dẫn sử dụng</CardTitle>
                <CardDescription>Cách sử dụng mã QR để điểm danh</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Quy trình điểm danh bằng QR</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Tạo mã QR cho học sinh</li>
                    <li>Học sinh sử dụng mã QR cá nhân khi đến lớp</li>
                    <li>Giáo viên/nhân viên quét mã QR bằng tab "Quét mã QR"</li>
                    <li>Hệ thống tự động ghi nhận điểm danh</li>
                  </ol>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Thông tin mã QR</h3>
                  <p className="text-sm text-muted-foreground">
                    Mã QR chứa thông tin: ID học sinh, tên học sinh, lớp và timestamp. Mỗi mã QR có hiệu lực trong 24
                    giờ.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quét mã QR</CardTitle>
                <CardDescription>Quét mã QR của học sinh để điểm danh</CardDescription>
              </CardHeader>
              <CardContent>
                <QrScanner />
              </CardContent>
            </Card>

            <AttendanceResults />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

