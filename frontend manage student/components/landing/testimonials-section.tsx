export function TestimonialsSection() {
  const testimonials = [
    {
      content:
        "Hệ thống quản lý học sinh Ánh Bình Minh đã giúp trung tâm chúng tôi tiết kiệm rất nhiều thời gian và công sức trong việc quản lý học sinh và học phí.",
      author: "Nguyễn Văn A",
      position: "Giám đốc Trung tâm XYZ",
    },
    {
      content:
        "Tính năng điểm danh QR code và thông báo Zalo rất tiện lợi, giúp chúng tôi liên lạc với phụ huynh nhanh chóng và hiệu quả.",
      author: "Trần Thị B",
      position: "Quản lý Trung tâm ABC",
    },
    {
      content:
        "Báo cáo thống kê chi tiết giúp chúng tôi nắm bắt được tình hình học tập và tài chính của trung tâm một cách toàn diện.",
      author: "Lê Văn C",
      position: "Chủ Trung tâm DEF",
    },
  ]

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-700">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hàng trăm trung tâm giáo dục đã tin tưởng và sử dụng hệ thống của chúng tôi
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col justify-between rounded-lg border p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-yellow-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-gray-500">"{testimonial.content}"</p>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="rounded-full bg-gray-100 p-1">
                  <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

