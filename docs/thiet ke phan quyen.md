Dựa vào tài liệu của bạn về Authentication Module, tôi sẽ lập kế hoạch phân quyền cho các vai trò: admin, giáo viên và staff.

# Kế hoạch phân quyền hệ thống

## 1. Phân tích yêu cầu

Từ yêu cầu của bạn, chúng ta cần phân quyền cho 3 vai trò chính:
- **Admin**: Toàn quyền truy cập hệ thống
- **Giáo viên**: Xem lịch và điểm danh
- **Staff**: Thu học phí, xem hỗ trợ, gửi tin nhắn, gọi cho học sinh

## 2. Mô hình phân quyền

Sẽ sử dụng mô hình phân quyền dựa trên vai trò (RBAC) như đã mô tả trong tài liệu. Chi tiết như sau:

```typescript
// Định nghĩa các vai trò
enum Role {
  ADMIN = "admin",
  TEACHER = "teacher",
  STAFF = "staff"
}

// Định nghĩa các quyền
enum Permission {
  // Quản lý người dùng
  VIEW_USERS = "view_users",
  CREATE_USER = "create_user",
  EDIT_USER = "edit_user",
  DELETE_USER = "delete_user",
  
  // Lịch
  VIEW_SCHEDULE = "view_schedule",
  EDIT_SCHEDULE = "edit_schedule",
  
  // Điểm danh
  VIEW_ATTENDANCE = "view_attendance",
  TAKE_ATTENDANCE = "take_attendance",
  
  // Học phí
  VIEW_FEES = "view_fees",
  COLLECT_FEES = "collect_fees",
  
  // Hỗ trợ
  VIEW_SUPPORT = "view_support",
  RESPOND_SUPPORT = "respond_support",
  
  // Tin nhắn
  VIEW_MESSAGES = "view_messages",
  SEND_MESSAGE = "send_message",
  
  // Gọi điện
  MAKE_CALLS = "make_calls",
  
  // Học sinh
  VIEW_STUDENTS = "view_students",
  CREATE_STUDENT = "create_student",
  EDIT_STUDENT = "edit_student",
  DELETE_STUDENT = "delete_student",
  
  // Báo cáo
  VIEW_REPORTS = "view_reports",
  GENERATE_REPORTS = "generate_reports"
}
```

## 3. Ma trận phân quyền

| Permission | Admin | Giáo viên | Staff |
|------------|-------|----------|-------|
| VIEW_USERS | ✅ | ❌ | ❌ |
| CREATE_USER | ✅ | ❌ | ❌ |
| EDIT_USER | ✅ | ❌ | ❌ |
| DELETE_USER | ✅ | ❌ | ❌ |
| VIEW_SCHEDULE | ✅ | ✅ | ❌ |
| EDIT_SCHEDULE | ✅ | ❌ | ❌ |
| VIEW_ATTENDANCE | ✅ | ✅ | ❌ |
| TAKE_ATTENDANCE | ✅ | ✅ | ❌ |
| VIEW_FEES | ✅ | ❌ | ✅ |
| COLLECT_FEES | ✅ | ❌ | ✅ |
| VIEW_SUPPORT | ✅ | ❌ | ✅ |
| RESPOND_SUPPORT | ✅ | ❌ | ✅ |
| VIEW_MESSAGES | ✅ | ❌ | ✅ |
| SEND_MESSAGE | ✅ | ❌ | ✅ |
| MAKE_CALLS | ✅ | ❌ | ✅ |
| VIEW_STUDENTS | ✅ | ✅ | ✅ |
| CREATE_STUDENT | ✅ | ❌ | ❌ |
| EDIT_STUDENT | ✅ | ❌ | ❌ |
| DELETE_STUDENT | ✅ | ❌ | ❌ |
| VIEW_REPORTS | ✅ | ✅ | ✅ |
| GENERATE_REPORTS | ✅ | ❌ | ❌ |

## 4. Triển khai backend

