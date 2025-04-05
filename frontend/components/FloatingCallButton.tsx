// components/FloatingContactButtons.tsx
"use client"

import { Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Nút Zalo với hiệu ứng lắc */}
      <Link 
        href="https://zalo.me/0971515451" 
        target="_blank"
        rel="noopener noreferrer"
        className="animate-wiggle hover:animate-wiggle-more" // Hiệu ứng lắc
      >
        <div className="h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="relative h-12 w-12">
            <Image 
              src="/images/zalo-seeklogo.png" 
              alt="Zalo" 
              fill
              className="object-contain"
            />
          </div>
        </div>
      </Link>
      
      {/* Nút Gọi điện với hiệu ứng lắc */}
      <Link 
        href="tel:0971515451"
        className="animate-wiggle-faster hover:animate-wiggle-more-faster" // Hiệu ứng lắc nhanh hơn
      >
        <div className="h-16 w-16 rounded-full bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center">
          <Phone className="h-8 w-8 text-white" /> {/* Icon to hơn */}
        </div>
      </Link>
    </div>
  )
}