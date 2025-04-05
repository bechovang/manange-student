"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface Student {
  name: string
  score: number
  school: string
  avatar: string
  scoreImage: string
  description: string
}

const students: Student[] = [
  {
    name: "Nguyễn Phan Bảo Trân",
    score: 10.0,
    school: "chuyên",
    avatar: "/images/avatars/student1.jpg",
    scoreImage: "/placeholder.svg?height=800&width=600",
    description: "Học sinh xuất sắc đạt điểm tuyệt đối môn Hóa kỳ thi tốt nghiệp THPT 2024",
  },
  {
    name: "Nguyễn Lam Tông",
    score: 9.75,
    school: "",
    avatar: "/images/avatars/student2.jpg",
    scoreImage: "/placeholder.svg?height=800&width=600",
    description: "Học sinh xuất sắc đạt điểm gần tuyệt đối môn Hóa kỳ thi tốt nghiệp THPT 2024",
  },
  {
    name: "Trần Thị Minh Anh",
    score: 9.5,
    school: "THPT Chuyên Lê Hồng Phong",
    avatar: "/images/avatars/student3.jpg",
    scoreImage: "/placeholder.svg?height=800&width=600",
    description: "Học sinh chuyên Hóa đạt điểm cao kỳ thi tốt nghiệp THPT 2024",
  },
  {
    name: "Lê Văn Hoàng",
    score: 9.25,
    school: "THPT Nguyễn Thượng Hiền",
    avatar: "/images/avatars/student4.jpg",
    scoreImage: "/placeholder.svg?height=800&width=600",
    description: "Học sinh đạt điểm cao môn Hóa với phương pháp tự học hiệu quả",
  },
  {
    name: "Phạm Thị Ngọc Hà",
    score: 9.0,
    school: "THPT Gia Định",
    avatar: "/images/avatars/student5.jpg",
    scoreImage: "/placeholder.svg?height=800&width=600",
    description: "Nỗ lực vượt bậc từ điểm số trung bình lên thành tích xuất sắc",
  },
  {
    name: "Võ Thanh Tùng",
    score: 8.75,
    school: "THPT Marie Curie",
    avatar: "/images/avatars/student6.jpg",
    scoreImage: "/placeholder.svg?height=800&width=600",
    description: "Học sinh có tiến bộ vượt bậc trong học tập môn Hóa",
  },
  // ... (các học sinh khác giữ nguyên)
]

export default function HighScoreStudents() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {students.map((student: Student, index: number) => (
          <Card
            key={index}
            className="overflow-hidden border border-red-100 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-16 w-16 border-2 border-red-200">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="bg-red-100 text-red-700 text-lg">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full text-center">
                  <h3 className="font-semibold text-sm line-clamp-1">{student.name}</h3>
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <Badge className="bg-red-600 hover:bg-red-700 text-xs py-0 px-2">
                      {student.score.toFixed(2)} điểm
                    </Badge>
                    {student.school && (
                      <Badge variant="outline" className="text-xs py-0 px-2 line-clamp-1">
                        {student.school}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full">
          <VisuallyHidden>
            <DialogTitle>Thông tin chi tiết học sinh</DialogTitle>
          </VisuallyHidden>
          {selectedStudent && (
            <div className="flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-4 md:mb-6 w-full">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 border-2 border-red-200 shadow-md">
                  <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                  <AvatarFallback className="bg-red-100 text-red-700 text-xl">
                    {getInitials(selectedStudent.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left mt-2 sm:mt-0">
                  <h2 className="text-lg sm:text-xl font-bold">{selectedStudent.name}</h2>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-2 mt-1 sm:mt-2">
                    <Badge className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm py-0 px-2">
                      {selectedStudent.score.toFixed(2)} điểm
                    </Badge>
                    {selectedStudent.school && (
                      <Badge variant="outline" className="text-xs sm:text-sm py-0 px-2">
                        {selectedStudent.school}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2 text-xs sm:text-sm">
                    {selectedStudent.description}
                  </p>
                </div>
              </div>
              <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh]">
                <Image
                  src={selectedStudent.scoreImage || "/placeholder.svg"}
                  alt={`Bảng điểm của ${selectedStudent.name}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw"
                  priority={false}
                />
              </div>
              <p className="mt-2 sm:mt-3 text-center text-xs text-gray-500">
                Bảng điểm kỳ thi tốt nghiệp THPT 2024
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}