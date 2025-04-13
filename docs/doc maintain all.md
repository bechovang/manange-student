
# TÀI LIỆU CHI TIẾT HỆ THỐNG QUẢN LÝ HỌC SINH

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Giới thiệu
Hệ thống Quản lý Học sinh là một ứng dụng web toàn diện được thiết kế đặc biệt cho các trung tâm giáo dục để quản lý học sinh, lớp học, lịch trình, và học phí. Hệ thống cung cấp giao diện thân thiện với người dùng, hỗ trợ quản lý dữ liệu từ đầu đến cuối và tự động hóa các tính toán phức tạp như tính toán học phí và số dư.

### 1.2. Công nghệ sử dụng

#### 1.2.1. Frontend
- **Framework**: Next.js 13 (App Router) - framework React hiện đại hỗ trợ SSR và routing thông minh
- **Ngôn ngữ**: TypeScript - đảm bảo type-safety cho code
- **Styling**:
  - Tailwind CSS - framework utility-first CSS
  - Shadcn/ui - hệ thống component tái sử dụng cao
- **Quản lý Form và Validation**:
  - React Hook Form - thư viện quản lý form hiệu suất cao
  - Zod - thư viện validation schema mạnh mẽ
- **Quản lý Bảng dữ liệu**: TanStack Table (React Table)
- **Tương tác API**: Axios - client HTTP tùy biến cao
- **Quản lý State**: React Context, useState, useRef
- **Hiển thị thông báo**: React Hot Toast

#### 1.2.2. Backend
- **Framework**: Spring Boot - framework Java hiện đại
- **Ngôn ngữ**: Java 17
- **ORM**: JPA/Hibernate - quản lý dữ liệu với các entity
- **Database**: PostgreSQL - cơ sở dữ liệu quan hệ mạnh mẽ
- **Bảo mật**: Spring Security + JWT
- **Logging**: SLF4J + Logback
- **Testing**: JUnit, Mockito

### 1.3. Kiến trúc hệ thống

#### 1.3.1. Cấu trúc thư mục Frontend
```
├── app/
│   ├── (auth)/ - Routes liên quan xác thực
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/ - Protected routes
│       ├── students/ - Quản lý học sinh
│       ├── classes/ - Quản lý lớp học
│       └── payments/ - Quản lý học phí
├── components/
│   ├── ui/ - Components UI cơ bản (button, input, dialog...)
│   ├── student-crud/ - Components quản lý học sinh
│   │   ├── add-student-dialog.tsx
│   │   ├── edit-student-dialog.tsx
│   │   ├── view-student-dialog.tsx
│   │   ├── delete-student-dialog.tsx
│   │   ├── student-actions.tsx
│   │   └── types.ts
│   ├── enhanced-student-table.tsx - Bảng hiển thị dữ liệu học sinh
│   └── auth-provider.tsx - Provider xác thực
├── lib/
│   ├── api.ts - Client tương tác với API
│   ├── auth.ts - Hàm xử lý xác thực
│   └── types.ts - Type definitions
```

#### 1.3.2. Cấu trúc Backend
```
├── config/
│   ├── SecurityConfig.java - Cấu hình Spring Security
│   ├── JwtConfig.java - Cấu hình JWT
│   └── CorsConfig.java - Cấu hình CORS
├── controller/
│   ├── StudentController.java - REST endpoint cho Student
│   ├── ClassController.java - REST endpoint cho Class
│   └── PaymentController.java - REST endpoint cho Payment
├── model/
│   ├── Student.java - Entity học sinh
│   ├── Class.java - Entity lớp học
│   ├── StudentClass.java - Entity quan hệ giữa học sinh và lớp
│   ├── Payment.java - Entity thanh toán
│   └── TuitionPlan.java - Entity kế hoạch học phí
├── repository/
│   ├── StudentRepository.java - Data access cho Student
│   ├── ClassRepository.java - Data access cho Class
│   └── PaymentRepository.java - Data access cho Payment
├── service/
│   ├── StudentService.java - Business logic cho Student
│   ├── ClassService.java - Business logic cho Class
│   └── PaymentService.java - Business logic cho Payment
└── exception/
    └── GlobalExceptionHandler.java - Xử lý exception
```

## 2. QUẢN LÝ HỌC SINH (STUDENT MANAGEMENT)

### 2.1. Model dữ liệu học sinh

