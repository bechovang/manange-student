"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

// Định nghĩa các loại thông báo
type NotificationType = "success" | "error" | "info" | "warning"

// Định nghĩa cấu trúc của một thông báo
interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
}

// Context để quản lý thông báo
interface NotificationContextType {
  notifications: Notification[]
  showNotification: (type: NotificationType, title: string, message: string) => void
  hideNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Provider component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Hiển thị thông báo mới
  const showNotification = (type: NotificationType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { id, type, title, message }])

    // Tự động ẩn thông báo sau 5 giây
    setTimeout(() => {
      hideNotification(id)
    }, 5000)
  }

  // Ẩn thông báo
  const hideNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

// Hook để sử dụng thông báo
export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

// Component hiển thị thông báo
function NotificationContainer() {
  const { notifications, hideNotification } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-md">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} onClose={hideNotification} />
      ))}
    </div>
  )
}

// Component cho từng thông báo
function NotificationItem({
  notification,
  onClose,
}: {
  notification: Notification
  onClose: (id: string) => void
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hiệu ứng fade in
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(notification.id), 300) // Đợi hiệu ứng fade out hoàn thành
  }

  // Xác định icon và màu sắc dựa trên loại thông báo
  const getIconAndColor = () => {
    switch (notification.type) {
      case "success":
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          bgColor: "bg-green-50 border-green-500",
          textColor: "text-green-800",
          iconColor: "text-green-500",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-6 w-6" />,
          bgColor: "bg-red-50 border-red-500",
          textColor: "text-red-800",
          iconColor: "text-red-500",
        }
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6" />,
          bgColor: "bg-amber-50 border-amber-500",
          textColor: "text-amber-800",
          iconColor: "text-amber-500",
        }
      case "info":
      default:
        return {
          icon: <Info className="h-6 w-6" />,
          bgColor: "bg-blue-50 border-blue-500",
          textColor: "text-blue-800",
          iconColor: "text-blue-500",
        }
    }
  }

  const { icon, bgColor, textColor, iconColor } = getIconAndColor()

  return (
    <div
      className={cn(
        "transform transition-all duration-300 ease-in-out",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div className={cn("flex items-start p-4 rounded-lg shadow-lg border-l-4", bgColor, textColor)}>
        <div className={cn("flex-shrink-0", iconColor)}>{icon}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-base font-bold">{notification.title}</h3>
          <div className="mt-1 text-sm">{notification.message}</div>
        </div>
        <button
          onClick={handleClose}
          className={cn("ml-4 flex-shrink-0 rounded-md p-1 hover:bg-gray-200 focus:outline-none", textColor)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

