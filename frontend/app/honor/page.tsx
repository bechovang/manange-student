"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useState } from "react"
import Image from "next/image"

// Dữ liệu học sinh theo từng năm
const studentsByYear = {
  "2024": [
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
      name: "Nguyễn Trọng Ti",
      score: 9.75,
      school: "chuyên",
      avatar: "/images/avatars/student3.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh trường chuyên đạt điểm gần tuyệt đối môn Hóa kỳ thi tốt nghiệp THPT 2024",
    },
    {
      name: "Nguyễn Huỳnh San",
      score: 9.5,
      school: "",
      avatar: "/images/avatars/student4.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2024",
    },
    {
      name: "Nguyễn Anh Dương",
      score: 9.5,
      school: "",
      avatar: "/images/avatars/student5.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2024",
    },
  ],
  "2023": [
    {
      name: "Trần Minh Quân",
      score: 9.75,
      school: "chuyên",
      avatar: "/images/avatars/student6.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm gần tuyệt đối môn Hóa kỳ thi tốt nghiệp THPT 2023",
    },
    {
      name: "Lê Thị Hồng Nhung",
      score: 9.5,
      school: "",
      avatar: "/images/avatars/student7.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2023",
    },
    {
      name: "Phạm Văn Hiếu",
      score: 9.5,
      school: "chuyên",
      avatar: "/images/avatars/student8.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh trường chuyên đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2023",
    },
    {
      name: "Nguyễn Thị Lan Anh",
      score: 9.25,
      school: "",
      avatar: "/images/avatars/student9.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2023",
    },
  ],
  "2022": [
    {
      name: "Trần Văn Minh",
      score: 9.75,
      school: "",
      avatar: "/images/avatars/student10.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm gần tuyệt đối môn Hóa kỳ thi tốt nghiệp THPT 2022",
    },
    {
      name: "Nguyễn Thị Hà",
      score: 9.5,
      school: "chuyên",
      avatar: "/images/avatars/student11.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh trường chuyên đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2022",
    },
    {
      name: "Lê Hoàng Nam",
      score: 9.25,
      school: "",
      avatar: "/images/avatars/student12.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2022",
    },
  ],
  "2021": [
    {
      name: "Phạm Thị Hương",
      score: 9.5,
      school: "",
      avatar: "/images/avatars/student13.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2021",
    },
    {
      name: "Nguyễn Văn Tùng",
      score: 9.25,
      school: "chuyên",
      avatar: "/images/avatars/student1.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh trường chuyên đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2021",
    },
    {
      name: "Trần Thị Mai",
      score: 9.0,
      school: "",
      avatar: "/images/avatars/student2.jpg",
      scoreImage: "/placeholder.svg?height=800&width=600",
      description: "Học sinh xuất sắc đạt điểm cao môn Hóa kỳ thi tốt nghiệp THPT 2021",
    },
  ],
}

// Component hiển thị danh sách học sinh theo năm
function HighScoreStudentsByYear({ year }: { year: string }) {
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const students = studentsByYear[year as keyof typeof studentsByYear] || []

  const getInitials = (name: string) => {
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
        {students.map((student, index) => (
          <Card
            key={index}
            className="overflow-hidden border border-red-100 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-red-200">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="bg-red-100 text-red-700 text-sm sm:text-base">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full text-center">
                  <h3 className="font-semibold text-xs sm:text-sm line-clamp-1">{student.name}</h3>
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
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6 w-full">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 border-2 border-red-200 shadow-md">
                  <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                  <AvatarFallback className="bg-red-100 text-red-700 text-lg sm:text-xl">
                    {getInitials(selectedStudent.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left mt-1 sm:mt-0">
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
                  <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
                    {selectedStudent.description}
                  </p>
                </div>
              </div>
              <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh]">
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
                Bảng điểm kỳ thi tốt nghiệp THPT {year}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function HonorPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">Vinh danh học sinh xuất sắc</h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
        Trang vinh danh các học sinh xuất sắc đạt điểm cao trong kỳ thi tốt nghiệp THPT qua các năm tại Trung Tâm Bồi Dưỡng Ánh Bình Minh
        Mạnh Cường
      </p>

      <Tabs defaultValue="2024" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto mb-8 bg-red-100 p-1 rounded-lg shadow-md">
          <TabsTrigger
            value="2024"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-300"
          >
            Năm 2024
          </TabsTrigger>
          <TabsTrigger
            value="2023"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-300"
          >
            Năm 2023
          </TabsTrigger>
          <TabsTrigger
            value="2022"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-300"
          >
            Năm 2022
          </TabsTrigger>
          <TabsTrigger
            value="2021"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-300"
          >
            Năm 2021
          </TabsTrigger>
        </TabsList>

        <TabsContent value="2024">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Học sinh xuất sắc năm 2024</CardTitle>
              <CardDescription className="text-center">
                Danh sách học sinh đạt điểm cao trong kỳ thi tốt nghiệp THPT năm 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighScoreStudentsByYear year="2024" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2023">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Học sinh xuất sắc năm 2023</CardTitle>
              <CardDescription className="text-center">
                Danh sách học sinh đạt điểm cao trong kỳ thi tốt nghiệp THPT năm 2023
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighScoreStudentsByYear year="2023" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2022">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Học sinh xuất sắc năm 2022</CardTitle>
              <CardDescription className="text-center">
                Danh sách học sinh đạt điểm cao trong kỳ thi tốt nghiệp THPT năm 2022
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighScoreStudentsByYear year="2022" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2021">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Học sinh xuất sắc năm 2021</CardTitle>
              <CardDescription className="text-center">
                Danh sách học sinh đạt điểm cao trong kỳ thi tốt nghiệp THPT năm 2021
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighScoreStudentsByYear year="2021" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Thành tích nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">100%</div>
              <p className="text-gray-700">Học sinh đạt điểm trên 8.0</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">85%</div>
              <p className="text-gray-700">Học sinh đạt điểm trên 9.0</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">15+</div>
              <p className="text-gray-700">Học sinh đạt điểm tuyệt đối 10</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

