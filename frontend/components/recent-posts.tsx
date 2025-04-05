import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

const posts = [
  {
    id: 1,
    title: "Lộ trình học Toán 12 - Từ cơ bản đến nâng cao",
    excerpt: "Chương trình học Toán 12 giúp học sinh nắm vững kiến thức và đạt điểm cao trong kỳ thi tốt nghiệp THPT.",
    date: "22/12/2024",
    author: "ABMedu",
    image: "/placeholder.svg?height=200&width=400",
    slug: "lo-trinh-hoc-toan-12",
  },
  {
    id: 2,
    title: "Khóa học Lý 11 - Rèn luyện tư duy và kỹ năng giải bài tập",
    excerpt: "Tổng hợp các chuyên đề Vật Lý 11 quan trọng, giúp học sinh nâng cao tư duy và kỹ năng giải bài tập.",
    date: "21/12/2024",
    author: "ABMedu",
    image: "/placeholder.svg?height=200&width=400",
    slug: "khoa-hoc-ly-11",
  },
  {
    id: 3,
    title: "Chinh phục Hóa 10 - Nền tảng vững chắc cho các lớp trên",
    excerpt: "Khóa học Hóa 10 giúp học sinh hiểu sâu kiến thức nền tảng, chuẩn bị cho chương trình Hóa nâng cao.",
    date: "20/12/2024",
    author: "ABMedu",
    image: "/placeholder.svg?height=200&width=400",
    slug: "chinh-phuc-hoa-10",
  },
  
]

export default function RecentPosts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 w-full">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold text-xl mb-2">
              <Link href={`/posts/${post.slug}`} className="hover:text-red-600 transition-colors">
                {post.title}
              </Link>
            </h3>
            <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

