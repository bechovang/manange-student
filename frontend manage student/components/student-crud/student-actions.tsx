"use client"

import { ViewStudentDialog } from "./view-student-dialog"
import { EditStudentDialog } from "./edit-student-dialog"
import { DeleteStudentDialog } from "./delete-student-dialog"
import { Student } from "./types"

export function StudentActions({ student }: { student: Student }) {
  return (
    <div className="flex items-center gap-2">
      <ViewStudentDialog student={student} />
      <EditStudentDialog student={student} />
      <DeleteStudentDialog student={student} />
    </div>
  )
} 