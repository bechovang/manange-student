// component tạo mã QR cho học sinh
"use client"

import { useState, useRef, useEffect } from "react" // Thêm useRef, useEffect
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { students } from "@/lib/mockData"
import { QRCodeCanvas } from 'qrcode.react'; // <<< Import QRCodeCanvas

export function QrCodeGenerator() {
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [qrData, setQrData] = useState<string | null>(null) // <<< Lưu trữ dữ liệu QR
  const { toast } = useToast()
  const qrRef = useRef<HTMLDivElement>(null); // <<< Ref để truy cập canvas QR khi tải xuống

  const student = students.find((s) => s.id === selectedStudent)

  // Hàm tạo dữ liệu cho mã QR
  const generateQrDataString = (): string | null => {
    if (!student) return null;
    // *** QUAN TRỌNG: Quyết định cấu trúc dữ liệu trong QR code ***
    // Ví dụ: JSON chứa ID, tên, lớp và timestamp
    const data = {
      id: student.id,
      name: student.name,
      class: student.subjects.join(", "), // Hoặc chỉ ID lớp nếu có
      timestamp: Date.now() // Thêm timestamp để có thể kiểm tra hiệu lực
    };
    return JSON.stringify(data);
  }

  const generateQR = () => {
    if (!selectedStudent || !student) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn học sinh hợp lệ trước khi tạo mã QR",
      })
      return
    }

    const dataString = generateQrDataString();
    if (dataString) {
      setQrData(dataString); // <<< Cập nhật state với dữ liệu QR thực tế
      toast({
        title: "Đã tạo mã QR",
        description: `Mã QR đã được tạo cho ${student.name}`,
      })
    }
  }

  const downloadQR = () => {
    if (!qrData || !qrRef.current || !student) {
       toast({ variant: "destructive", title: "Lỗi", description: "Không có mã QR để tải." });
       return;
    }
    const canvas = qrRef.current.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream"); // <<< Buộc tải xuống
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${student.id}_${student.name.replace(/\s+/g, '_')}_qr.png`; // <<< Tên file tải về
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
       toast({ title: "Đã tải xuống", description: "Mã QR đã được tải xuống." });
    } else {
       toast({ variant: "destructive", title: "Lỗi", description: "Không tìm thấy canvas mã QR." });
    }
  }

  const refreshQR = () => {
    generateQR(); // <<< Chỉ cần gọi lại hàm generateQR để tạo dữ liệu mới (với timestamp mới)
    toast({ title: "Đã làm mới mã QR", description: "Mã QR đã được cập nhật." });
  }

  // Xóa QR cũ khi chọn học sinh khác
  useEffect(() => {
    setQrData(null);
  }, [selectedStudent]);

  return (
    <div className="space-y-4">
      {/* Phần chọn học sinh giữ nguyên */}
      <div className="space-y-2">
        <Label htmlFor="student">Chọn học sinh</Label>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger id="student">
            <SelectValue placeholder="Chọn học sinh" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name} - {student.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!qrData ? ( // <<< Kiểm tra qrData thay vì qrGenerated
        <Button onClick={generateQR} className="w-full bg-red-700 hover:bg-red-800" disabled={!selectedStudent}>
          Tạo mã QR
        </Button>
      ) : (
        <div className="space-y-4">
          {/* Phần hiển thị QR Code thực tế */}
          <Card className="border-dashed">
            <CardContent className="p-4 flex flex-col items-center" ref={qrRef}>
              {/* <<< Component QRCodeCanvas */}
              <QRCodeCanvas
                value={qrData} // <<< Dữ liệu QR
                size={192} // Kích thước QR code (tương đương w-48 h-48)
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"} // Mức độ sửa lỗi (L, M, Q, H)
                includeMargin={false}
                // imageSettings={{ // Tùy chọn: thêm logo vào giữa
                //   src: "url-logo.png",
                //   x: undefined,
                //   y: undefined,
                //   height: 32,
                //   width: 32,
                //   excavate: true,
                // }}
              />
              {student && (
                <div className="mt-4 text-center">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.id}</p>
                  {/* Có thể thêm thời gian tạo QR nếu muốn */}
                  {/* <p className="text-xs text-muted-foreground">Tạo lúc: {new Date(JSON.parse(qrData).timestamp).toLocaleTimeString()}</p> */}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Các nút chức năng */}
          <div className="flex gap-2">
            <Button onClick={refreshQR} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
            <Button onClick={downloadQR} className="flex-1 bg-red-700 hover:bg-red-800">
              <Download className="mr-2 h-4 w-4" />
              Tải xuống
            </Button>
          </div>
        </div>
      )}

      {/* Phần thông tin học sinh giữ nguyên */}
      {selectedStudent && student && (
        <div className="rounded-lg border p-4 mt-4">
          <h3 className="font-medium mb-2">Thông tin học sinh</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Họ tên:</span> {student.name}</p>
            <p><span className="font-medium">Mã học sinh:</span> {student.id}</p>
            <p><span className="font-medium">Lớp:</span> {student.subjects.join(", ")}</p>
            <p><span className="font-medium">Trạng thái:</span> {student.status === "active" ? "Đang học" : "Nghỉ học"}</p>
          </div>
        </div>
      )}
    </div>
  )
}