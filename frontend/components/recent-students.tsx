import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentStudents = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    class: "Toán 10A",
    date: "15/06/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Trần Thị B",
    class: "Anh Văn 11B",
    date: "12/06/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Lê Văn C",
    class: "Lý 12A",
    date: "10/06/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    class: "Hóa 11A",
    date: "08/06/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    class: "Toán 9A",
    date: "05/06/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function RecentStudents() {
  return (
    <div className="space-y-4">
      {recentStudents.map((student) => (
        <div key={student.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{student.name}</p>
              <p className="text-xs text-muted-foreground">{student.class}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{student.date}</div>
        </div>
      ))}
    </div>
  )
}