### 4.1. Cập nhật Entity User

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String password;
    private String name;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    private Set<Permission> permissions = new HashSet<>();
    
    // Getters và setters
}
```

### 4.2. Các luồng phân quyền

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Teacher endpoints
                .requestMatchers("/api/schedule/**").hasAnyRole("ADMIN", "TEACHER")
                .requestMatchers("/api/attendance/**").hasAnyRole("ADMIN", "TEACHER")
                
                // Staff endpoints
                .requestMatchers("/api/fees/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/support/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/messages/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/api/calls/**").hasAnyRole("ADMIN", "STAFF")
                
                // Common endpoints
                .requestMatchers("/api/students/view").authenticated()
                .requestMatchers("/api/students/**").hasRole("ADMIN")
                
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

### 4.3. Method-level Security

```java
// Controller phương thức với annotation phân quyền
@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STAFF')")
    public ResponseEntity<?> getAllStudents() {
        // Triển khai
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStudent(@RequestBody Student student) {
        // Triển khai
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student student) {
        // Triển khai
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        // Triển khai
    }
}
```

## 5. Triển khai frontend

### 5.1. Cập nhật AuthContext

```typescript
interface User {
  id: string;
  username: string;
  role: string;
  permissions: string[];
  name?: string;
  [key: string]: any;
}

// Trong AuthContext
const hasPermission = (permission: string) => {
  if (!state.user) return false;
  return state.user.permissions.includes(permission);
};

// Export context với function mới
return {
  ...state,
  login,
  logout,
  checkAuth,
  refreshToken,
  hasPermission,  // Function mới để kiểm tra quyền
};
```

### 5.2. Bảo vệ route với quyền cụ thể

```typescript
// ProtectedRoute với check quyền
export function ProtectedRoute({ 
  children, 
  requiredRoles,
  requiredPermissions 
}: ProtectedRouteProps) {
  const { user, hasPermission } = useAuth();
  
  const hasRequiredRole = () => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };
  
  const hasRequiredPermission = () => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.every(perm => hasPermission(perm));
  };
  
  if (!hasRequiredRole() || !hasRequiredPermission()) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
}
```

### 5.3. Conditionally Rendering UI Elements

```tsx
// Trong component UI
import { useAuth } from "@/lib/auth";

export function FeesButton() {
  const { hasPermission } = useAuth();
  
  if (!hasPermission("COLLECT_FEES")) {
    return null;
  }
  
  return (
    <Button 
      onClick={handleFeeCollection}
      className="bg-green-500 hover:bg-green-600"
    >
      Thu học phí
    </Button>
  );
}
```

### 5.4. Setup menu dựa trên vai trò

```tsx
// Trong app-sidebar.tsx
const { user } = useAuth();

const menuItems = [
  // Tất cả vai trò có thể xem
  { 
    label: "Dashboard", 
    icon: <Home className="h-5 w-5" />, 
    href: "/dashboard" 
  },
  
  // Menu cho Admin
  ...(user?.role === "admin" ? [
    { 
      label: "Quản lý người dùng", 
      icon: <Users className="h-5 w-5" />, 
      href: "/users" 
    },
    // Các menu admin khác
  ] : []),
  
  // Menu cho Giáo viên
  ...(user?.role === "teacher" ? [
    { 
      label: "Lịch dạy", 
      icon: <Calendar className="h-5 w-5" />, 
      href: "/schedule" 
    },
    { 
      label: "Điểm danh", 
      icon: <CheckSquare className="h-5 w-5" />, 
      href: "/attendance" 
    },
  ] : []),
  
  // Menu cho Staff
  ...(user?.role === "staff" ? [
    { 
      label: "Thu học phí", 
      icon: <DollarSign className="h-5 w-5" />, 
      href: "/fees" 
    },
    { 
      label: "Hỗ trợ", 
      icon: <HelpCircle className="h-5 w-5" />, 
      href: "/support" 
    },
    { 
      label: "Tin nhắn", 
      icon: <MessageSquare className="h-5 w-5" />, 
      href: "/messages" 
    },
    { 
      label: "Gọi điện", 
      icon: <Phone className="h-5 w-5" />, 
      href: "/calls" 
    },
  ] : []),
  
  // Menu chung cho tất cả
  { 
    label: "Danh sách học sinh", 
    icon: <GraduationCap className="h-5 w-5" />, 
    href: "/students" 
  },
];
```

## 6. Cập nhật routes và middleware

### 6.1. Cập nhật middleware.ts để kiểm tra quyền

```typescript
// Trong middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";

