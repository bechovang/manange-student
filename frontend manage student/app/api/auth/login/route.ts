import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// Mô phỏng database users
const users = [
  {
    id: "1",
    username: "admin",
    password: "password123",
    name: "Admin",
    role: "admin",
  },
  {
    id: "2",
    username: "teacher",
    password: "password123",
    name: "Giáo viên",
    role: "teacher",
  },
  {
    id: "3",
    username: "staff",
    password: "password123",
    name: "Nhân viên",
    role: "staff",
  },
]

// Hàm tạo JWT token
const generateToken = (user: any, expiresIn: string) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  }

  return sign(payload, process.env.JWT_SECRET || "your-secret-key", { expiresIn })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Tìm user trong database
    const user = users.find((u) => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" }, { status: 401 })
    }

    // Tạo access token và refresh token
    const accessToken = generateToken(user, "15m") // 15 phút
    const refreshToken = generateToken(user, "7d") // 7 ngày

    // Trả về cả access token và refresh token cho client
    return NextResponse.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, role: user.role },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Đã xảy ra lỗi khi đăng nhập" }, { status: 500 })
  }
}

