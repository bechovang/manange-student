import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Danh sách các route không cần xác thực
const publicRoutes = ["/login", "/", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Kiểm tra xem route hiện tại có cần xác thực không
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Nếu là route công khai, cho phép truy cập
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Kiểm tra token trong localStorage (thông qua cookie)
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

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

