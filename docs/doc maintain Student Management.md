Tôi sẽ tạo một tài liệu chi tiết về hệ thống Student Management. Tôi sẽ chia thành nhiều phần để dễ theo dõi:

# Student Management System Documentation

## 1. Tổng quan hệ thống

### 1.1. Giới thiệu
Hệ thống Student Management là một ứng dụng web được thiết kế để quản lý học sinh, lớp học, và học phí cho các trung tâm giáo dục. Hệ thống được xây dựng với kiến trúc client-server, sử dụng các công nghệ hiện đại.

### 1.2. Công nghệ sử dụng
- **Frontend**: 
  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui components
  - React Hook Form + Zod validation
  - TanStack Table (React Table)
  - Axios

- **Backend**:
  - Spring Boot
  - Java 17
  - JPA/Hibernate
  - PostgreSQL
  - Spring Security + JWT

### 1.3. Kiến trúc hệ thống
```
├── Frontend (Next.js)
│   ├── app/
│   │   ├── (auth)/ - Authentication routes
│   │   └── (dashboard)/ - Protected routes
│   ├── components/
│   │   ├── ui/ - Reusable UI components
│   │   ├── student-crud/ - Student management
│   │   └── enhanced-student-table/ - Data table
│   └── lib/
│       ├── api.ts - API client
│       └── types.ts - TypeScript definitions
│
└── Backend (Spring Boot)
    ├── config/ - Configuration classes
    ├── controller/ - REST endpoints
    ├── model/ - Entity classes
    ├── repository/ - Data access
    └── service/ - Business logic
```

## 2. Chức năng chi tiết

### 2.1. Quản lý học sinh (Student Management)

#### 2.1.1. Model dữ liệu học sinh
```java
public class Student {
    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String gender;
    private String school;
    private String grade;
    private String phoneStudent;
    private String phoneParent;
    private String facebookLink;
    private String note;
    private LocalDate createdAt;
    
    // Transient fields
    private double balance;
    private int balanceMonths;
    private String teacher;
    private String classTime;
    private String status;
    private List<String> subjects;
}
```

#### 2.1.2. Các chức năng chính
1. **Thêm học sinh mới**
   - Validate thông tin đầu vào
   - Tự động tạo ngày nhập học
   - Cho phép chọn nhiều môn học
   - Gán giáo viên và ca học

2. **Chỉnh sửa thông tin học sinh**
   - Cập nhật thông tin cá nhân
   - Thay đổi môn học
   - Điều chỉnh lớp và giáo viên
   - Cập nhật trạng thái học sinh

3. **Xem chi tiết học sinh**
   - Hiển thị đầy đủ thông tin cá nhân
   - Hiển thị số dư/nợ học phí
   - Hiển thị danh sách môn học
   - Hiển thị lịch học và giáo viên

4. **Xóa học sinh**
   - Xác nhận trước khi xóa
   - Kiểm tra ràng buộc dữ liệu
   - Xóa các dữ liệu liên quan

### 2.2. Quản lý học phí (Tuition Management)

#### 2.2.1. Cấu trúc dữ liệu
```java
public class TuitionPlan {
    private Long id;
    private Class classEntity;
    private BigDecimal amount;
    private LocalDate effectiveDate;
}

public class Payment {
    private Long id;
    private Student student;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String description;
}
```

#### 2.2.2. Cơ chế tính toán học phí
1. **Tính học phí hàng tháng**
```java
private double calculateMonthlyTuition(Student student) {
    List<StudentClass> studentClasses = studentClassRepository.findByStudent(student);
    double totalMonthlyTuition = 0.0;

    for (StudentClass studentClass : studentClasses) {
        Optional<TuitionPlan> tuitionPlanOpt = tuitionPlanRepository
            .findByClassEntityAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
                studentClass.getClassEntity(),
                getCurrentDateForTesting()
            );
        
        if (tuitionPlanOpt.isPresent()) {
            totalMonthlyTuition += tuitionPlanOpt.get().getAmount().doubleValue();
        }
    }

    return totalMonthlyTuition;
}
```

