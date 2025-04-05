import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, BookOpen, CreditCard, Video } from "lucide-react"

export default function TuitionPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Học phí Trung tâm Ánh Bình Minh</h1>

      <Tabs defaultValue="offline" className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 bg-red-100 p-1 rounded-lg shadow-md border border-red-300 gap-1">
          <TabsTrigger
            value="offline"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-200 hover:bg-red-300 py-2"
          >
            Offline
          </TabsTrigger>
          <TabsTrigger
            value="online"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-200 hover:bg-red-300 py-2"
          >
            Online
          </TabsTrigger>
          <TabsTrigger
            value="group"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-200 hover:bg-red-300 py-2"
          >
            Nhóm nhỏ
          </TabsTrigger>
          <TabsTrigger
            value="private"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-200 hover:bg-red-300 py-2"
          >
            1:1 Online
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offline" className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">1. Học offline tại Trung Tâm</CardTitle>
              <CardDescription>Học trực tiếp cùng giáo viên tại trung tâm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Lớp học offline tại lớp"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Học phí:</h3>
                      <p>700.000đ - 800.000đ /tháng, đã bao gồm tài liệu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Địa chỉ lớp:</h3>
                      <p>số 101 Làng Tăng Phú, P Tăng Nhơn Phú A, TP Thủ Đức, TP Hồ Chí Minh</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Thời gian học:</h3>
                      <p>Sắp xếp qua Zalo 0971 51 54 51 </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Nội dung học:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Các môn học từ lớp 6 - lớp 12</li>
                        <li>Luyện thi vào lớp 10</li>
                        <li>Luyện thi THPT Quốc Gia</li>
                        <li>Luyện thi học sinh giỏi cấp Thành phố</li>
                      </ul>
                    </div>
                  </div>
                  <Button className="w-full animate-pulse-glow-red bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/register">Đăng ký học</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="online" className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">2. Học online qua Google meet</CardTitle>
              <CardDescription>Học online cùng thầy cô qua Google meet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Học online"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Học phí:</h3>
                      <p>750.000 đ/khóa học</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">nền tảng học online:</h3>
                      <p>Google meet</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Thời gian học:</h3>
                      <p>Sắp xếp qua Zalo 0971 51 54 51</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Nội dung học:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Các môn học từ lớp 6 - lớp 12</li>
                        <li>Luyện thi vào lớp 10</li>
                        <li>Luyện thi THPT Quốc Gia</li>
                        <li>Luyện thi học sinh giỏi cấp Thành phố</li>
                      </ul>
                    </div>
                  </div>
                  <Button className="w-full animate-pulse-glow-red bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/register">Đăng ký học</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="group" className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">3. Học kèm 1:1 hoặc nhóm nhỏ tại lớp</CardTitle>
              <CardDescription>Học kèm trực tiếp tại lớp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Học kèm nhóm nhỏ tại Quận 5"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Học phí:</h3>
                      <ul className="list-disc list-inside pl-2 space-y-1">
                        <li>500.000 đ/giờ (kèm riêng 1:1)</li>
                        <li>800.000 đ/giờ (nhóm 2 học sinh)</li>
                        <li>900.000 đ/giờ (nhóm 3 học sinh)</li>
                        <li>1.000.000 đ/giờ (nhóm 4 học sinh)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Địa chỉ lớp:</h3>
                      <p>số 101 Làng Tăng Phú, P Tăng Nhơn Phú A, TP Thủ Đức, TP Hồ Chí Minh</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Thời gian học:</h3>
                      <p>Sắp xếp qua Zalo 0971 51 54 51</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Nội dung học:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Các môn học từ lớp 6 - lớp 12</li>
                        <li>Luyện thi vào lớp 10</li>
                        <li>Luyện thi THPT Quốc Gia</li>
                        <li>Luyện thi học sinh giỏi cấp Thành phố</li>
                      </ul>
                    </div>
                  </div>
                  <Button className="w-full animate-pulse-glow-red bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/register">Đăng ký học</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="private" className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">4. Học kèm 1:1 online</CardTitle>
              <CardDescription>Học kèm online cùng thầy cô qua Google Meet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Học kèm 1:1 online"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Học phí:</h3>
                      <p>500.000 đ/giờ (chỉ kèm riêng 1:1)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Phương thức học:</h3>
                      <p>Học qua ứng dụng Google Meet</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Thời gian học:</h3>
                      <p>Sắp xếp qua Zalo 0971 51 54 51</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Nội dung học:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Các môn học từ lớp 6 - lớp 12</li>
                        <li>Luyện thi vào lớp 10</li>
                        <li>Luyện thi THPT Quốc Gia</li>
                        <li>Luyện thi học sinh giỏi cấp Thành phố</li>
                      </ul>
                    </div>
                  </div>
                  <Button className="w-full animate-pulse-glow-red bg-red-600 hover:bg-red-700" asChild>
                    <Link href="/register">Đăng ký học</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>
        <p className="mb-4">Quý phụ huynh học sinh có thể đóng trực tiếp ở lớp hoặc chuyển khoản vào tài khoản sau:</p>

        <div className="flex flex-col md:flex-row gap-4"> {/* Thêm flex để xếp ngang trên màn hình lớn */}
          {/* Phần thông tin chuyển khoản */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex-1">
            <p className="font-medium">Techcombank (Ngân hàng TMCP Kỹ Thương Việt Nam):</p>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="font-medium">Chủ tài khoản:</span> Nguyễn Văn A
              </li>
              <li>
                <span className="font-medium">Số tài khoản:</span> 123456789
              </li>
              <li>
                <span className="font-medium">Chi nhánh:</span> TP Hồ Chí Minh
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              Nội dung chuyển khoản là: [Họ và tên học sinh] + [Học phí tháng].
            </p>
          </div>

          {/* Phần QR Code - Thêm vào đây */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center justify-center">
            <img 
              src="/placeholder.svg" 
              alt="QR Code thanh toán"
              className="w-40 h-40 object-contain" 
            />
            <p className="mt-2 text-sm font-medium text-center">
              Quét QR Code để thanh toán
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}

