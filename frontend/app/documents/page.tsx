import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, ExternalLink, BookMarked, GraduationCap } from "lucide-react"

// Cập nhật một số mục trong dữ liệu để theoryLink là null
const documents = {
  grade12: [
    {
      title: "Toán 12 chương 1 lần 1",
      theoryLink: "https://drive.google.com/file/d/math12-1",
      exerciseLink: "https://drive.google.com/file/d/exercise-math12-1",
    },
    {
      title: "Toán 12 chương 2 lần 1",
      theoryLink: null,
      exerciseLink: "https://drive.google.com/file/d/exercise-math12-2",
    },
    {
      title: "Ôn tập kiểm tra giữa kỳ Toán 12",
      theoryLink: "https://drive.google.com/file/d/review-math12-midterm",
      exerciseLink: "https://drive.google.com/file/d/exercise-math12-midterm",
    },
    {
      title: "Thi thử HSG Toán 12 lần 1",
      theoryLink: "https://drive.google.com/file/d/hsg-math12-1",
      exerciseLink: null,
    },
    {
      title: "Lý 12 chương 1 lần 1",
      theoryLink: "https://drive.google.com/file/d/physics12-1",
      exerciseLink: "https://drive.google.com/file/d/exercise-physics12-1",
    },
    {
      title: "Ôn tập kiểm tra cuối kỳ Lý 12",
      theoryLink: "https://drive.google.com/file/d/review-physics12-final",
      exerciseLink: "https://drive.google.com/file/d/exercise-physics12-final",
    },
    {
      title: "Hóa 12 chương 1 lần 1",
      theoryLink: "https://drive.google.com/file/d/chemistry12-1",
      exerciseLink: "https://drive.google.com/file/d/exercise-chemistry12-1",
    },
    {
      title: "Ôn thi đại học Hóa 12",
      theoryLink: "https://drive.google.com/file/d/university-exam-chemistry12",
      exerciseLink: "https://drive.google.com/file/d/exercise-university-chemistry12",
    }
  ],
  grade11: [
    {
      title: "Toán 11 chương 1 lần 1",
      theoryLink: "https://drive.google.com/file/d/math11-1",
      exerciseLink: "https://drive.google.com/file/d/exercise-math11-1",
    },
    {
      title: "Lý 11 chương 2 lần 1",
      theoryLink: "https://drive.google.com/file/d/physics11-2",
      exerciseLink: null,
    },
    {
      title: "Ôn tập kiểm tra giữa kỳ Toán 11",
      theoryLink: "https://drive.google.com/file/d/review-math11-midterm",
      exerciseLink: "https://drive.google.com/file/d/exercise-math11-midterm",
    },
    {
      title: "Thi thử HSG Hóa 11 lần 2",
      theoryLink: "https://drive.google.com/file/d/hsg-chemistry11-2",
      exerciseLink: "https://drive.google.com/file/d/exercise-hsg-chemistry11-2",
    }
  ],
  grade10: [
    {
      title: "Toán 10 chương 1 lần 1",
      theoryLink: "https://drive.google.com/file/d/math10-1",
      exerciseLink: "https://drive.google.com/file/d/exercise-math10-1",
    },
    {
      title: "Ôn tập kiểm tra cuối kỳ Toán 10",
      theoryLink: "https://drive.google.com/file/d/review-math10-final",
      exerciseLink: "https://drive.google.com/file/d/exercise-math10-final",
    },
    {
      title: "Hóa 10 chương 2 lần 1",
      theoryLink: null,
      exerciseLink: "https://drive.google.com/file/d/exercise-chemistry10-2",
    },
    {
      title: "Thi thử HSG Lý 10 lần 1",
      theoryLink: "https://drive.google.com/file/d/hsg-physics10-1",
      exerciseLink: "https://drive.google.com/file/d/exercise-hsg-physics10-1",
    }
  ]
};



