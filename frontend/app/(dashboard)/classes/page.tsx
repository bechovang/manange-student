import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClassList } from "@/components/class-list"

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý lớp học</h1>
          <p className="text-muted-foreground">Quản lý thông tin lớp học và giáo viên</p>
        </div>
        {/* Đã xóa nút thêm lớp học theo yêu cầu */}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả lớp</TabsTrigger>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="upcoming">Sắp khai giảng</TabsTrigger>
          <TabsTrigger value="completed">Đã kết thúc</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <ClassList />
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <ClassList filterStatus="active" />
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <ClassList filterStatus="upcoming" />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <ClassList filterStatus="completed" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