#### 2.1.1. Entity Backend
```java
@Entity
@Data
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String school;

    @Column(nullable = false)
    private String grade;

    @Column(name = "phone_student")
    private String phoneStudent;

    @Column(name = "phone_parent")
    private String phoneParent;

    @Column(name = "facebook_link")
    private String facebookLink;

    private String note;

    @Column(name = "created_at")
    private LocalDate createdAt;

    // Relationships
    @OneToMany(mappedBy = "student")
    @JsonIgnore
    private List<StudentClass> studentClasses;

    @OneToMany(mappedBy = "student")
    @JsonIgnore
    private List<Payment> payments;

    // Transient fields - không lưu vào database
    @Transient
    private double balance;

    @Transient
    private int balanceMonths;

    @Transient
    private String teacher;

    @Transient
    private String classTime;

    @Transient
    private String status;

    @Transient
    private List<String> subjects;
}
```

#### 2.1.2. TypeScript Types và Validation
```typescript
// Types.ts
export type StudentStatus = "no class" | "present" | "absent" | "late"

export type Student = {
  id: string | number
  name: string
  phoneStudent: string
  phoneParent: string
  facebookLink: string
  school: string
  subjects: string[]
  grade: string  // Thêm grade bắt buộc
  teacher: string
  classTime: string
  status: StudentStatus
  note: string
  dateOfBirth: string
  gender: "male" | "female"
  balance: number
  balanceMonths: number
  enrollDate?: string
}

export type StudentFormValues = {
  name: string
  phoneStudent: string
  phoneParent: string
  facebookLink: string
  school: string
  grade: string  // Thêm grade bắt buộc
  note: string
  dateOfBirth: string
  gender: "male" | "female"
  enrollDate: string
}

// Validation Schema
export const studentFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên học sinh"),
  phoneStudent: z.string().min(1, "Vui lòng nhập số điện thoại học sinh"),
  phoneParent: z.string().min(1, "Vui lòng nhập số điện thoại phụ huynh"),
  facebookLink: z.string().default(""),
  school: z.string().min(1, "Vui lòng nhập trường đang học"),
  grade: z.string().min(1, "Vui lòng nhập khối lớp"),  // Validation cho grade
  note: z.string().default(""),
  dateOfBirth: z.string().min(1, "Vui lòng nhập ngày sinh"),
  gender: z.enum(["male", "female"] as const),
  enrollDate: z.string().optional()
})
```

### 2.2. Component CRUD Học sinh

#### 2.2.1. Thêm học sinh mới (AddStudentDialog)
```typescript
export function AddStudentDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as any,
    defaultValues: {
      name: "",
      dateOfBirth: new Date().toISOString().split('T')[0], // Khởi tạo với ngày hiện tại
      gender: "male",
      school: "",
      grade: "", // Thêm grade với giá trị mặc định
      phoneStudent: "",
      phoneParent: "",
      facebookLink: "",
      note: ""
    },
  })

  const onSubmit: SubmitHandler<StudentFormValues> = async (values) => {
    try {
      setIsSubmitting(true)
      
      const result = await createStudent(values)
      
      toast({
        title: "Thành công",
        description: "Đã thêm học sinh mới",
      })
      setOpen(false)
      form.reset()
      
      // Gọi callback để cập nhật danh sách
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể thêm học sinh. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // JSX Form hiển thị
}
```

#### 2.2.2. Cập nhật thông tin học sinh (EditStudentDialog)
```typescript
export function EditStudentDialog({ 
  student, 
  onSuccess 
}: { 
  student: Student, 
  onSuccess?: () => void 
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Phương thức lấy giá trị mặc định cho form từ thông tin học sinh hiện tại
  const getDefaultValues = (student: Student): StudentFormValues => {
    return {
      name: student.name || "",
      dateOfBirth: student.dateOfBirth || new Date().toISOString().split('T')[0],
      gender: student.gender || "male",
      school: student.school || "",
      grade: student.grade || "",  // Lấy giá trị grade
      phoneStudent: student.phoneStudent || "",
      phoneParent: student.phoneParent || "",
      facebookLink: student.facebookLink || "",
      note: student.note || "",
      enrollDate: student.enrollDate || new Date().toISOString().split('T')[0]
    }
  }

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as any,
    defaultValues: getDefaultValues(student)
  })

  const onSubmit: SubmitHandler<StudentFormValues> = async (values) => {
    try {
      setIsSubmitting(true)
      const result = await updateStudent(String(student.id), values)
      
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin học sinh đã được cập nhật."
      })
      
      setOpen(false)
      
      // Gọi callback để cập nhật danh sách
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi khi cập nhật",
        description: error?.message || "Không thể cập nhật thông tin học sinh. Vui lòng thử lại sau."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // JSX Form hiển thị
}
```

