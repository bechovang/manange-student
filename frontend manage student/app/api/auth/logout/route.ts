import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Xóa refresh token khỏi cookie
  cookies().delete("refreshToken")

  return NextResponse.json({ message: "Đăng xuất thành công" })
}