2. **Tính số tiền dư/nợ**
```java
private double calculateBalance(Student student) {
    double monthlyTuition = calculateMonthlyTuition(student);
    LocalDate enrollmentDate = student.getCreatedAt();
    LocalDate currentDate = getCurrentDateForTesting();

    // Tính số tháng từ ngày nhập học
    long months = ChronoUnit.MONTHS.between(enrollmentDate, currentDate);

    // Tổng tiền phải đóng
    double totalAmount = monthlyTuition * months;

    // Tổng tiền đã đóng
    double totalPaid = student.getPayments().stream()
            .mapToDouble(payment -> payment.getAmount().doubleValue())
            .sum();

    return totalPaid - totalAmount;
}
```

3. **Tính số tháng dư/nợ**
```java
private int calculateBalanceMonths(Student student) {
    double balance = calculateBalance(student);
    double monthlyTuition = calculateMonthlyTuition(student);
    return (int) Math.round(balance / monthlyTuition);
}
```

### 2.3. Giao diện người dùng (User Interface)

#### 2.3.1. Bảng dữ liệu học sinh (EnhancedStudentTable)
1. **Tính năng**
   - Sắp xếp theo cột
   - Lọc theo tên và trạng thái
   - Phân trang
   - Tùy chỉnh cột hiển thị
   - Hiển thị loading state
   - Xử lý lỗi và fallback data

2. **Cấu trúc component**
```typescript
export function EnhancedStudentTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [students, setStudents] = useState<Student[]>([])
    
    // Column definitions
    const columns: ColumnDef<Student>[] = [
        // Thông tin cơ bản
        {
            accessorKey: "name",
            header: "Học sinh",
            cell: ({ row }) => (...)
        },
        // Thông tin liên hệ
        {
            accessorKey: "phoneStudent",
            header: "SĐT học sinh"
        },
        // Thông tin học tập
        {
            accessorKey: "subjects",
            header: "Môn học",
            cell: ({ row }) => (...)
        },
        // Thông tin tài chính
        {
            accessorKey: "balance",
            header: "Số tiền dư/nợ",
            cell: ({ row }) => (...)
        }
    ]
}
```

#### 2.3.2. Form quản lý học sinh
1. **Validation Schema**
```typescript
export const studentFormSchema = z.object({
    name: z.string().min(1, "Vui lòng nhập tên học sinh"),
    phoneStudent: z.string().min(1, "Vui lòng nhập số điện thoại học sinh"),
    phoneParent: z.string().min(1, "Vui lòng nhập số điện thoại phụ huynh"),
    facebookLink: z.string().default(""),
    school: z.string().min(1, "Vui lòng nhập trường đang học"),
    subjects: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một môn học"),
    grade: z.string().min(1, "Vui lòng chọn khối lớp"),
    teacher: z.string().min(1, "Vui lòng chọn giáo viên"),
    classTime: z.string().min(1, "Vui lòng chọn ca học"),
    status: z.enum(["active", "inactive", "no class"]),
    note: z.string().default(""),
    dateOfBirth: z.string().min(1, "Vui lòng nhập ngày sinh"),
    gender: z.enum(["male", "female"])
})
```

2. **Form Components**
- `AddStudentDialog`: Form thêm học sinh mới
- `EditStudentDialog`: Form chỉnh sửa thông tin
- `ViewStudentDialog`: Dialog xem chi tiết
- `DeleteStudentDialog`: Dialog xác nhận xóa

### 2.4. API Endpoints

#### 2.4.1. Student API
```typescript
// GET /api/students
getAllStudents(): Promise<Student[]>

// GET /api/students/:id
getStudentById(id: string): Promise<Student>

// POST /api/students
createStudent(data: StudentFormValues): Promise<Student>

// PUT /api/students/:id
updateStudent(id: string, data: StudentFormValues): Promise<Student>

// DELETE /api/students/:id
deleteStudent(id: string): Promise<void>
```

#### 2.4.2. Payment API
```typescript
// GET /api/payments
getAllPayments(): Promise<Payment[]>

// POST /api/payments
createPayment(data: PaymentFormValues): Promise<Payment>
```

### 2.5. Bảo mật (Security)

