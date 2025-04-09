"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  AuthContext,
  type AuthState,
  apiClient,
  decodeToken,
  isTokenExpired,
} from "@/lib/auth"
import { login as loginApi, logout as logoutApi, checkToken, checkAuth as checkAuthApi, initApiClient } from "@/lib/api"
import Cookies from "js-cookie"
import { toast } from "@/components/ui/use-toast"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    error: null,
  })
  
  useEffect(() => {
    console.log("AuthProvider state:", state)
  }, [state])

  // Khởi tạo API client
  useEffect(() => {
    initApiClient()
  }, [])

  // Hàm refresh token
  const refreshToken = async (): Promise<string | null> => {
    try {
      const storedRefreshToken = Cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
      console.log("Trying to refresh token, stored token exists:", !!storedRefreshToken)

      if (!storedRefreshToken) {
        return null
      }

      const response = await apiClient.post(`${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/refresh`, {
        refreshToken: storedRefreshToken,
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data

      if (accessToken) {
        // Lưu token mới
        Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken", accessToken)
        Cookies.set(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken", newRefreshToken || storedRefreshToken)

        const user = decodeToken(accessToken)
        setState((prev) => ({ ...prev, accessToken, refreshToken: newRefreshToken || storedRefreshToken, user }))
        return accessToken
      }

      return null
    } catch (error: any) {
      console.error("Failed to refresh token:", error)
      
      // Xử lý cụ thể cho lỗi 403 (Forbidden) hoặc 401 (Unauthorized)
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.log("Token refresh forbidden or unauthorized - logging out user")
        
        // Xóa token khỏi cookies
        Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
        Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
        
        // Cập nhật state
        setState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
        })
        
        // Thông báo cho người dùng
        toast({
          variant: "destructive",
          title: "Phiên đăng nhập hết hạn",
          description: "Vui lòng đăng nhập lại để tiếp tục."
        })
        
        // Chuyển hướng người dùng về trang đăng nhập
        router.push("/login")
      }
      
      return null
    }
  }

  // Hàm đăng nhập
  const login = async (username: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    console.log("Login attempt with username:", username)

    try {
      // Gọi API đăng nhập
      const response = await loginApi(username, password)
      console.log("Login successful, response:", response)
      
      const { accessToken, refreshToken } = response

      // Lấy thông tin user từ token
      const user = decodeToken(accessToken)
      console.log("Decoded user from token:", user)

      setState({
        user,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      })

      // Thông báo đăng nhập thành công
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng, ${user?.name || "Người dùng"}!`
      })

      // Chuyển hướng đến trang dashboard
      console.log("Navigating to dashboard")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login failed:", error)
      
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.error || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.",
      }))
      
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: error.response?.data?.error || "Vui lòng kiểm tra thông tin đăng nhập và thử lại."
      })
    }
  }

  // Hàm đăng xuất
  const logout = async (): Promise<void> => {
    try {
      // Gọi API đăng xuất
      await logoutApi()
    } catch (error) {
      console.error("Logout API failed:", error)
    } finally {
      // Xóa state ngay cả khi API thất bại
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      })

      // Thông báo đăng xuất thành công
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại!"
      })

      // Chuyển hướng đến trang đăng nhập
      router.push("/login")
    }
  }

  // Hàm kiểm tra xác thực
  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
      const storedRefreshToken = Cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
      
      console.log("Checking auth - Access token exists:", !!accessToken, "Refresh token exists:", !!storedRefreshToken)

      if (!accessToken) {
        if (!storedRefreshToken) {
          setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          })
          return false
        }

        // Nếu không có access token nhưng có refresh token, thử refresh
        const newAccessToken = await refreshToken()
        return !!newAccessToken
      }

      // Kiểm tra token hết hạn
      if (accessToken && isTokenExpired(accessToken)) {
        console.log("Access token expired, trying to refresh")
        // Thử refresh token
        const newAccessToken = await refreshToken()
        if (!newAccessToken) {
          setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          })
          return false
        }
        return true
      }

      // Token còn hạn, đọc thông tin người dùng từ token
      const user = decodeToken(accessToken)
      console.log("Token is valid, user:", user)
      
      if (!user) {
        console.warn("Could not decode user from token")
        setState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: "Token không hợp lệ",
        })
        return false
      }
      
      // Cập nhật state với thông tin người dùng từ token
      setState({
        user,
        accessToken,
        refreshToken: storedRefreshToken || null,
        isLoading: false,
        error: null,
      })
      return true
    } catch (error) {
      console.error("Auth check failed:", error)
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: "Không thể xác thực người dùng",
      })
      return false
    }
  }

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const initAuth = async () => {
      console.log("Initializing auth")
      
      // Lấy đường dẫn hiện tại
      const currentPath = window.location.pathname
      
      // Lấy query params
      const searchParams = new URLSearchParams(window.location.search)
      const sessionExpired = searchParams.get('sessionExpired')
      const accessDenied = searchParams.get('accessDenied')
      
      // Hiển thị thông báo nếu có query param
      if (sessionExpired) {
        toast({
          variant: "destructive",
          title: "Phiên đăng nhập hết hạn",
          description: "Vui lòng đăng nhập lại để tiếp tục."
        })
      } else if (accessDenied) {
        toast({
          variant: "destructive",
          title: "Truy cập bị từ chối",
          description: "Bạn không có quyền truy cập tài nguyên này."
        })
      }
      
      // Kiểm tra xác thực
      const isAuthenticated = await checkAuth()
      
      // Danh sách các đường dẫn không yêu cầu xác thực
      const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']
      
      if (!isAuthenticated && !publicPaths.includes(currentPath)) {
        console.log("User not authenticated and not on public path, redirecting to login")
        // Nếu không được xác thực và không ở trang công khai, chuyển hướng về trang đăng nhập
        router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
      } else if (isAuthenticated && publicPaths.includes(currentPath)) {
        console.log("User authenticated but on public path, redirecting to dashboard")
        // Nếu đã đăng nhập nhưng vẫn ở trang công khai, chuyển hướng về dashboard
        router.push('/dashboard')
      }
      
      // Cập nhật state loading
      setState(prev => ({
        ...prev,
        isLoading: false
      }))
    }

    initAuth()
  }, [])

  const contextValue = {
    ...state,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

