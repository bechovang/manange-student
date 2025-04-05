import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Script from "next/script"
import { NotificationProvider } from "@/components/custom-notification" // Thêm import này

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trung tâm Ánh Bình Minh",
  description: "Trung tâm dạy học ngoài giờ - chuyên bồi dưỡng văn hoá cho học sinh phổ thông.",
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-N5CDT06PJQ" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N5CDT06PJQ');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Thêm NotificationProvider ở đây */}
          <NotificationProvider>
            <Navbar />
            {children}
            <Footer />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}