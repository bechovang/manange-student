"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Handle smooth scrolling for hash links
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      // Update URL without page reload
      window.history.pushState({}, "", `/#${sectionId}`)
      // Close mobile menu if open
      setIsMenuOpen(false)
    }
  }

  // Check for hash in URL on initial load
  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1)
      const section = document.getElementById(sectionId)
      if (section) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-red-700"></div>
          <span className="text-lg font-bold text-red-700">Bechovang</span>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          <a
            href="#features"
            className="text-sm font-medium hover:text-red-700"
            onClick={(e) => handleScrollToSection(e, "features")}
          >
            Tính năng
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium hover:text-red-700"
            onClick={(e) => handleScrollToSection(e, "testimonials")}
          >
            Đánh giá
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium hover:text-red-700"
            onClick={(e) => handleScrollToSection(e, "pricing")}
          >
            Bảng giá
          </a>
          <a
            href="#contact"
            className="text-sm font-medium hover:text-red-700"
            onClick={(e) => handleScrollToSection(e, "contact")}
          >
            Liên hệ
          </a>
        </nav>

        <Link href="/login" className="hidden md:block">
          <Button className="bg-red-700 hover:bg-red-800">
            Đăng nhập
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-2 px-4 bg-white">
          <nav className="flex flex-col space-y-3">
            <a
              href="#features"
              className="text-sm font-medium hover:text-red-700 py-1"
              onClick={(e) => handleScrollToSection(e, "features")}
            >
              Tính năng
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium hover:text-red-700 py-1"
              onClick={(e) => handleScrollToSection(e, "testimonials")}
            >
              Đánh giá
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium hover:text-red-700 py-1"
              onClick={(e) => handleScrollToSection(e, "pricing")}
            >
              Bảng giá
            </a>
            <a
              href="#contact"
              className="text-sm font-medium hover:text-red-700 py-1"
              onClick={(e) => handleScrollToSection(e, "contact")}
            >
              Liên hệ
            </a>
            <Link href="/login" className="py-1">
              <Button className="w-full bg-red-700 hover:bg-red-800">
                Đăng nhập
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