#### 2.5.1. Authentication
1. **JWT Authentication**
```typescript
// Axios interceptor for adding token
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)
```

2. **Token Refresh**
```typescript
// Axios interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true
            try {
                const response = await refreshToken()
                // Retry original request with new token
                return apiClient(error.config)
            } catch (error) {
                // Redirect to login
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)
```

### 2.6. Testing và Debug

#### 2.6.1. Testing Helper Methods
```java
// Helper method for testing time-based calculations
private LocalDate getCurrentDateForTesting() {
    return LocalDate.now().plusMonths(2);
}
```

#### 2.6.2. Logging
```java
private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

// Example logging
try {
    logger.info("Fetching student with ID: {}", id);
    Student student = studentRepository.findById(id).orElse(null);
    // ...
} catch (Exception e) {
    logger.error("Error fetching student {}: {}", id, e.getMessage());
    throw new RuntimeException("Error fetching student: " + e.getMessage());
}
```

## 3. Hướng dẫn sử dụng

### 3.1. Cài đặt và Khởi chạy

1. **Backend**
```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục backend
cd backend

# Build project
./mvnw clean install

# Chạy ứng dụng
./mvnw spring-boot:run
```

2. **Frontend**
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### 3.2. Cấu hình

1. **Backend Configuration**
```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student_management
spring.datasource.username=postgres
spring.datasource.password=password

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000
```

2. **Frontend Configuration**
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_JWT_COOKIE_NAME=accessToken
NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME=refreshToken
```

## 4. Bảo trì và Nâng cấp

### 4.1. Các vấn đề cần lưu ý

1. **Performance**
   - Sử dụng caching cho dữ liệu ít thay đổi
   - Tối ưu hóa queries database
   - Lazy loading cho components

2. **Security**
   - Regular security audits
   - Update dependencies
   - Implement rate limiting
   - CORS configuration

3. **Scalability**
   - Implement database indexing
   - Consider implementing microservices
   - Add load balancing

### 4.2. Kế hoạch nâng cấp

1. **Short-term**
   - Thêm tính năng export dữ liệu
   - Cải thiện UI/UX
   - Thêm thống kê và báo cáo

2. **Long-term**
   - Tích hợp hệ thống thông báo
   - Mobile app
   - API integration với các hệ thống khác

## 5. Troubleshooting

### 5.1. Common Issues

1. **Authentication Issues**
   - Token expiration
   - CORS errors
   - Invalid credentials

2. **Performance Issues**
   - Slow loading times
   - Memory leaks
   - Database connection issues

### 5.2. Solutions

1. **Authentication**
   ```typescript
   // Check token expiration
   const isTokenExpired = (token: string): boolean => {
       try {
           const decoded = jwt_decode(token)
           return decoded.exp * 1000 < Date.now()
       } catch {
           return true
       }
   }
   ```

2. **Error Handling**
   ```typescript
   // API error handler
   const handleApiError = (error: any) => {
       if (error.response) {
           // Server responded with error
           console.error('Server Error:', error.response.data)
           toast.error(error.response.data.message)
       } else if (error.request) {
           // Request made but no response
           console.error('Network Error:', error.request)
           toast.error('Network error. Please try again.')
       } else {
           // Other errors
           console.error('Error:', error.message)
           toast.error('An unexpected error occurred.')
       }
   }
   ```

## 6. Best Practices

### 6.1. Code Organization

1. **Frontend**
   - Separate components by feature
   - Use custom hooks for shared logic
   - Implement proper TypeScript types

2. **Backend**
   - Follow SOLID principles
   - Use DTOs for data transfer
   - Implement proper exception handling

### 6.2. Performance Optimization

1. **Frontend**
   - Implement proper caching
   - Use React.memo for expensive components
   - Optimize bundle size

2. **Backend**
   - Use appropriate database indexes
   - Implement pagination
   - Cache frequently accessed data

Đây là tài liệu chi tiết về hệ thống Student Management. Tài liệu này sẽ giúp cho việc maintain và phát triển hệ thống trong tương lai dễ dàng hơn. Bạn có muốn tôi bổ sung thêm phần nào không?
