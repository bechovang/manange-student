"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, isLoading, checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated && !isLoading) {
        router.push("/login")
      }
    }

    verifyAuth()
  }, [checkAuth, isLoading, router])

  // Kiểm tra quyền hạn nếu có yêu cầu
  const hasRequiredRole = () => {
    if (!requiredRoles || requiredRoles.length === 0) return true
    if (!user) return false

    return requiredRoles.includes(user.role)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-red-700" />
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Router will redirect
  }

  if (!hasRequiredRole()) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center max-w-md p-6">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Không có quyền truy cập</h1>
          <p className="text-muted-foreground">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cần trợ giúp.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4 bg-red-700 hover:bg-red-800">
            Quay lại Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Thêm Button component để tránh lỗi
import { Button } from "@/components/ui/button"