#### 2.2.3. Xóa học sinh (DeleteStudentDialog)
```typescript
export function DeleteStudentDialog({ 
  student, 
  onSuccess 
}: { 
  student: Student, 
  onSuccess?: () => void 
}) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteStudent(String(student.id))
      toast({
        title: "Đã xóa học sinh",
        description: "Thông tin học sinh đã được xóa thành công."
      })
      setOpen(false)
      
      // Gọi callback để cập nhật danh sách
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi khi xóa",
        description: error?.message || "Không thể xóa học sinh. Vui lòng thử lại sau."
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // JSX Dialog hiển thị
}
```

### 2.3. Bảng hiển thị học sinh (EnhancedStudentTable)

```typescript
export function EnhancedStudentTable({ 
  setRefreshFunction 
}: { 
  setRefreshFunction?: (refreshFn: () => void) => void 
}) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    name: true,
    createdAt: true,
    phoneStudent: true,
    phoneParent: true,
    facebookLink: true,
    note: true,
    school: true,
    subjects: true,
    grade: true,
    teacher: true,
    classTime: true,
    status: true,
    balance: true,
    balanceMonths: true,
    actions: true
  })
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Hàm để lấy danh sách học sinh từ API
  const fetchStudents = async () => {
    try {
      setLoading(true)
      const accessToken = Cookies.get('accessToken')
      if (!accessToken) {
        router.push('/login')
        return
      }

      const response = await axios.get('http://localhost:8080/api/students', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      setStudents(response.data)
      setError(null)
    } catch (error: any) {
      console.error('Error fetching students:', error)
      if (error.response?.status === 403) {
        router.push('/login')
        return
      }
      setError('Không thể tải dữ liệu học sinh. Đang sử dụng dữ liệu mẫu.')
      setStudents(fallbackData) // Sử dụng dữ liệu mẫu khi API lỗi
    } finally {
      setLoading(false)
    }
  }

  // Hàm làm mới danh sách học sinh (dùng để callback khi thêm, sửa, xóa)
  const refreshStudents = () => {
    fetchStudents()
    toast.success("Đã cập nhật danh sách học sinh", {
      icon: '✅'
    })
  }

  useEffect(() => {
    // Fetch data from API when component mounts
    fetchStudents()
    
    // Truyền hàm refreshStudents lên component cha thông qua setRefreshFunction
    if (setRefreshFunction) {
      setRefreshFunction(refreshStudents);
    }
  }, [router, setRefreshFunction])
  
  // Định nghĩa cột dữ liệu
  const columns: ColumnDef<Student>[] = [
    // ... columns definition
  ]
  
  // Tạo bảng dữ liệu với TanStack Table
  const table = useReactTable({
    data: students,
    columns,
    // ... table configuration
  })
  
  // JSX hiển thị bảng và các controls
  return (
    <div className="w-full">
      {/* Filter controls */}
      <div className="flex items-center justify-between py-4">
        {/* ... filter elements ... */}
        
        {/* Column visibility dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              <span>Cột hiển thị</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px]" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuCheckboxItem
              className="font-bold border-b pb-2 mb-1"
              checked={table.getAllColumns().every((col) => col.getIsVisible())}
              onCheckedChange={(value) => {
                table.getAllColumns().forEach((column) => {
                  if (column.getCanHide()) {
                    column.toggleVisibility(!!value);
                  }
                });
              }}
              onSelect={(e) => e.preventDefault()}
            >
              Hiển thị tất cả
            </DropdownMenuCheckboxItem>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      column.toggleVisibility(!!value);
                    }}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {/* Column display name */}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Table content */}
      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorComponent error={error} />
      ) : (
        <TableComponent table={table} columns={columns} />
      )}
      
      {/* Pagination controls */}
      <PaginationControls table={table} />
    </div>
  )
}
```

### 2.4. Trang Students (Client Component)

```typescript
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
```

## 3. QUẢN LÝ HỌC PHÍ VÀ TÍNH TOÁN SỐ DƯ

### 3.1. Model dữ liệu

#### 3.1.1. Entity Payment
```java
@Entity
@Data
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    private String description;
}
```

#### 3.1.2. Entity TuitionPlan
```java
@Entity
@Data
@Table(name = "tuition_plans")
public class TuitionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private Class classEntity;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;
}
```

### 3.2. Cơ chế tính toán học phí và số dư

