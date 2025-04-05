import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-700">
              Liên hệ với chúng tôi
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-lg space-y-4 mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-2">
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
                    className="h-4 w-4 text-red-700"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Điện thoại</h3>
                  <p className="text-sm text-gray-500">0123 456 789</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-2">
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
                    className="h-4 w-4 text-red-700"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-gray-500">info@anhbinhminh.edu.vn</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    placeholder="Nhập email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Nội dung
                </label>
                <textarea
                  id="message"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  placeholder="Nhập nội dung"
                  rows={4}
                ></textarea>
              </div>
              <Button className="w-full bg-red-700 hover:bg-red-800">Gửi</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

