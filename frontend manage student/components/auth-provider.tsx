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
import { login as loginApi, logout as logoutApi } from "@/lib/api"
import Cookies from "js-cookie"

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
    } catch (error) {
      console.error("Failed to refresh token:", error)
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

      // Chuyển hướng đến trang đăng nhập
      router.push("/login")
    }
  }

  // Hàm kiểm tra xác thực
  const checkAuth = async (): Promise<boolean> => {
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

    // Token còn hạn
    const user = decodeToken(accessToken)
    console.log("Valid token found, user:", user)
    setState({
      user,
      accessToken,
      refreshToken: storedRefreshToken || null,
      isLoading: false,
      error: null,
    })
    return true
  }

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const initAuth = async () => {
      console.log("Initializing auth")
      await checkAuth()
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

