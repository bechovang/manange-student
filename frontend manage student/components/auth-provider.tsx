"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  AuthContext,
  type AuthState,
  apiClient,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
  removeStoredTokens,
  decodeToken,
  isTokenExpired,
  setupAuthInterceptors,
} from "@/lib/auth"

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
      const storedRefreshToken = getStoredRefreshToken()

      if (!storedRefreshToken) {
        return null
      }

      const response = await apiClient.post("/auth/refresh", {
        refreshToken: storedRefreshToken,
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data

      if (accessToken) {
        // Lưu token mới
        setStoredTokens(accessToken, newRefreshToken || storedRefreshToken)

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

    try {
      // Gọi API đăng nhập
      const response = await apiClient.post("/auth/login", { username, password })
      const { accessToken, refreshToken } = response.data

      // Lưu token và cập nhật state
      setStoredTokens(accessToken, refreshToken)
      const user = decodeToken(accessToken)

      setState({
        user,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      })

      // Chuyển hướng đến trang dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login failed:", error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.",
      }))
    }
  }

  // Hàm đăng xuất
  const logout = async (): Promise<void> => {
    try {
      // Gọi API đăng xuất
      await apiClient.post("/auth/logout")
    } catch (error) {
      console.error("Logout API failed:", error)
    } finally {
      // Xóa token và state ngay cả khi API thất bại
      removeStoredTokens()
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
    const accessToken = getStoredAccessToken()
    const storedRefreshToken = getStoredRefreshToken()

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
    if (isTokenExpired(accessToken)) {
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
    setState({
      user,
      accessToken,
      refreshToken: storedRefreshToken,
      isLoading: false,
      error: null,
    })
    return true
  }

  // Thiết lập interceptors
  useEffect(() => {
    setupAuthInterceptors(refreshToken, logout)
  }, [])

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
    }

    initAuth()
  }, [])

  // Xử lý đăng xuất đồng bộ trên nhiều tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "logout") {
        logout()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const contextValue = {
    ...state,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

