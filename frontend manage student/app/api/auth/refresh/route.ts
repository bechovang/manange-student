import { NextResponse } from "next/server"
import { sign, verify } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json({ message: "Không tìm thấy refresh token" }, { status: 401 })
    }

    // Xác thực refresh token
    const decoded = verify(refreshToken, process.env.JWT_SECRET || "your-secret-key") as any

    // Tạo access token mới
    const accessToken = sign(
      {
        id: decoded.id,
        username: decoded.username,
        name: decoded.name,
        role: decoded.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "15m" },
    )

    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error("Refresh token error:", error)
    return NextResponse.json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" }, { status: 401 })
  }
}

