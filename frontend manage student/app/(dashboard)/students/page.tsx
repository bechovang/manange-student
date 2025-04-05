import { AddStudentDialog } from "@/components/student-crud"
import { EnhancedStudentTable } from "@/components/enhanced-student-table"

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý học sinh</h1>
          <p className="text-muted-foreground">Quản lý thông tin học sinh của trung tâm</p>
        </div>
        <AddStudentDialog />
      </div>

      <EnhancedStudentTable />
    </div>
  )
}

