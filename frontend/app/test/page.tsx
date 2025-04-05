"use client"
import { Button } from "@/components/ui/button"
import { NotificationProvider, useNotification } from "@/components/custom-notification"

// Component con sử dụng useNotification
function TestButtons() {
  const { showNotification } = useNotification()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button
        onClick={() => showNotification("success", "Thành công!", "Thao tác đã được thực hiện thành công.")}
        className="bg-green-600 hover:bg-green-700 p-6 text-lg"
      >
        Thông báo thành công
      </Button>

      <Button
        onClick={() => showNotification("error", "Lỗi!", "Đã xảy ra lỗi khi thực hiện thao tác.")}
        className="bg-red-600 hover:bg-red-700 p-6 text-lg"
      >
        Thông báo lỗi
      </Button>

      <Button
        onClick={() => showNotification("warning", "Cảnh báo!", "Vui lòng kiểm tra lại thông tin.")}
        className="bg-amber-600 hover:bg-amber-700 p-6 text-lg"
      >
        Thông báo cảnh báo
      </Button>

      <Button
        onClick={() => showNotification("info", "Thông tin!", "Đây là một thông báo thông tin.")}
        className="bg-blue-600 hover:bg-blue-700 p-6 text-lg"
      >
        Thông báo thông tin
      </Button>
    </div>
  )
}

// Trang test với NotificationProvider bao bọc trực tiếp
export default function TestPage() {
  return (
    <NotificationProvider>
      <div className="container mx-auto py-20 flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold">Trang kiểm tra thông báo</h1>
        <TestButtons />
      </div>
    </NotificationProvider>
  )
}

