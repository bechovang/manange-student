"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Đăng ký học", href: "/register" },
  { name: "Vinh danh", href: "/honor" },
  { name: "Tài liệu", href: "/documents" },
  { name: "Học phí", href: "/tuition" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.jpg" alt="Logo Ánh Bình Minh" width={40} height={40} className="rounded-md" />
            <span className="hidden font-bold sm:inline-block text-xl">Ánh Bình Minh</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-red-600">
              {item.name}
            </Link>
          ))}
          <Button className="animate-pulse-glow-amber bg-amber-500 hover:bg-amber-600" asChild>
            <Link href="/register">Đăng ký học</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4">
          <nav className="flex flex-col space-y-4 px-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button className="bg-amber-500 hover:bg-amber-600 w-full" asChild>
              <Link href="/register">Đăng ký học</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

