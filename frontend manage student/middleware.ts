import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Danh sách các route không cần xác thực
const publicRoutes = ["/login", "/", "/forgot-password"]
const apiRoutes = ["/api"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // DEBUG: Bỏ hầu hết các log để không làm rối terminal
  
  // Kiểm tra xem route hiện tại có cần xác thực không
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))
  
  // Nếu là route công khai hoặc API, cho phép truy cập
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next()
  }
  
  // Kiểm tra token trong cookies
  const accessToken = request.cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")?.value
  const refreshToken = request.cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")?.value
  
  // Nếu không có token, chuyển hướng đến trang đăng nhập
  if (!accessToken && !refreshToken) {
    // Check for circular redirects
    const referer = request.headers.get("referer") || ""
    const redirectUrl = new URL("/login", request.url)
    
    // Nếu đã đang trong quá trình redirect từ /login, ngăn vòng lặp
    if (referer.includes("/login") && referer.includes(request.url)) {
      // Giải quyết vòng lặp bằng cách đánh dấu lỗi
      console.error("Redirect loop detected:", referer, "->", request.url)
      return NextResponse.next()
    }
    
    return NextResponse.redirect(redirectUrl)
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

