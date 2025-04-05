"use client"

import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { createContext, useContext } from "react"

// Định nghĩa kiểu dữ liệu
export interface User {
  id: string
  username: string
  role: string
  name?: string
  [key: string]: any
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

// Tạo API client với interceptor
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Khởi tạo context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook để sử dụng auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Lấy access token từ localStorage
export const getStoredAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

// Lấy refresh token từ localStorage
export const getStoredRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken")
  }
  return null
}

// Lưu token vào localStorage
export const setStoredTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
  }
}

// Xóa token khỏi localStorage
export const removeStoredTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }
}

// Giải mã token để lấy thông tin user
export const decodeToken = (token: string): User | null => {
  try {
    return jwtDecode<User>(token)
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}

// Kiểm tra token có hết hạn chưa
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch {
    return true
  }
}

// Thiết lập interceptor cho API client
export const setupAuthInterceptors = (refreshTokenFn: () => Promise<string | null>, logoutFn: () => Promise<void>) => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = getStoredAccessToken()
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Nếu lỗi 401 và chưa thử refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Thử refresh token
          const newToken = await refreshTokenFn()

          if (newToken) {
            // Cập nhật token trong header và thử lại request
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`
            return apiClient(originalRequest)
          } else {
            // Nếu không refresh được, đăng xuất
            await logoutFn()
            return Promise.reject(error)
          }
        } catch (refreshError) {
          // Nếu refresh lỗi, đăng xuất
          await logoutFn()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )
}