export default function DocumentsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">Tài liệu Trung tâm Ánh Bình Minh</h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
      Trang cung cấp tài liệu miễn phí dành cho học sinh. Để đăng ký lớp học offline tại TP.HCM, 
      tham gia khóa học online hoặc nhận tài liệu giảng dạy dưới dạng file Word, vui lòng liên hệ 
      trung tâm qua <span className="font-medium">Facebook Trung Tâm Bồi Dưỡng Ánh Bình Minh</span> hoặc <span className="font-medium">Zalo 0971515451</span>.
      </p>

      <Tabs defaultValue="grade12" className="w-full">


        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-red-100 p-1 rounded-lg shadow-md border border-red-300">
          <TabsTrigger
            value="grade12"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-300 hover:bg-red-300"
          >
            Lớp 12
          </TabsTrigger>
          <TabsTrigger
            value="grade11"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-300 hover:bg-red-300"
          >
            Lớp 11
          </TabsTrigger>
          <TabsTrigger
            value="grade10"
            className="data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-300 hover:bg-red-300"
          >
            Lớp 10
          </TabsTrigger>
        </TabsList>


        <TabsContent value="grade12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Tài liệu lớp 12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.grade12.map((item, index) => (
                  <Card
                    key={index}
                    className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-blue-500 ${!item.theoryLink && !item.exerciseLink ? "opacity-70" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <GraduationCap className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                          <h3 className="font-medium text-lg">{item.title}</h3>
                        </div>

                        <div className="mt-auto flex flex-col gap-2">
                          {item.theoryLink ? (
                            <a
                              href={item.theoryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 w-full bg-blue-50 hover:bg-blue-100 border-blue-200"
                              >
                                <BookOpen className="h-4 w-4 text-blue-700" />
                                <span className="flex-1 text-left">Lý thuyết</span>
                                <ExternalLink className="h-3 w-3 text-blue-700" />
                              </Button>
                            </a>
                          ) : (
                            <div className="h-9 flex items-center text-sm text-gray-500 pl-2">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Chưa có lý thuyết</span>
                            </div>
                          )}

                          {item.exerciseLink ? (
                            <a
                              href={item.exerciseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 w-full bg-amber-50 hover:bg-amber-100 border-amber-200"
                              >
                                <BookMarked className="h-4 w-4 text-amber-700" />
                                <span className="flex-1 text-left">Bài tập</span>
                                <ExternalLink className="h-3 w-3 text-amber-700" />
                              </Button>
                            </a>
                          ) : (
                            <div className="h-9 flex items-center text-sm text-gray-500 pl-2">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Chưa có bài tập</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade11">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Tài liệu lớp 11</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.grade11.map((item, index) => (
                  <Card
                    key={index}
                    className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-green-500 ${!item.theoryLink && !item.exerciseLink ? "opacity-70" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <GraduationCap className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                          <h3 className="font-medium text-lg">{item.title}</h3>
                        </div>

                        <div className="mt-auto flex flex-col gap-2">
                          {item.theoryLink ? (
                            <a
                              href={item.theoryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 w-full bg-green-50 hover:bg-green-100 border-green-200"
                              >
                                <BookOpen className="h-4 w-4 text-green-700" />
                                <span className="flex-1 text-left">Lý thuyết</span>
                                <ExternalLink className="h-3 w-3 text-green-700" />
                              </Button>
                            </a>
                          ) : (
                            <div className="h-9 flex items-center text-sm text-gray-500 pl-2">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Chưa có lý thuyết</span>
                            </div>
                          )}

                          {item.exerciseLink ? (
                            <a
                              href={item.exerciseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 w-full bg-amber-50 hover:bg-amber-100 border-amber-200"
                              >
                                <BookMarked className="h-4 w-4 text-amber-700" />
                                <span className="flex-1 text-left">Bài tập</span>
                                <ExternalLink className="h-3 w-3 text-amber-700" />
                              </Button>
                            </a>
                          ) : (
                            <div className="h-9 flex items-center text-sm text-gray-500 pl-2">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Chưa có bài tập</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Tài liệu lớp 10</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.grade10.map((item, index) => (
                  <Card
                    key={index}
                    className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-purple-500 ${!item.theoryLink && !item.exerciseLink ? "opacity-70" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <GraduationCap className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                          <h3 className="font-medium text-lg">{item.title}</h3>
                        </div>

                        <div className="mt-auto flex flex-col gap-2">
                          {item.theoryLink ? (
                            <a
                              href={item.theoryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 w-full bg-purple-50 hover:bg-purple-100 border-purple-200"
                              >
                                <BookOpen className="h-4 w-4 text-purple-700" />
                                <span className="flex-1 text-left">Lý thuyết</span>
                                <ExternalLink className="h-3 w-3 text-purple-700" />
                              </Button>
                            </a>
                          ) : (
                            <div className="h-9 flex items-center text-sm text-gray-500 pl-2">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Chưa có lý thuyết</span>
                            </div>
                          )}

                          {item.exerciseLink ? (
                            <a
                              href={item.exerciseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 w-full bg-amber-50 hover:bg-amber-100 border-amber-200"
                              >
                                <BookMarked className="h-4 w-4 text-amber-700" />
                                <span className="flex-1 text-left">Bài tập</span>
                                <ExternalLink className="h-3 w-3 text-amber-700" />
                              </Button>
                            </a>
                          ) : (
                            <div className="h-9 flex items-center text-sm text-gray-500 pl-2">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Chưa có bài tập</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

