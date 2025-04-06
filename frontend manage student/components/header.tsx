"use client"

import { useState } from "react"
import { Bell, LogOut, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "./sidebar-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/auth"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LogoutDialog } from "./logout-dialog"

export function Header() {
  const { toggle } = useSidebar()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
      <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="relative ml-auto mr-4 hidden w-64 md:block">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Tìm kiếm học sinh, lớp học..." className="pl-8" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2 relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
              3
            </Badge>
            <span className="sr-only">Thông báo</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {[
              {
                id: 1,
                title: "Học sinh mới đăng ký",
                desc: "Nguyễn Văn A đã đăng ký lớp Toán 10A",
                time: "5 phút trước",
                read: false,
              },
              {
                id: 2,
                title: "Nhắc nhở học phí",
                desc: "5 học sinh chưa đóng học phí tháng 6",
                time: "30 phút trước",
                read: false,
              },
              {
                id: 3,
                title: "Lịch dạy thay đổi",
                desc: "Lớp Anh Văn 11B đổi lịch học sang thứ 4",
                time: "1 giờ trước",
                read: false,
              },
              {
                id: 4,
                title: "Báo cáo điểm danh",
                desc: "Báo cáo điểm danh tuần đã được cập nhật",
                time: "1 ngày trước",
                read: true,
              },
            ].map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 ${notification.read ? "" : "bg-blue-50"}`}
              >
                <div className="font-medium text-sm">{notification.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{notification.desc}</div>
                <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center font-medium">Xem tất cả thông báo</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 flex items-center gap-1"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Đăng xuất</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <UserNav />
      
      <LogoutDialog isOpen={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen} />
    </header>
  )
}

