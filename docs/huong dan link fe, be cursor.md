I'll help you by reading the documentation file and explaining how to link the backend authentication with the frontend.

Ran tool

Read file: c:\Users\Admin\Desktop\manage student\docs\huong dan link fe be.md

Read file: docs/huong dan link fe be.md

Read file: docs/huong dan link fe be.md

Ran tool

Ran tool

Ran tool

Read file: frontend manage student/lib/api.ts

Read file: frontend manage student/lib/auth.ts

Ran tool

Read file: frontend manage student/app/login/page.tsx

Read file: frontend manage student/components/login-form.tsx

Ran tool

Read file: frontend manage student/components/auth-provider.tsx

Read file: frontend manage student/middleware.ts

Ran tool

Ran tool

Ran tool

Ran tool

Ran tool

Ran tool

Ran tool

Read file: backend/src/main/java/com/example/eduweb/auth/controller/AuthController.java

Ran tool

Read file: backend/src/main/resources/application.properties
Based on my analysis of the files, I'll explain how to link the backend authentication with the frontend in this project.

Dựa vào tài liệu `huong dan link fe be.md` và cấu trúc dự án, đây là cách để kết nối authentication giữa backend và frontend:

## 1. Tác dụng của các file trong tài liệu hướng dẫn:

1. **application.properties (Backend)**:
   - Cấu hình CORS để cho phép frontend truy cập API
   - Cài đặt secret key và thời gian sống cho JWT token
   - Cấu hình cổng server

2. **.env.local (Frontend)**:
   - Lưu URL API của backend
   - Định nghĩa tên cookie cho JWT token và refresh token

3. **api.ts**:
   - Tạo axios client để gọi API
   - Cấu hình interceptors để tự động gắn token vào request
   - Xử lý refresh token khi token hết hạn

4. **AuthContext.tsx**:
   - Quản lý trạng thái đăng nhập/đăng xuất
   - Cung cấp các hàm xử lý authentication
   - Lưu trữ thông tin người dùng đã đăng nhập

5. **middleware.ts**:
   - Bảo vệ các route cần xác thực
   - Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập

6. **Login Component**:
   - Giao diện đăng nhập và xử lý form
   - Gọi API đăng nhập và lưu token

## 2. Cách liên kết Authentication giữa Backend và Frontend:

Dự án đã có sẵn các file cần thiết. Tuy nhiên, cần điều chỉnh một số chỗ để kết nối với backend thực tế:

1. Cập nhật file `.env.local` để sử dụng cookie thay vì localStorage:

```shell script:frontend manage student/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_JWT_COOKIE_NAME=accessToken
NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME=refreshToken
NEXT_PUBLIC_API_AUTH_ENDPOINT=/api/auth
```
2. Sửa lại file api.ts để sử dụng API thực tế thay vì mock data:

