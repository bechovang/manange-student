import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  const plans = [
    {
      name: "Cơ bản",
      description: "Dành cho trung tâm nhỏ",
      price: "1.000.000đ",
      period: "/tháng",
      features: ["Tối đa 100 học sinh", "Quản lý học sinh", "Quản lý lớp học", "Điểm danh cơ bản"],
      popular: false,
    },
    {
      name: "Tiêu chuẩn",
      description: "Dành cho trung tâm vừa",
      price: "2.000.000đ",
      period: "/tháng",
      features: [
        "Tối đa 300 học sinh",
        "Tất cả tính năng gói Cơ bản",
        "Điểm danh QR code",
        "Thông báo Zalo",
        "Báo cáo thống kê",
      ],
      popular: true,
    },
    {
      name: "Cao cấp",
      description: "Dành cho trung tâm lớn",
      price: "3.500.000đ",
      period: "/tháng",
      features: [
        "Không giới hạn học sinh",
        "Tất cả tính năng gói Tiêu chuẩn",
        "API tích hợp",
        "Hỗ trợ 24/7",
        "Tùy chỉnh theo yêu cầu",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-700">Bảng giá</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Lựa chọn gói dịch vụ phù hợp với quy mô trung tâm của bạn
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg border p-6 shadow-sm ${plan.popular ? "border-red-200 bg-red-50" : ""}`}
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-gray-500">{plan.description}</p>
                {plan.popular && (
                  <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                    Phổ biến nhất
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="ml-1 text-sm text-gray-500">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
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
                      className="h-4 w-4 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/login">
                  <Button className="w-full bg-red-700 hover:bg-red-800">Dùng thử miễn phí</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

