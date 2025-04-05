"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Card } from "@/components/ui/card"

const teacherImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=300&width=400",
    alt: "ThS. Nguyễn Minh An - Giảng viên Lý nâng cao",
    caption: "Thạc sĩ Nguyễn Minh An - 10 năm kinh nghiệm giảng dạy Vật Lý nâng cao và luyện thi học sinh giỏi quốc gia.",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Thầy Trần Văn Hùng - Chuyên gia luyện thi đại học môn Toán",
    caption: "Thầy Trần Văn Hùng - Hơn 15 năm kinh nghiệm ôn luyện Toán cho học sinh giỏi và thi đại học.",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Cô Lê Thị Mai - Tác giả sách luyện thi Hóa",
    caption: "Cô Lê Thị Mai - Giảng viên đại học, đồng tác giả bộ sách 'Bí quyết đạt điểm 9+ môn Hóa'.",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=300&width=400",
    alt: "ThS. Phạm Quang Dũng - Giáo viên chuyên Lý",
    caption: "Thạc sĩ Phạm Quang Dũng - Giảng viên Vật Lý, từng đào tạo nhiều học sinh đạt giải quốc gia.",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=300&width=400",
    alt: "Cô Nguyễn Thanh Hương - Chuyên gia bồi dưỡng học sinh giỏi Hóa",
    caption: "Cô Nguyễn Thanh Hương - Hơn 12 năm kinh nghiệm giảng dạy và bồi dưỡng học sinh giỏi môn Hóa cấp tỉnh, quốc gia.",
  },
  
]

export default function TeacherGallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof teacherImages)[0] | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teacherImages.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative h-64 w-full">
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