```typescript:frontend manage student/lib/api.ts
/**
 * Đây là file mẫu API client để tương tác với backend.
 * Trong môi trường thực tế, các hàm này sẽ gọi đến các API endpoint thực.
 * Hiện tại, chúng sử dụng dữ liệu mẫu để mô phỏng các cuộc gọi API.
 */

import type { Student, Class, Payment, TuitionRecord, Attendance, ScheduleEvent, Notification } from "./types"
import { students, classes, payments, tuitionRecords, attendanceData, scheduleEvents, notifications } from "./mockData"
import axios from "axios"
import Cookies from "js-cookie"

// Axios instance cho API calls
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookies
})

// Thêm interceptor để tự động gắn token vào request
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Thêm interceptor để tự động refresh token khi token hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Thử refresh token
        const refreshToken = Cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
        if (!refreshToken) throw new Error("No refresh token")

        const response = await apiClient.post(
          `${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/refresh`,
          { refreshToken }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Lưu token mới
        Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken", accessToken)
        Cookies.set(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken", newRefreshToken)

        // Cập nhật token trong header và thử lại request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (error) {
        // Nếu refresh token lỗi, đăng xuất
        Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
        Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")

        // Chuyển về trang login
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

// API Authentication
export const login = async (username: string, password: string) => {
  try {
    const response = await apiClient.post(`${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/login`, {
      username,
      password,
    })
    
    const { accessToken, refreshToken } = response.data
    
    // Lưu token vào cookies
    Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken", accessToken)
    Cookies.set(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken", refreshToken)
    
    return response.data
  } catch (error) {
    console.error("Login failed:", error)
    throw error
  }
}

export const logout = async () => {
  try {
    await apiClient.post(`${process.env.NEXT_PUBLIC_API_AUTH_ENDPOINT}/logout`)
  } catch (error) {
    console.error("Logout API failed:", error)
  } finally {
    // Xóa token
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
  }
}

// Thời gian trễ giả lập cho API
const FAKE_DELAY = 500

// Hàm trợ giúp để tạo độ trễ giả lập
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// API STUDENTS
// ... existing code ...
```


3. Cập nhật auth-provider.tsx để sử dụng API thực tế:

```typescript jsx:frontend manage student/components/auth-provider.tsx
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

    try {
      // Gọi API đăng nhập
      const response = await loginApi(username, password)
      const { accessToken, refreshToken } = response

      // Lấy thông tin user từ token
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

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const initAuth = async () => {
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
```
4. Cập nhật middleware.ts để sử dụng cookies:

```typescript:frontend manage student/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Danh sách các route không cần xác thực
const publicRoutes = ["/login", "/", "/forgot-password", "/api"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Kiểm tra xem route hiện tại có cần xác thực không
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Nếu là route công khai, cho phép truy cập
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Kiểm tra token trong cookies
  const accessToken = request.cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")?.value
  const refreshToken = request.cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")?.value

  // Nếu không có token, chuyển hướng đến trang đăng nhập
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Cho phép truy cập nếu có token
  return NextResponse.next()
}

// Chỉ áp dụng middleware cho các route cần thiết
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
```
5. Cập nhật login-form.tsx để sử dụng API thực tế:

```typescript jsx:frontend manage student/components/login-form.tsx
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Vui lòng nhập tên đăng nhập",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values.username, values.password)
      // Chuyển hướng sẽ được xử lý trong hàm login
    } catch (error) {
      // Lỗi đã được xử lý trong hàm login và cập nhật vào state
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên đăng nhập" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Button
            type="button"
            variant="link"
            className="p-0 text-red-700"
            onClick={() => router.push("/forgot-password")}
          >
            Quên mật khẩu?
          </Button>
        </div>

        <Button type="submit" className="w-full bg-red-700 hover:bg-red-800" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>
    </Form>
  )
}
```

```bash
cd frontend\ manage\ student && npm install js-cookie axios jwt-decode
```
Đây là hướng dẫn kết nối backend authentication với frontend manage student dựa trên tài liệu và cách triển khai:

## Tác dụng của các file trong tài liệu hướng dẫn:

1. **application.properties (Backend)**:
   - Cấu hình CORS để cho phép frontend truy cập API
   - Thiết lập JWT secret và thời gian sống cho token
   - Cấu hình server port

2. **.env.local (Frontend)**:
   - Lưu URL API của backend
   - Định nghĩa tên cookie cho JWT token và refresh token
   - Định nghĩa endpoint của API authentication

3. **api.ts**:
   - Khởi tạo axios client để gọi API
   - Thiết lập interceptors để tự động gắn token vào request
   - Xử lý refresh token khi token hết hạn
   - Cung cấp các hàm login/logout

4. **AuthContext/AuthProvider**:
   - Quản lý trạng thái xác thực
   - Lưu thông tin người dùng hiện tại
   - Cung cấp các hàm authentication cho các component

5. **middleware.ts**:
   - Bảo vệ các route cần xác thực
   - Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập

6. **Login Component**:
   - Hiển thị form đăng nhập
   - Gọi API đăng nhập và xử lý phản hồi

## Các thay đổi đã thực hiện:

1. Đã cập nhật `.env.local` để thêm endpoint API authentication
2. Đã cập nhật `api.ts` để thêm:
   - Axios client với interceptors
   - Xử lý refresh token tự động
   - Các hàm login và logout thực
3. Đã cập nhật `auth-provider.tsx` để:
   - Sử dụng cookies thay vì localStorage
   - Kết nối với API backend thực
4. Đã cập nhật `middleware.ts` để bảo vệ các route và sử dụng cookie environment variables
5. Đã cập nhật `login-form.tsx` để tương thích với backend authentication

## Cách sử dụng:

1. Đảm bảo backend đang chạy ở port 8080
2. Khi người dùng truy cập các route bảo vệ, middleware sẽ kiểm tra token
3. Nếu chưa đăng nhập, người dùng sẽ được chuyển hướng đến trang login
4. Sau khi đăng nhập thành công, token sẽ được lưu trong cookie
5. API client sẽ tự động gắn token vào các request
6. Nếu token hết hạn, refresh token sẽ được sử dụng để lấy token mới

Lưu ý: Đã cài đặt các thư viện cần thiết: js-cookie, axios và jwt-decode.
