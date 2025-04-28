import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white p-4 md:p-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-8">
        <div className="mb-6 flex flex-col items-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Logo Bechovang"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-red-700">Bechovang</h1>
          <p className="text-sm text-gray-500">Hệ thống quản lý học sinh</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

