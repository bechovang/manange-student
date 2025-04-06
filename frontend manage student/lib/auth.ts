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

