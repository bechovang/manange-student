import { BookOpen, Calendar, CheckSquare, CreditCard, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Quản lý học sinh",
      description: "Theo dõi thông tin học sinh, phụ huynh và lịch sử học tập một cách chi tiết",
    },
    {
      icon: BookOpen,
      title: "Quản lý lớp học",
      description: "Tổ chức lớp học theo giáo viên, môn học và thời gian hiệu quả",
    },
    {
      icon: CheckSquare,
      title: "Điểm danh",
      description: "Điểm danh nhanh chóng bằng QR code hoặc thủ công, theo dõi tỷ lệ đi học",
    },
    {
      icon: CreditCard,
      title: "Quản lý học phí",
      description: "Theo dõi tình trạng đóng học phí, gửi thông báo nhắc nhở tự động",
    },
    {
      icon: Calendar,
      title: "Lịch học",
      description: "Sắp xếp lịch học, lịch dạy cho giáo viên trực quan như Google Calendar",
    },
    {
      icon: ({ className }) => (
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
          className={className}
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      title: "Thông báo Zalo",
      description: "Gửi thông báo đến phụ huynh qua Zalo nhanh chóng và tiện lợi",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-700">
              Tính năng nổi bật
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hệ thống quản lý toàn diện, đáp ứng mọi nhu cầu của trung tâm giáo dục
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-red-100 p-3">
                <feature.icon className="h-6 w-6 text-red-700" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-gray-500 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

