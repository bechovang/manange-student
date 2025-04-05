import Link from "next/link"
import { Facebook, Mail, Phone, MapPin } from "lucide-react"
import { FaTiktok } from "react-icons/fa"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-red-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-xl font-bold mb-4">Trung Tâm Bồi Dưỡng Ánh Bình Minh</h3>
            <div className="flex items-start mb-2">
              <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Địa chỉ: số 101 Làng Tăng Phú, P Tăng Nhơn Phú A, TP Thủ Đức, TP Hồ Chí Minh</span>
            </div>
            <div className="flex items-center mt-4">
              <Phone className="h-5 w-5 mr-2" />
              <span>Zalo: 0971515451</span>
            </div>
            <div className="flex items-center mt-2">
              <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Email: anhbinhminh.infor@gmail.com</span>
            </div>
          </div>

          {/* Liên Kết nhanh */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-red-300 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-red-300 transition-colors">
                  Đăng ký học
                </Link>
              </li>
              <li>
                <Link href="/honor" className="hover:text-red-300 transition-colors">
                  Vinh danh
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-red-300 transition-colors">
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link href="/tuition" className="hover:text-red-300 transition-colors">
                  Học phí
                </Link>
              </li>
            </ul>
          </div>

          {/* Kết nối với chúng tôi */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kết nối với chúng tôi</h3>
            <div className="flex space-x-4 items-center">
              <Link href="https://www.facebook.com/abmedu" className="hover:text-red-300 transition-colors">
                <Facebook className="h-8 w-8" />
              </Link>
              <Link href="https://www.tiktok.com/@abmedu" className="hover:text-red-300 transition-colors">
                <FaTiktok className="h-8 w-8" />
              </Link>
              <Link href="https://zalo.me/659811059618688301" className="group">
                <div className="relative h-8 w-8">
                  <Image 
                    src="/zalo-logo-white.svg" 
                    alt="Zalo" 
                    width={32}
                    height={32}
                    className="absolute h-8 w-8 group-hover:opacity-0 transition-opacity"
                  />
                  <Image 
                    src="/zalo-logo-text-red-300.svg" 
                    alt="Zalo" 
                    width={32}
                    height={32}
                    className="absolute h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </Link>
              <Link href="tel:0971515451" className="hover:text-red-300 transition-colors">
                <Phone className="h-8 w-8" />
              </Link>
            </div>
          </div>

          {/* Phần Google Map */}
          <div>
            <h3 className="text-xl font-bold mb-4">Bản đồ</h3>
            <div className="aspect-w-16 aspect-h-9 mb-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5583185812816!2d106.79635457594819!3d10.845073589307937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527ee4ecfbe0f%3A0x1052cd27bec80e62!2zVHJ1bmcgdMOibSBi4buTaSBkxrDhu6FuZyB2xINuIGhvw6Egw4FuaCBCw6xuaCBNaW5oIC0gQUJNZWR1!5e0!3m2!1sen!2s!4v1742963911154!5m2!1sen!2s"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
            </div>
            <Link
              href="https://www.google.com/maps/place/Trung+t%C3%A2m+b%E1%BB%93i+d%C6%B0%E1%BB%A1ng+v%C4%83n+ho%C3%A1+%C3%81nh+B%C3%ACnh+Minh+-+ABMedu/@10.8450736,106.7963546,17z/data=!3m1!4b1!4m6!3m5!1s0x317527ee4ecfbe0f:0x1052cd27bec80e62!8m2!3d10.8450736!4d106.7989295!16s%2Fg%2F11x32x7qhk?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm hover:text-red-300 transition-colors mt-2"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Mở bằng Google Map
            </Link>
            <div className="mt-2 text-xs text-gray-300">
              <p>Dữ liệu Bản đồ</p>
              <p>Điều khoản</p>
              <p>Báo cáo một lỗi bản đồ</p>
            </div>
          </div>
        </div>

        <div className="border-t border-red-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Trung Tâm Ánh Bình Minh. Tất cả quyền được bảo lưu.</p>
          <p className="mt-2">Thiết kế bởi Ngọc Phúc</p>
        </div>
      </div>
    </footer>
  )
}