#### 3.2.1. Tính học phí hàng tháng
```java
/**
 * Tính tổng học phí hàng tháng của học sinh
 * Dựa trên các lớp học mà học sinh đang tham gia
 */
private double calculateMonthlyTuition(Student student) {
    List<StudentClass> studentClasses = studentClassRepository.findByStudent(student);
    double totalMonthlyTuition = 0.0;

    for (StudentClass studentClass : studentClasses) {
        Optional<TuitionPlan> tuitionPlanOpt = tuitionPlanRepository
            .findByClassEntityAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
                studentClass.getClassEntity(),
                getCurrentDateForTesting() // Use testing date instead of now()
            );
        
        if (tuitionPlanOpt.isPresent()) {
            totalMonthlyTuition += tuitionPlanOpt.get().getAmount().doubleValue();
        }
    }

    return totalMonthlyTuition;
}

// Helper method for testing - adjust current date
private LocalDate getCurrentDateForTesting() {
    // For testing: Add 2 months to the current date
    return LocalDate.now().plusMonths(2);
}
```

#### 3.2.2. Tính số tiền dư/nợ
```java
/**
 * Tính số tiền dư/nợ của học sinh
 * Balance = Tổng tiền đã đóng - Tổng tiền phải đóng
 */
private double calculateBalance(Student student) {
    double monthlyTuition = calculateMonthlyTuition(student);
    LocalDate enrollmentDate = student.getCreatedAt();
    
    // Kiểm tra nếu enrollmentDate là null, gán giá trị mặc định là ngày hiện tại
    if (enrollmentDate == null) {
        logger.warn("Student {} has null createdAt date, using current date instead", student.getId());
        enrollmentDate = LocalDate.now();
    }
    
    LocalDate currentDate = getCurrentDateForTesting(); // Use testing date instead of now()

    // Tính số tháng từ ngày nhập học đến hiện tại
    long months = ChronoUnit.MONTHS.between(enrollmentDate, currentDate);

    // Tính tổng số tiền phải đóng
    double totalAmount = monthlyTuition * months;

    // Lấy tổng số tiền đã đóng từ các payment
    double totalPaid = student.getPayments() != null ? 
        student.getPayments().stream()
            .mapToDouble(payment -> payment.getAmount().doubleValue())
            .sum() : 0.0;

    // Balance = Tổng đã đóng - Tổng phải đóng
    return totalPaid - totalAmount;
}
```

#### 3.2.3. Tính số tháng dư/nợ
```java
/**
 * Tính số tháng dư/nợ của học sinh
 * BalanceMonths = Balance / MonthlyTuition
 */
private int calculateBalanceMonths(Student student) {
    double balance = calculateBalance(student);
    double monthlyTuition = calculateMonthlyTuition(student);

    if (monthlyTuition == 0) {
        return 0;
    }

    // Số tháng dư/nợ = Balance / MonthlyTuition
    return (int) Math.round(balance / monthlyTuition);
}
```

## 4. XỬ LÝ LỖI VÀ LOGGING

### 4.1. Xử lý lỗi và logging trong Backend

#### 4.1.1. Xử lý lỗi trong StudentService
```java
/**
 * Creates a new student
 * @param student The student to create
 * @return The created student
 * @throws RuntimeException if there's an error creating the student
 */
public Student createStudent(Student student) {
    try {
        logger.info("Creating new student");
        
        // Đặt ngày tạo là ngày hiện tại nếu trường này null
        if (student.getCreatedAt() == null) {
            student.setCreatedAt(LocalDate.now());
        }
        
        Student savedStudent = studentRepository.save(student);
        logger.info("Successfully created student with ID: {}", savedStudent.getId());
        return savedStudent;
    } catch (Exception e) {
        logger.error("Error creating student: {}", e.getMessage());
        throw new RuntimeException("Error creating student: " + e.getMessage());
    }
}
```

