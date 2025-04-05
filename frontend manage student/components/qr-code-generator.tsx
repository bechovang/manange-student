"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { students } from "@/lib/mockData"

export function QrCodeGenerator() {
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [qrGenerated, setQrGenerated] = useState(false)
  const { toast } = useToast()

  const generateQR = () => {
    if (!selectedStudent) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn học sinh trước khi tạo mã QR",
      })
      return
    }

    setQrGenerated(true)
    toast({
      title: "Đã tạo mã QR",
      description: "Mã QR đã được tạo thành công cho học sinh",
    })
  }

  const downloadQR = () => {
    toast({
      title: "Đã tải xuống",
      description: "Mã QR đã được tải xuống thành công",
    })
  }

  const refreshQR = () => {
    setQrGenerated(true)
    toast({
      title: "Đã làm mới mã QR",
      description: "Mã QR đã được làm mới thành công",
    })
  }

  const student = students.find((s) => s.id === selectedStudent)

  return (
    <div className="space-y-4">
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

      {!qrGenerated ? (
        <Button onClick={generateQR} className="w-full bg-red-700 hover:bg-red-800" disabled={!selectedStudent}>
          Tạo mã QR
        </Button>
      ) : (
        <div className="space-y-4">
          <Card className="border-dashed">
            <CardContent className="p-4 flex flex-col items-center">
              {/* Mã QR giả lập */}
              <div className="w-48 h-48 bg-white border flex items-center justify-center">
                <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="180" height="180" fill="white" />
                  <rect x="20" y="20" width="40" height="40" fill="black" />
                  <rect x="120" y="20" width="40" height="40" fill="black" />
                  <rect x="20" y="120" width="40" height="40" fill="black" />
                  <rect x="70" y="20" width="10" height="10" fill="black" />
                  <rect x="90" y="20" width="10" height="10" fill="black" />
                  <rect x="70" y="40" width="10" height="10" fill="black" />
                  <rect x="90" y="40" width="10" height="10" fill="black" />
                  <rect x="70" y="60" width="10" height="10" fill="black" />
                  <rect x="90" y="60" width="10" height="10" fill="black" />
                  <rect x="110" y="60" width="10" height="10" fill="black" />
                  <rect x="130" y="60" width="10" height="10" fill="black" />
                  <rect x="150" y="60" width="10" height="10" fill="black" />
                  <rect x="20" y="70" width="10" height="10" fill="black" />
                  <rect x="40" y="70" width="10" height="10" fill="black" />
                  <rect x="20" y="90" width="10" height="10" fill="black" />
                  <rect x="40" y="90" width="10" height="10" fill="black" />
                  <rect x="70" y="90" width="10" height="10" fill="black" />
                  <rect x="90" y="90" width="10" height="10" fill="black" />
                  <rect x="110" y="90" width="10" height="10" fill="black" />
                  <rect x="130" y="90" width="10" height="10" fill="black" />
                  <rect x="150" y="90" width="10" height="10" fill="black" />
                  <rect x="70" y="110" width="10" height="10" fill="black" />
                  <rect x="90" y="110" width="10" height="10" fill="black" />
                  <rect x="110" y="110" width="10" height="10" fill="black" />
                  <rect x="130" y="110" width="10" height="10" fill="black" />
                  <rect x="150" y="110" width="10" height="10" fill="black" />
                  <rect x="70" y="130" width="10" height="10" fill="black" />
                  <rect x="90" y="130" width="10" height="10" fill="black" />
                  <rect x="110" y="130" width="10" height="10" fill="black" />
                  <rect x="70" y="150" width="10" height="10" fill="black" />
                  <rect x="90" y="150" width="10" height="10" fill="black" />
                  <rect x="110" y="150" width="10" height="10" fill="black" />
                  <rect x="130" y="150" width="10" height="10" fill="black" />
                </svg>
              </div>

              {student && (
                <div className="mt-4 text-center">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.id}</p>
                </div>
              )}
            </CardContent>
          </Card>

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

      {selectedStudent && (
        <div className="rounded-lg border p-4 mt-4">
          <h3 className="font-medium mb-2">Thông tin học sinh</h3>
          {student && (
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Họ tên:</span> {student.name}
              </p>
              <p>
                <span className="font-medium">Mã học sinh:</span> {student.id}
              </p>
              <p>
                <span className="font-medium">Lớp:</span> {student.subjects.join(", ")}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span> {student.status === "active" ? "Đang học" : "Nghỉ học"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

