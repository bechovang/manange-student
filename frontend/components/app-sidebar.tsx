"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckSquare,
  CreditCard,
  MessageSquare,
  Settings,
  Users,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Học sinh",
    href: "/students",
    icon: Users,
  },
  {
    title: "Lớp học",
    href: "/classes",
    icon: BookOpen,
  },
  {
    title: "Điểm danh",
    href: "/attendance",
    icon: CheckSquare,
  },
  {
    title: "Ghi nhận thanh toán",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Học phí",
    href: "/tuition",
    icon: Wallet,
  },
  {
    title: "Lịch học",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "Thông báo Zalo",
    href: "/notifications",
    icon: MessageSquare,
  },
  {
    title: "Cài đặt",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isOpen } = useSidebar()

  return (
    <aside
      data-sidebar
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-white transition-transform md:static",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-red-700"></div>
          <span className="text-lg font-bold text-red-700">Ánh Bình Minh</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === link.href && "bg-red-50 text-red-700 hover:bg-red-100",
                )}
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-5 w-5" />
                  {link.title}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-500">admin@anhbinhminh.edu.vn</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