#### 4.1.2. Xử lý Exception ở Controller
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Server Error",
            ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation Error",
            ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    // Nhiều exception handler khác...
}
```

### 4.2. Xử lý lỗi và logging trong Frontend

#### 4.2.1. Function logErrorDetails
```typescript
const logErrorDetails = (error: any) => {
  try {
    if (error && axios.isAxiosError(error)) {
      console.error("Axios Error Details:", {
        message: error?.message || 'Unknown error message',
        code: error?.code || 'Unknown error code',
        status: error?.response?.status || 'No status code',
        statusText: error?.response?.statusText || 'No status text',
        url: error?.config?.url || 'Unknown URL',
        method: error?.config?.method || 'Unknown method',
        requestData: error?.config?.data ? JSON.stringify(error.config.data).substring(0, 200) : 'No request data',
        responseData: error?.response?.data ? JSON.stringify(error.response.data).substring(0, 200) : 'No response data'
      })
    } else {
      console.error("Non-Axios Error:", error instanceof Error ? error.message : String(error || 'Unknown error'))
    }
  } catch (loggingError) {
    // Nếu có lỗi khi logging, ghi log một cách an toàn hơn
    console.error("Error while logging error details:", loggingError)
    console.error("Original error:", error?.message || String(error) || 'Unknown error')
  }
}
```

#### 4.2.2. Xử lý lỗi trong API call
```typescript
export const createStudent = async (studentData: StudentFormValues): Promise<Student> => {
  try {
    console.log("Creating student with data:", studentData)
    
    // Kiểm tra dữ liệu đầu vào
    if (!studentData) {
      throw new Error("Dữ liệu học sinh không hợp lệ")
    }
    
    // Đảm bảo cung cấp createdAt từ client
    if (!studentData.enrollDate) {
      studentData.enrollDate = new Date().toISOString().split('T')[0];
    }
    
    // Đổi tên field enrollDate thành createdAt để backend hiểu
    const requestData = {
      ...studentData,
      createdAt: studentData.enrollDate,
    };
    
    // Lấy token trực tiếp từ cookies
    const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
    if (!accessToken) {
      throw new Error("No access token")
    }

    // Log thông tin API call
    console.log(`Calling API: POST ${process.env.NEXT_PUBLIC_API_URL}/api/students`)
    
    // Gọi API trực tiếp với axios
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    console.log("Create student response:", response.data)
    return response.data
  } catch (error) {
    console.log("Error in createStudent:", error)
    
    logErrorDetails(error)
    
    // Báo lỗi thay vì sử dụng dữ liệu mẫu
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Không thể tạo học sinh: ${error.response.status} ${error.response.statusText}`)
      } else if (error.request) {
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
    throw new Error("Không thể tạo học sinh: " + (error instanceof Error ? error.message : String(error)))
  }
}
```

## 5. XÁC THỰC VÀ BẢO MẬT

### 5.1. Auth Provider và Token Management

#### 5.1.1. AuthProvider Component
```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    error: null,
  })

  // Function login
  const login = async (username: string, password: string): Promise<void> => {
    // ... implementation
  }

  // Function logout
  const logout = async (): Promise<void> => {
    // ... implementation
  }

  // Hàm kiểm tra xác thực
  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken")
      const storedRefreshToken = Cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || "refreshToken")
      
      console.log("Checking auth - Access token exists:", !!accessToken, "Refresh token exists:", !!storedRefreshToken)

      if (!accessToken) {
        if (!storedRefreshToken) {
          setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          })
          return false
        }

        // Nếu không có access token nhưng có refresh token, thử refresh
        const newAccessToken = await refreshToken()
        return !!newAccessToken
      }

      // Kiểm tra token hết hạn
      if (accessToken && isTokenExpired(accessToken)) {
        console.log("Access token expired, trying to refresh")
        // Thử refresh token
        const newAccessToken = await refreshToken()
        if (!newAccessToken) {
          setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          })
          return false
        }
        return true
      }

      // Token còn hạn, đọc thông tin người dùng từ token
      const user = decodeToken(accessToken)
      console.log("Token is valid, user:", user)
      
      if (!user) {
        console.warn("Could not decode user from token")
        setState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: "Token không hợp lệ",
        })
        return false
      }
      
      // Cập nhật state với thông tin người dùng từ token
      setState({
        user,
        accessToken,
        refreshToken: storedRefreshToken || null,
        isLoading: false,
        error: null,
      })
      return true
    } catch (error) {
      console.error("Auth check failed:", error)
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: "Không thể xác thực người dùng",
      })
      return false
    }
  }

  // Context value and Provider
  const contextValue = {
    ...state,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
```

#### 5.1.2. API Token Checking
```typescript
// Cập nhật checkToken để đơn giản hóa quá trình xác thực
export const checkToken = async () => {
  try {
    // Chỉ cần kiểm tra xem có token không, backend sẽ tự xác thực bằng JWT filter
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || "accessToken");
    if (!token) {
      throw new Error("No token found");
    }
    
    // Giả định token hợp lệ nếu tồn tại
    return true;
  } catch (error) {
    logErrorDetails(error);
    throw error;
  }
}
```

## 6. HƯỚNG DẪN SỬ DỤNG VÀ BẢO TRÌ

### 6.1. Cài đặt và Khởi chạy

#### 6.1.1. Backend
```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục backend
cd backend

# Build project
./mvnw clean install

#

## 6. HƯỚNG DẪN SỬ DỤNG VÀ BẢO TRÌ (tiếp)

### 6.1. Cài đặt và Khởi chạy (tiếp)

#### 6.1.1. Backend (tiếp)
```bash
# Chạy ứng dụng Spring Boot
./mvnw spring-boot:run

# Hoặc sử dụng phiên bản đã build
java -jar target/student-management-system.jar
```

#### 6.1.2. Frontend
```bash
# Di chuyển vào thư mục frontend
cd frontend/manage/student

# Cài đặt dependencies
npm install

# Chạy ở chế độ development
npm run dev

# Build cho production
npm run build

# Chạy phiên bản production
npm start
```

### 6.2. Cấu hình

#### 6.2.1. Cấu hình Backend
File `application.properties` hoặc `application.yml`:
```properties
# Server configuration
server.port=8080

# Database configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/student_management
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT configuration
jwt.secret=your-secret-key-should-be-at-least-256-bits
jwt.expiration=86400000  # 24 hours in milliseconds
jwt.refresh-expiration=604800000  # 7 days in milliseconds

# Logging
logging.level.root=INFO
logging.level.com.example.eduweb=DEBUG
logging.file.name=logs/application.log
```

#### 6.2.2. Cấu hình Frontend
File `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_AUTH_ENDPOINT=/api/auth
NEXT_PUBLIC_JWT_COOKIE_NAME=accessToken
NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME=refreshToken
```

### 6.3. Quy trình làm việc (Workflow)

#### 6.3.1. Quản lý học sinh
1. **Thêm học sinh mới**:
   - Nhấn nút "Thêm học sinh" trên trang Students
   - Điền thông tin vào form (các trường bắt buộc có dấu *)
   - Nhấn "Lưu" để thêm học sinh mới
   - Danh sách học sinh tự động cập nhật với học sinh vừa thêm

2. **Chỉnh sửa thông tin học sinh**:
   - Tìm học sinh cần chỉnh sửa trong bảng
   - Nhấn nút "Chỉnh sửa" (biểu tượng bút chì)
   - Thay đổi thông tin cần thiết trong form
   - Nhấn "Cập nhật" để lưu thay đổi

3. **Xem chi tiết học sinh**:
   - Tìm học sinh cần xem trong bảng
   - Nhấn nút "Xem" (biểu tượng mắt)
   - Dialog hiển thị đầy đủ thông tin học sinh

4. **Xóa học sinh**:
   - Tìm học sinh cần xóa trong bảng
   - Nhấn nút "Xóa" (biểu tượng thùng rác)
   - Xác nhận xóa trong dialog xác nhận
   - Học sinh sẽ bị xóa khỏi danh sách

5. **Lọc và tìm kiếm**:
   - Sử dụng ô tìm kiếm để lọc học sinh theo tên
   - Sử dụng các nút lọc nhanh để lọc theo trạng thái (Đang học/Nghỉ học/Tất cả)
   - Sử dụng dropdown "Cột hiển thị" để tùy chỉnh cột hiển thị trong bảng

#### 6.3.2. Quản lý học phí
1. **Xem thông tin học phí**:
   - Các cột "Số tiền dư/nợ" và "Số tháng dư/nợ" hiển thị thông tin tài chính
   - Số dương (màu xanh) thể hiện số dư, số âm (màu đỏ) thể hiện khoản nợ

2. **Thanh toán học phí**:
   - Truy cập chức năng thanh toán học phí từ menu
   - Chọn học sinh cần thanh toán
   - Nhập số tiền và thông tin thanh toán
   - Lưu thông tin thanh toán

### 6.4. Xử lý lỗi thường gặp (Troubleshooting)

#### 6.4.1. Lỗi Backend

| Lỗi | Nguyên nhân | Giải pháp |
|-----|------------|-----------|
| Không thể kết nối database | Thông tin kết nối sai hoặc database không hoạt động | Kiểm tra thông tin cấu hình database và trạng thái service |
| NullPointerException trong tính toán học phí | `createdAt` hoặc các thuộc tính khác là null | Kiểm tra dữ liệu đầu vào, thêm xử lý null safety |
| JWT expired | Token hết hạn | Cập nhật cơ chế refresh token, kiểm tra thời gian sống của token |
| Constraint violation | Vi phạm ràng buộc NOT NULL trong database | Đảm bảo tất cả trường bắt buộc đều được cung cấp từ client |

#### 6.4.2. Lỗi Frontend

| Lỗi | Nguyên nhân | Giải pháp |
|-----|------------|-----------|
| Authentication failed | Token không hợp lệ hoặc API check token lỗi | Kiểm tra cơ chế xác thực, bypass API check trong môi trường dev |
| Không thể tải danh sách học sinh | Lỗi kết nối API hoặc token hết hạn | Kiểm tra network, cung cấp dữ liệu fallback khi API lỗi |
| Dropdown menu tự đóng khi chọn | Sự kiện click lan truyền | Thêm `e.preventDefault()` và `e.stopPropagation()` |
| React controlled/uncontrolled component | Input chuyển từ giá trị undefined sang có giá trị | Luôn cung cấp giá trị mặc định (chuỗi rỗng, null, hoặc giá trị có ý nghĩa) |
| Input date không hoạt động | Giá trị không đúng định dạng | Sử dụng định dạng "yyyy-MM-dd" cho input type date |

### 6.5. Bảo trì và Nâng cấp

#### 6.5.1. Bảo trì định kỳ
1. **Database:**
   - Sao lưu database định kỳ
   - Kiểm tra và tối ưu performance
   - Cập nhật indexes khi cần thiết

2. **Backend:**
   - Cập nhật dependencies để đảm bảo bảo mật
   - Kiểm tra và xử lý log errors
   - Đánh giá hiệu suất API

3. **Frontend:**
   - Cập nhật thư viện React và các dependencies
   - Tối ưu bundle size
   - Cải thiện trải nghiệm người dùng

#### 6.5.2. Roadmap phát triển

1. **Giai đoạn ngắn hạn (1-3 tháng):**
   - Thêm tính năng export dữ liệu (Excel, PDF)
   - Dashboard thống kê và báo cáo
   - Cải thiện UI/UX cho mobile

2. **Giai đoạn trung hạn (3-6 tháng):**
   - Hệ thống thông báo (email, SMS)
   - Tích hợp hệ thống đánh giá học sinh
   - Công cụ lên lịch học tự động

3. **Giai đoạn dài hạn (6-12 tháng):**
   - Ứng dụng mobile cho phụ huynh và học sinh
   - Hệ thống học trực tuyến tích hợp
   - API mở để tích hợp với các hệ thống khác

## 7. KIẾN TRÚC DATABASE

### 7.1. Sơ đồ Entity-Relationship (ER)

```
+----------------+       +----------------+       +----------------+
|    Student     |       | StudentClass   |       |     Class      |
+----------------+       +----------------+       +----------------+
| id             |<----->| id             |<----->| id             |
| name           |       | student_id     |       | name           |
| dateOfBirth    |       | class_id       |       | subject        |
| gender         |       | join_date      |       | description    |
| school         |       | status         |       | status         |
| grade          |       +----------------+       | teacher        |
| phoneStudent   |                                | max_students   |
| phoneParent    |                                +----------------+
| facebookLink   |                                        ^
| note           |                                        |
| createdAt      |                                        |
+----------------+                                        |
       ^                                                  |
       |                                                  |
       |                                                  |
       |              +----------------+                  |
       |              |    Payment     |                  |
       +------------->+----------------+                  |
                      | id             |                  |
                      | student_id     |                  |
                      | amount         |                  |
                      | payment_date   |                  |
                      | payment_method |                  |
                      | description    |                  |
                      +----------------+                  |
                                                         |
                      +----------------+                  |
                      |  TuitionPlan   |                  |
                      +----------------+                  |
                      | id             |                  |
                      | class_id       |------------------+
                      | amount         |
                      | effective_date |
                      +----------------+
```

### 7.2. Các quan hệ chính

1. **Student - StudentClass**: One-to-Many
   - Một học sinh có thể tham gia nhiều lớp học
   - Bảng StudentClass là bảng trung gian

2. **Class - StudentClass**: One-to-Many
   - Một lớp học có thể có nhiều học sinh
   - Bảng StudentClass theo dõi mối quan hệ này

3. **Student - Payment**: One-to-Many
   - Một học sinh có thể có nhiều lần thanh toán
   - Mỗi Payment liên kết với một Student

4. **Class - TuitionPlan**: One-to-Many
   - Một lớp học có thể có nhiều kế hoạch học phí theo thời gian
   - TuitionPlan lưu mức học phí và ngày hiệu lực

### 7.3. Các trường quan trọng

1. **Student.createdAt**: Ngày học sinh nhập học, dùng để tính toán học phí
2. **Payment.amount**: Số tiền thanh toán
3. **TuitionPlan.amount**: Học phí hàng tháng cho một lớp
4. **TuitionPlan.effectiveDate**: Ngày áp dụng mức học phí

## 8. CODING BEST PRACTICES

### 8.1. Backend

1. **Sử dụng DTO (Data Transfer Objects)**:
   ```java
   public class StudentDTO {
       private String name;
       private String dateOfBirth;
       private String gender;
       // Các trường khác...
   }
   ```

2. **Tách biệt business logic khỏi controllers**:
   ```java
   // Controller chỉ xử lý request/response
   @RestController
   @RequestMapping("/api/students")
   public class StudentController {
       @Autowired
       private StudentService studentService;
       
       @GetMapping
       public ResponseEntity<List<Student>> getAllStudents() {
           return ResponseEntity.ok(studentService.getAllStudents());
       }
   }
   
   // Service chứa business logic
   @Service
   public class StudentService {
       // Business logic ở đây
   }
   ```

3. **Sử dụng logging thay vì System.out**:
   ```java
   private static final Logger logger = LoggerFactory.getLogger(StudentService.class);
   
   // Sử dụng
   logger.info("Processing request for student ID: {}", id);
   ```

### 8.2. Frontend

1. **Tách biệt logic và UI**:
   ```typescript
   // Custom hook chứa logic
   function useStudentForm(student?: Student) {
     const [isSubmitting, setIsSubmitting] = useState(false);
     // Logic xử lý form
     
     return { form, isSubmitting, onSubmit };
   }
   
   // Component UI
   function StudentForm({ student }: { student?: Student }) {
     const { form, isSubmitting, onSubmit } = useStudentForm(student);
     
     // JSX rendering
   }
   ```

2. **Sử dụng TypeScript một cách nghiêm ngặt**:
   ```typescript
   // Định nghĩa đầy đủ type
   type Student = {
     id: string | number;
     name: string;
     // Các trường khác...
   }
   
   // Sử dụng với generics
   const [students, setStudents] = useState<Student[]>([]);
   ```

3. **Sử dụng constants thay vì hard-coded values**:
   ```typescript
   // Tệp constants.ts
   export const API_ENDPOINTS = {
     STUDENTS: '/api/students',
     CLASSES: '/api/classes',
     // Các endpoint khác...
   }
   
   // Sử dụng
   const response = await axios.get(API_ENDPOINTS.STUDENTS);
   ```

## 9. FREQUENTLY ASKED QUESTIONS (FAQ)

### 9.1. Quản lý học sinh

**Q: Làm thế nào để thêm học sinh vào một lớp học?**  
A: Sau khi thêm học sinh, bạn có thể sử dụng chức năng "Gán lớp" từ trang quản lý lớp học hoặc từ trang chi tiết học sinh.

**Q: Có thể thay đổi ngày nhập học của học sinh không?**  
A: Có, bạn có thể chỉnh sửa ngày nhập học thông qua form chỉnh sửa thông tin học sinh.

**Q: Làm thế nào để đánh dấu học sinh đã nghỉ học?**  
A: Trong form chỉnh sửa thông tin học sinh, thay đổi trạng thái thành "Nghỉ học".

### 9.2. Quản lý học phí

**Q: Làm thế nào để tính toán học phí tổng hợp cho học sinh học nhiều môn?**  
A: Hệ thống tự động tính tổng học phí dựa trên các lớp học sinh đang tham gia và mức học phí tương ứng của mỗi lớp.

**Q: Nếu học sinh đóng nhiều tháng một lúc thì làm thế nào để ghi nhận?**  
A: Bạn chỉ cần nhập tổng số tiền học sinh đóng, hệ thống sẽ tự động tính ra số tháng tương ứng.

**Q: Làm thế nào để điều chỉnh học phí của một lớp?**  
A: Truy cập trang quản lý lớp học, chọn lớp cần điều chỉnh, và thêm một kế hoạch học phí mới với mức học phí mới và ngày hiệu lực.

### 9.3. Kỹ thuật

**Q: Hệ thống yêu cầu cấu hình phần cứng như thế nào?**  
A: Yêu cầu tối thiểu:
   - Backend: 2GB RAM, 2 CPU cores
   - Database: 4GB RAM, 2 CPU cores
   - Frontend: Bất kỳ máy chủ web hiện đại nào

**Q: Làm thế nào để sao lưu dữ liệu?**  
A: Bạn có thể sao lưu database PostgreSQL sử dụng lệnh `pg_dump`, và sao lưu cấu hình bằng cách lưu các file application.properties/yml.

**Q: Hệ thống có hỗ trợ đa ngôn ngữ không?**  
A: Hiện tại hệ thống hỗ trợ tiếng Việt. Để thêm ngôn ngữ mới, bạn cần thêm các file translation trong thư mục `/public/locales/`.

## 10. KẾT LUẬN

Hệ thống Quản lý Học sinh đã được thiết kế và phát triển với mục tiêu cung cấp công cụ toàn diện cho việc quản lý học sinh, lớp học và học phí trong môi trường giáo dục. Hệ thống liên tục được cải tiến để đáp ứng các yêu cầu ngày càng cao của người dùng.

Tài liệu này sẽ được cập nhật thường xuyên khi có các tính năng mới hoặc thay đổi trong hệ thống. Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng liên hệ với đội phát triển.

---

*Tài liệu này được cập nhật lần cuối: Tháng 4, 2023*
