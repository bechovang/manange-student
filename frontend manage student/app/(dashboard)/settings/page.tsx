import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, User, Building, Bell, CreditCard } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý cài đặt hệ thống và tài khoản</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            Chung
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="center">
            <Building className="mr-2 h-4 w-4" />
            Trung tâm
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="mr-2 h-4 w-4" />
            Thanh toán
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>Quản lý các cài đặt chung của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Chế độ tối</Label>
                    <p className="text-sm text-muted-foreground">Bật chế độ tối cho giao diện</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Thông báo trong ứng dụng</Label>
                    <p className="text-sm text-muted-foreground">Hiển thị thông báo trong ứng dụng</p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="language">Ngôn ngữ</Label>
                    <p className="text-sm text-muted-foreground">Chọn ngôn ngữ hiển thị</p>
                  </div>
                  <Select defaultValue="vi">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-red-700 hover:bg-red-800">Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" placeholder="Nhập họ và tên" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Nhập email" defaultValue="admin@anhbinhminh.edu.vn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="Nhập số điện thoại" defaultValue="0901234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                      <SelectItem value="teacher">Giáo viên</SelectItem>
                      <SelectItem value="staff">Nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Ảnh đại diện</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                  <Button variant="outline">Thay đổi ảnh</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-red-700 hover:bg-red-800">Lưu thay đổi</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>Cập nhật mật khẩu đăng nhập của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input id="current-password" type="password" placeholder="Nhập mật khẩu hiện tại" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input id="new-password" type="password" placeholder="Nhập mật khẩu mới" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input id="confirm-password" type="password" placeholder="Nhập lại mật khẩu mới" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-red-700 hover:bg-red-800">Đổi mật khẩu</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="center" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin trung tâm</CardTitle>
              <CardDescription>Cập nhật thông tin trung tâm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="center-name">Tên trung tâm</Label>
                  <Input id="center-name" placeholder="Nhập tên trung tâm" defaultValue="Trung tâm Ánh Bình Minh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="center-phone">Số điện thoại</Label>
                  <Input id="center-phone" placeholder="Nhập số điện thoại" defaultValue="0901234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="center-email">Email</Label>
                  <Input
                    id="center-email"
                    type="email"
                    placeholder="Nhập email"
                    defaultValue="info@anhbinhminh.edu.vn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="center-tax">Mã số thuế</Label>
                  <Input id="center-tax" placeholder="Nhập mã số thuế" defaultValue="0123456789" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="center-address">Địa chỉ</Label>
                <Textarea
                  id="center-address"
                  placeholder="Nhập địa chỉ trung tâm"
                  defaultValue="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="center-logo">Logo trung tâm</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-gray-200"></div>
                  <Button variant="outline">Thay đổi logo</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-red-700 hover:bg-red-800">Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Thông báo qua Email</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Học sinh mới</Label>
                        <p className="text-sm text-muted-foreground">Nhận thông báo khi có học sinh mới đăng ký</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thanh toán học phí</Label>
                        <p className="text-sm text-muted-foreground">Nhận thông báo khi có thanh toán học phí mới</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Báo cáo hàng tuần</Label>
                        <p className="text-sm text-muted-foreground">Nhận báo cáo tổng hợp hàng tuần</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">Thông báo qua Zalo</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mẫu thông báo</Label>
                        <p className="text-sm text-muted-foreground">Cấu hình mẫu thông báo Zalo</p>
                      </div>
                      <Button variant="outline">Cấu hình</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Tự động gửi nhắc học phí</Label>
                        <p className="text-sm text-muted-foreground">Tự động gửi thông báo nhắc đóng học phí</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-red-700 hover:bg-red-800">Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thanh toán</CardTitle>
              <CardDescription>Quản lý thông tin thanh toán và học phí</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Thông tin tài khoản ngân hàng</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Tên ngân hàng</Label>
                      <Input id="bank-name" placeholder="Nhập tên ngân hàng" defaultValue="Vietcombank" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Số tài khoản</Label>
                      <Input id="account-number" placeholder="Nhập số tài khoản" defaultValue="1234567890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Tên chủ tài khoản</Label>
                      <Input
                        id="account-name"
                        placeholder="Nhập tên chủ tài khoản"
                        defaultValue="TRUNG TAM ANH BINH MINH"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank-branch">Chi nhánh</Label>
                      <Input id="bank-branch" placeholder="Nhập chi nhánh ngân hàng" defaultValue="TP. Hồ Chí Minh" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-lg font-medium">Cài đặt học phí</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Tự động tính phí trễ hạn</Label>
                        <p className="text-sm text-muted-foreground">
                          Tự động tính phí khi học sinh đóng học phí trễ hạn
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cho phép đóng học phí trước</Label>
                        <p className="text-sm text-muted-foreground">
                          Cho phép học sinh đóng học phí trước nhiều tháng
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-red-700 hover:bg-red-800">Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

