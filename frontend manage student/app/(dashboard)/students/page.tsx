"use client"

import { EnhancedStudentTable } from "@/components/enhanced-student-table"
import { AddStudentDialog } from "@/components/student-crud/add-student-dialog"
import React, { useRef } from "react"

export default function StudentsPage() {
  // Tạo một ref để lưu hàm refreshStudents từ EnhancedStudentTable
  const tableRef = useRef<{refreshStudents: () => void}>({
    refreshStudents: () => {}
  });

  // Hàm setter cho refreshStudents
  const setRefreshFunction = (refreshFn: () => void) => {
    tableRef.current.refreshStudents = refreshFn;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Học sinh</h1>
          <p className="text-muted-foreground">Quản lý danh sách học sinh trong hệ thống.</p>
        </div>
        <AddStudentDialog onSuccess={tableRef.current.refreshStudents} />
      </div>
      <EnhancedStudentTable setRefreshFunction={setRefreshFunction} />
    </div>
  )
} 