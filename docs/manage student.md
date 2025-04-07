Tôi sẽ tạo một tài liệu chi tiết về những thay đổi và tính năng đã được thực hiện:

# Tài liệu Hệ thống Quản lý Học sinh

## 1. Cấu trúc Authentication & Authorization

### 1.1. Middleware (middleware.ts)
- **Mục đích**: Xử lý xác thực và phân quyền ở tầng middleware của Next.js
- **Các tính năng chính**:
  - Định nghĩa các route công khai (public) và API không cần xác thực
  - Kiểm tra token trong cookie (accessToken và refreshToken)
  - Xử lý redirect loop bằng cách kiểm tra referer header
  - Tối ưu debug log để giảm thông tin không cần thiết trong terminal

### 1.2. Protected Route Component
- **Mục đích**: Bảo vệ các route yêu cầu đăng nhập
- **Cải tiến**:
  - Sửa lỗi infinite loop trong useEffect
  - Thêm kiểm tra trạng thái xác thực trước khi gọi checkAuth
  - Tối ưu việc redirect để tránh vòng lặp

## 2. Bảng Quản lý Học sinh (EnhancedStudentTable)

### 2.1. Cấu trúc Dữ liệu
```typescript
type Student = {
  id: string
  name: string
  phone: string
  parentPhone: string
  facebook: string
  school: string
  subjects: string[]
  grade: string
  teacher: string
  classTime: string
  status: "active" | "inactive"
  notes: string
  avatar: string
  enrollmentDate: string
  balance: number
  balanceMonths: number
}
```

### 2.2. Tính năng Chính
1. **Quản lý State**:
   ```typescript
   const [sorting, setSorting] = useState<SortingState>([])
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = useState({})
   const [students, setStudents] = useState<Student[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   ```

2. **Xử lý API**:
   - Tích hợp với backend thông qua axios
   - Xử lý authentication với token
   - Xử lý lỗi và fallback data
   ```typescript
   const fetchStudents = async () => {
     try {
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
       // ...
     } catch (error) {
       // Xử lý lỗi và fallback
     }
   }
   ```

### 2.3. Tính năng Bảng Dữ liệu
1. **Cột và Định dạng**:
   - Hiển thị avatar và thông tin học sinh
   - Định dạng tiền tệ (VND)
   - Badge cho trạng thái và môn học
   - Truncate cho nội dung dài (ghi chú)

2. **Tính năng Tương tác**:
   - Sắp xếp theo cột
   - Lọc theo tên học sinh
   - Lọc nhanh theo trạng thái (Đang học/Đã nghỉ)
   - Tùy chỉnh hiển thị cột
   - Phân trang

3. **UI/UX**:
   - Loading state với spinner
   - Error state với thông báo
   - Empty state khi không có dữ liệu
   - Responsive design
   - Màu sắc theo ngữ cảnh (xanh cho số dương, đỏ cho số âm)

### 2.4. Xử lý Lỗi và Fallback
1. **Dữ liệu Fallback**:
   - Dữ liệu mẫu được định nghĩa sẵn
   - Tự động sử dụng khi API lỗi
   - Duy trì trải nghiệm người dùng khi có sự cố

2. **Xử lý Lỗi**:
   - Xử lý lỗi 403 (Forbidden)
   - Redirect về trang login khi token không hợp lệ
   - Hiển thị thông báo lỗi thân thiện với người dùng

## 3. Hướng dẫn Sử dụng

### 3.1. Cài đặt Dependencies
```bash
npm install js-cookie @types/js-cookie
npm install axios
npm install @tanstack/react-table
```

### 3.2. Khởi động Hệ thống
1. **Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend/manage/student
   npm run dev
   ```

### 3.3. Cấu hình
1. **API Endpoint**: `http://localhost:8080/api/students`
2. **Authentication**: Bearer token trong cookie
3. **CORS**: Cần cấu hình backend cho phép request từ frontend

## 4. Bảo mật
1. **Token Management**:
   - Lưu trữ token trong cookie
   - Tự động redirect khi token hết hạn
   - Xử lý refresh token (nếu có)

2. **Error Handling**:
   - Không hiển thị thông tin nhạy cảm trong error message
   - Xử lý graceful degradation với fallback data

## 5. Performance
1. **Tối ưu Render**:
   - Sử dụng memo cho components phức tạp
   - Lazy loading cho dữ liệu lớn
   - Phân trang để giảm tải dữ liệu

2. **State Management**:
   - Local state cho UI components
   - Cached data để giảm số lượng API calls
