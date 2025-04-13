"use client"

import { ViewStudentDialog } from "@/components/student-crud/view-student-dialog"
import { EditStudentDialog } from "@/components/student-crud/edit-student-dialog"
import { DeleteStudentDialog } from "@/components/student-crud/delete-student-dialog"
import { Student } from "./types"

export function StudentActions({ student, onSuccess }: { student: Student, onSuccess?: () => void }) {
  return (
    <div className="flex space-x-2">
      <ViewStudentDialog student={student} />
      <EditStudentDialog student={student} onSuccess={onSuccess} />
      <DeleteStudentDialog student={student} onSuccess={onSuccess} />
    </div>
  )
} 