const PUBLIC_ROUTES = ['/login', '/forgot-password'];
const ROLE_BASED_ROUTES = {
  '/users': ['admin'],
  '/schedule': ['admin', 'teacher'],
  '/attendance': ['admin', 'teacher'],
  '/fees': ['admin', 'staff'],
  '/support': ['admin', 'staff'],
  '/messages': ['admin', 'staff'],
  '/calls': ['admin', 'staff'],
  // Các routes khác
};

export default function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'accessToken')?.value;
  const { pathname } = request.nextUrl;
  
  // Cho phép routes công khai
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Kiểm tra token
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Giải mã token để lấy role
    const decodedToken = jwtDecode<{ role: string }>(accessToken);
    const userRole = decodedToken.role;
    
    // Kiểm tra quyền truy cập route
    for (const [route, roles] of Object.entries(ROLE_BASED_ROUTES)) {
      if (pathname.startsWith(route) && !roles.includes(userRole)) {
        return NextResponse.redirect(new URL('/access-denied', request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 7. Cập nhật API endpoints

### 7.1. Endpoints cho Giáo viên

```java
@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getSchedule() {
        // Lấy lịch dạy
    }
}

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> getAttendance() {
        // Lấy thông tin điểm danh
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceRequest request) {
        // Đánh dấu điểm danh
    }
}
```

### 7.2. Endpoints cho Staff

```java
@RestController
@RequestMapping("/api/fees")
public class FeesController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getFeesInfo() {
        // Lấy thông tin học phí
    }
    
    @PostMapping("/collect")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> collectFees(@RequestBody FeeCollectionRequest request) {
        // Thu học phí
    }
}

@RestController
@RequestMapping("/api/support")
public class SupportController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getSupportRequests() {
        // Lấy thông tin hỗ trợ
    }
}

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getMessages() {
        // Lấy tin nhắn
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        // Gửi tin nhắn
    }
}

@RestController
@RequestMapping("/api/calls")
public class CallController {
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> makeCall(@RequestBody CallRequest request) {
        // Thực hiện cuộc gọi
    }
}
```

## 8. Testing plan

### 8.1. Kiểm thử các quyền admin

1. Đăng nhập với tài khoản admin
2. Kiểm tra truy cập tất cả các chức năng hệ thống
3. Kiểm tra chức năng quản lý người dùng
4. Kiểm tra tất cả các chức năng giảng viên và staff

### 8.2. Kiểm thử các quyền giáo viên

1. Đăng nhập với tài khoản giáo viên
2. Kiểm tra xem lịch giảng dạy
3. Kiểm tra chức năng điểm danh
4. Kiểm tra không có quyền truy cập vào các chức năng của staff
5. Kiểm tra không có quyền quản lý người dùng

### 8.3. Kiểm thử các quyền staff

1. Đăng nhập với tài khoản staff
2. Kiểm tra chức năng thu học phí
3. Kiểm tra chức năng xem hỗ trợ
4. Kiểm tra chức năng gửi tin nhắn
5. Kiểm tra chức năng gọi điện
6. Kiểm tra không có quyền truy cập vào các chức năng của giáo viên
7. Kiểm tra không có quyền quản lý người dùng

## 9. Lịch trình triển khai

1. **Tuần 1**: Cập nhật database schema và entity User
2. **Tuần 2**: Triển khai backend security + API endpoints
3. **Tuần 3**: Triển khai frontend với AuthContext mới
4. **Tuần 4**: Thiết lập UI dựa trên vai trò và quyền
5. **Tuần 5**: Testing và sửa lỗi

Bạn có muốn tôi đào sâu hơn vào bất kỳ phần nào trong kế hoạch này không?