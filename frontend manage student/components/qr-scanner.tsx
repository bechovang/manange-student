"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, Scan } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function QrScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const { toast } = useToast()

  const startScanner = () => {
    setIsScanning(true)
    // Trong ứng dụng thực tế, bạn sẽ khởi tạo máy quét QR ở đây

    // Mô phỏng quét thành công sau 3 giây
    setTimeout(() => {
      // Mô phỏng quét thành công
      toast({
        title: "Điểm danh thành công",
        description: "Nguyễn Văn A đã được điểm danh lúc 18:05",
      })
      setScanCount((prev) => prev + 1)
    }, 3000)
  }

  const resetScanner = () => {
    setIsScanning(false)
    setScanCount(0)
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
        {isScanning ? (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-red-500 animate-pulse"></div>
              <Scan className="absolute h-8 w-8 text-red-500 animate-ping" />
            </div>
            <div className="text-center absolute bottom-4 left-0 right-0">
              <p className="text-sm text-muted-foreground">Đang quét... ({scanCount} đã quét)</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Nhấn "Bắt đầu quét" để kích hoạt máy ảnh</p>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-2">
        {!isScanning ? (
          <Button onClick={startScanner} className="bg-red-700 hover:bg-red-800">
            <Camera className="mr-2 h-4 w-4" />
            Bắt đầu quét
          </Button>
        ) : (
          <Button onClick={resetScanner} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
        )}
      </div>
    </div>
  )
}

