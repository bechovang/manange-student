"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Card } from "@/components/ui/card"

const classImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Phòng học hiện đại, trang bị máy lạnh đầy đủ",
    caption: "Phòng học hiện đại, rộng rãi, trang bị máy lạnh đầy đủ, đảm bảo môi trường học tập thoải mái.",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Trang bị an toàn cháy nổ tại trung tâm",
    caption: "Trung tâm tuân thủ đầy đủ các quy định về an toàn cháy nổ, đảm bảo môi trường học tập an toàn cho học viên.",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Không gian học tập sạch sẽ, gọn gàng",
    caption: "Lớp học luôn được vệ sinh sạch sẽ, bàn ghế sắp xếp gọn gàng, tạo không gian học tập tốt nhất.",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Khen thưởng học sinh xuất sắc",
    caption: "Trung tâm thường xuyên tổ chức khen thưởng cho các học viên có thành tích xuất sắc trong học tập.",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Học viên đạt thành tích cao trong kỳ thi THPT",
    caption: "Nhiều học viên tại trung tâm đã đạt kết quả cao trong kỳ thi THPT quốc gia.",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Buổi ôn tập cuối cùng trước kỳ thi quan trọng",
    caption: "Buổi ôn tập tổng kết giúp học viên củng cố kiến thức trước khi bước vào kỳ thi quan trọng.",
  },

]

export default function ClassGallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof classImages)[0] | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classImages.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative h-48 w-full">
              <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
            </div>
            <div className="p-3 text-sm text-center">{image.caption}</div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <VisuallyHidden>
            <DialogTitle>Hidden Title</DialogTitle>
          </VisuallyHidden>
          {selectedImage && (
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[60vh]">
                <Image
                  src={selectedImage.src || "/placeholder.svg"}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-4 text-center">{selectedImage.caption}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

