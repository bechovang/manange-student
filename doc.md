Thought for 4 seconds### Tài liệu Bảo trì Hệ thống Quản lý Học sinh Trung tâm Ánh Bình Minh

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Cấu trúc dự án](#2-cấu-trúc-dự-án)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Quy trình phát triển](#4-quy-trình-phát-triển)
5. [Hướng dẫn bảo trì từng module](#5-hướng-dẫn-bảo-trì-từng-module)
6. [Quản lý dữ liệu](#6-quản-lý-dữ-liệu)
7. [Xử lý lỗi và gỡ lỗi](#7-xử-lý-lỗi-và-gỡ-lỗi)
8. [Tối ưu hóa hiệu suất](#8-tối-ưu-hóa-hiệu-suất)
9. [Bảo mật](#9-bảo-mật)
10. [Quy trình triển khai](#10-quy-trình-triển-khai)
11. [Quy trình cập nhật và nâng cấp](#11-quy-trình-cập-nhật-và-nâng-cấp)
12. [Vấn đề thường gặp và giải pháp](#12-vấn-đề-thường-gặp-và-giải-pháp)
13. [Tài liệu tham khảo](#13-tài-liệu-tham-khảo)
14. [Liên hệ hỗ trợ](#14-liên-hệ-hỗ-trợ)


## 1. Giới thiệu

### 1.1 Tổng quan hệ thống

Hệ thống Quản lý Học sinh Trung tâm Ánh Bình Minh là một ứng dụng web được phát triển bằng Next.js, React và TypeScript. Hệ thống này giúp quản lý thông tin học sinh, lớp học, điểm danh, học phí và thông báo cho phụ huynh.

### 1.2 Mục tiêu của tài liệu

Tài liệu này nhằm cung cấp hướng dẫn chi tiết cho việc bảo trì, nâng cấp và mở rộng hệ thống. Nó được thiết kế cho cả nhà phát triển hiện tại và tương lai, giúp họ hiểu rõ cấu trúc, quy trình và các thực hành tốt nhất khi làm việc với codebase.

### 1.3 Công nghệ sử dụng

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Form Handling**: React Hook Form, Zod
- **State Management**: React Context API, React Hooks
- **Data Fetching**: Custom hooks, Fetch API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React


## 2. Cấu trúc dự án

### 2.1 Cấu trúc thư mục

```plaintext
student-management/
├── app/                  # Các trang và route của ứng dụng (Next.js App Router)
│   ├── (dashboard)/      # Layout dành cho các trang dashboard
│   │   ├── dashboard/    # Trang dashboard chính
│   │   ├── students/     # Trang quản lý học sinh
│   │   ├── classes/      # Trang quản lý lớp học
│   │   ├── attendance/   # Trang điểm danh
│   │   ├── payments/     # Trang ghi nhận thanh toán
│   │   ├── tuition/      # Trang quản lý học phí
│   │   ├── schedule/     # Trang lịch học
│   │   ├── notifications/# Trang thông báo Zalo
│   │   ├── settings/     # Trang cài đặt
│   │   └── layout.tsx    # Layout cho các trang dashboard
│   ├── login/            # Trang đăng nhập
│   ├── globals.css       # CSS toàn cục
│   └── layout.tsx        # Layout chính của ứng dụng
├── components/           # Các component React sử dụng trong ứng dụng
│   ├── ui/               # Các component UI cơ bản (từ shadcn/ui)
│   ├── app-sidebar.tsx   # Sidebar chính của ứng dụng
│   ├── header.tsx        # Header chính của ứng dụng
│   ├── login-form.tsx    # Form đăng nhập
│   ├── student-crud.tsx  # CRUD cho học sinh
│   ├── class-list.tsx    # Danh sách lớp học
│   ├── attendance-table.tsx # Bảng điểm danh
│   ├── payment-form.tsx  # Form thanh toán
│   ├── calendar-schedule.tsx # Lịch học
│   └── ...               # Các component khác
├── lib/                  # Thư viện và tiện ích
│   ├── api.ts            # Module gọi API
│   ├── mockData.ts       # Dữ liệu mẫu (sẽ thay thế bằng API thực tế)
│   ├── types.ts          # Các kiểu TypeScript
│   ├── utils.ts          # Các hàm tiện ích
│   └── hooks/            # Custom React hooks
│       ├── use-api-query.ts # Hook để gọi API
│       └── use-mobile.ts # Hook để kiểm tra thiết bị di động
├── docs/                 # Tài liệu
│   └── maintenance-guide.md # Hướng dẫn bảo trì
├── public/               # Tài nguyên tĩnh
├── tailwind.config.ts    # Cấu hình Tailwind CSS
├── next.config.mjs       # Cấu hình Next.js
├── package.json          # Danh sách dependencies
└── tsconfig.json         # Cấu hình TypeScript
```

### 2.2 Quy ước đặt tên

- **Files**:

- Components: kebab-case (ví dụ: `student-table.tsx`)
- Hooks: camelCase với tiền tố `use` (ví dụ: `useApiQuery.ts`)
- Utilities: camelCase (ví dụ: `formatDate.ts`)



- **Components**:

- Tên component: PascalCase (ví dụ: `StudentTable`)
- Props interface: PascalCase với hậu tố `Props` (ví dụ: `StudentTableProps`)



- **Variables & Functions**:

- Biến và hàm: camelCase (ví dụ: `fetchStudentData`)
- Constants: UPPER_SNAKE_CASE (ví dụ: `MAX_STUDENTS_PER_PAGE`)



- **Types & Interfaces**:

- Types: PascalCase (ví dụ: `Student`, `PaymentMethod`)
- Enums: PascalCase (ví dụ: `AttendanceStatus`)





### 2.3 Cấu trúc file component

Mỗi component nên tuân theo cấu trúc sau:

```typescript
// 1. Imports
import { useState } from "react"
import { ComponentA } from "./component-a"
import { ComponentB } from "./component-b"
import { someUtil } from "@/lib/utils"

// 2. Types
interface MyComponentProps {
  prop1: string;
  prop2?: number;
}

// 3. Component
export function MyComponent({ prop1, prop2 = 0 }: MyComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState(0)
  
  // 3.2 Derived state & handlers
  const derivedValue = someUtil(prop1, state)
  const handleClick = () => setState(state + 1)
  
  // 3.3 Render
  return (
    <div>
      <ComponentA value={derivedValue} />
      <ComponentB onClick={handleClick} />
    </div>
  )
}
```

## 3. Kiến trúc hệ thống

### 3.1 Kiến trúc tổng thể

Hệ thống được xây dựng theo kiến trúc client-server, với frontend được phát triển bằng Next.js và React. Hiện tại, backend được mô phỏng bằng dữ liệu mẫu, nhưng sẽ được thay thế bằng API thực tế trong tương lai.

### 3.2 Luồng dữ liệu

1. **UI Components** gọi các hàm từ **API Layer**
2. **API Layer** (`lib/api.ts`) xử lý việc gọi API và trả về dữ liệu
3. **Custom Hooks** (`lib/hooks/use-api-query.ts`) quản lý trạng thái loading, error và data
4. **UI Components** hiển thị dữ liệu và xử lý tương tác người dùng


### 3.3 Quản lý state

- **Local State**: Sử dụng React's `useState` và `useReducer` hooks
- **Global State**: Sử dụng React Context API (ví dụ: `SidebarProvider`)
- **Server State**: Quản lý thông qua custom hooks như `useApiQuery`


### 3.4 Routing

Hệ thống sử dụng Next.js App Router với cấu trúc thư mục:

- `app/page.tsx`: Trang chủ
- `app/login/page.tsx`: Trang đăng nhập
- `app/(dashboard)/dashboard/page.tsx`: Trang dashboard
- `app/(dashboard)/students/page.tsx`: Trang quản lý học sinh
- v.v.


## 4. Quy trình phát triển

### 4.1 Môi trường phát triển

#### Cài đặt môi trường

1. Clone repository:

```shellscript
git clone https://github.com/anhbinhminh/student-management.git
cd student-management
```


2. Cài đặt dependencies:

```shellscript
npm install
```


3. Chạy môi trường development:

```shellscript
npm run dev
```




#### Cấu hình IDE

Khuyến nghị sử dụng Visual Studio Code với các extensions sau:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)


### 4.2 Quy trình làm việc

#### Quy trình Git

1. **Branch Strategy**:

1. `main`: Branch chính, luôn ở trạng thái stable
2. `develop`: Branch phát triển, tích hợp các tính năng mới
3. `feature/feature-name`: Branch cho tính năng mới
4. `fix/bug-name`: Branch cho việc sửa lỗi
5. `release/version`: Branch chuẩn bị cho release



2. **Quy trình làm việc**:

1. Tạo branch mới từ `develop` cho tính năng hoặc fix
2. Phát triển và test trên branch đó
3. Tạo Pull Request vào `develop`
4. Code review và merge
5. Định kỳ merge `develop` vào `main` cho releases





#### Quy trình Code Review

1. **Trước khi tạo PR**:

1. Đảm bảo code đã được format đúng
2. Đảm bảo không có lỗi ESLint
3. Đảm bảo tất cả tests đều pass
4. Viết mô tả PR rõ ràng



2. **Trong quá trình review**:

1. Reviewer tập trung vào logic, hiệu suất và khả năng bảo trì
2. Đánh giá UX/UI nếu có thay đổi giao diện
3. Kiểm tra xử lý lỗi và edge cases





### 4.3 Coding Standards

#### TypeScript

- Luôn sử dụng kiểu dữ liệu rõ ràng, tránh sử dụng `any`
- Sử dụng interfaces cho objects và types cho unions/intersections
- Sử dụng type guards khi cần thiết


```typescript
// Tốt
interface Student {
  id: string;
  name: string;
  age: number;
}

// Tránh
const student: any = { id: '1', name: 'John' };
```

#### React

- Sử dụng functional components và hooks
- Tránh sử dụng class components
- Tách logic phức tạp thành custom hooks
- Sử dụng React.memo cho components cần tối ưu hiệu suất


```typescript
// Tốt
function StudentList({ students }: { students: Student[] }) {
  return (
    <ul>
      {students.map(student => (
        <li key={student.id}>{student.name}</li>
      ))}
    </ul>
  );
}

// Tránh
function StudentList(props) {
  return (
    <ul>
      {props.students.map(student => (
        <li>{student.name}</li>
      ))}
    </ul>
  );
}
```

#### CSS/Tailwind

- Sử dụng Tailwind CSS cho styling
- Sử dụng `cn()` utility để kết hợp classes có điều kiện
- Tránh inline styles
- Sử dụng CSS variables cho theme khi cần thiết


```typescript
// Tốt
<div className={cn("p-4 rounded", isActive && "bg-blue-500")}>

// Tránh
<div style={{ padding: '1rem', borderRadius: '0.25rem', backgroundColor: isActive ? 'blue' : '' }}>
```

## 5. Hướng dẫn bảo trì từng module

### 5.1 Module Quản lý Học sinh

#### Cấu trúc

- `app/(dashboard)/students/page.tsx`: Trang chính quản lý học sinh
- `components/enhanced-student-table.tsx`: Bảng hiển thị danh sách học sinh
- `components/student-crud.tsx`: Components CRUD cho học sinh


#### Luồng dữ liệu

1. Dữ liệu học sinh được lấy từ `fetchStudents()` trong `lib/api.ts`
2. Dữ liệu được hiển thị trong `EnhancedStudentTable`
3. Các thao tác CRUD được xử lý thông qua các components trong `student-crud.tsx`


#### Hướng dẫn bảo trì

1. **Thêm trường mới cho học sinh**:

1. Cập nhật interface `Student` trong `lib/types.ts`
2. Cập nhật mock data trong `lib/mockData.ts`
3. Cập nhật form trong `components/student-crud.tsx`
4. Cập nhật bảng trong `components/enhanced-student-table.tsx`



2. **Thêm chức năng lọc mới**:

1. Thêm state và handler trong `EnhancedStudentTable`
2. Thêm UI cho filter trong component
3. Cập nhật logic lọc dữ liệu



3. **Thay đổi validation**:

1. Cập nhật schema Zod trong `components/student-crud.tsx`





### 5.2 Module Quản lý Lớp học

#### Cấu trúc

- `app/(dashboard)/classes/page.tsx`: Trang chính quản lý lớp học
- `components/class-list.tsx`: Component hiển thị danh sách lớp học
- `app/(dashboard)/classes/[id]/page.tsx`: Trang chi tiết lớp học


#### Luồng dữ liệu

1. Dữ liệu lớp học được lấy từ `fetchClasses()` trong `lib/api.ts`
2. Dữ liệu được hiển thị trong `ClassList`
3. Chi tiết lớp học được hiển thị trong trang chi tiết


#### Hướng dẫn bảo trì

1. **Thêm trường mới cho lớp học**:

1. Cập nhật interface `Class` trong `lib/types.ts`
2. Cập nhật mock data trong `lib/mockData.ts`
3. Cập nhật UI trong `components/class-list.tsx`
4. Cập nhật trang chi tiết trong `app/(dashboard)/classes/[id]/page.tsx`



2. **Thêm chế độ xem mới**:

1. Thêm tab mới trong `app/(dashboard)/classes/page.tsx`
2. Tạo component mới hoặc mở rộng `ClassList` để hỗ trợ chế độ xem mới





### 5.3 Module Điểm danh

#### Cấu trúc

- `app/(dashboard)/attendance/page.tsx`: Trang chính điểm danh
- `components/attendance-table.tsx`: Bảng điểm danh
- `components/qr-scanner.tsx`: Component quét mã QR
- `components/attendance-results.tsx`: Hiển thị kết quả điểm danh


#### Luồng dữ liệu

1. Dữ liệu điểm danh được lấy từ `fetchAttendance()` trong `lib/api.ts`
2. QR Scanner xử lý việc quét mã QR
3. Kết quả điểm danh được hiển thị trong `AttendanceResults`


#### Hướng dẫn bảo trì

1. **Cập nhật logic quét QR**:

1. Sửa đổi `components/qr-scanner.tsx` để tích hợp với thư viện QR mới
2. Cập nhật xử lý dữ liệu QR



2. **Thêm phương thức điểm danh mới**:

1. Tạo component mới cho phương thức điểm danh
2. Thêm tab mới trong trang điểm danh
3. Tích hợp với API điểm danh





### 5.4 Module Thanh toán và Học phí

#### Cấu trúc

- `app/(dashboard)/payments/page.tsx`: Trang ghi nhận thanh toán
- `components/payment-form.tsx`: Form thanh toán
- `components/enhanced-payment-table.tsx`: Bảng lịch sử thanh toán
- `app/(dashboard)/tuition/page.tsx`: Trang quản lý học phí
- `components/tuition-table.tsx`: Bảng quản lý học phí


#### Luồng dữ liệu

1. Dữ liệu thanh toán được lấy từ `fetchPayments()` trong `lib/api.ts`
2. Dữ liệu học phí được lấy từ `fetchTuition()` trong `lib/api.ts`
3. Form thanh toán gửi dữ liệu thông qua `createPayment()`


#### Hướng dẫn bảo trì

1. **Thêm phương thức thanh toán mới**:

1. Cập nhật type `PaymentMethod` trong `lib/types.ts`
2. Thêm option mới trong form thanh toán
3. Cập nhật logic xử lý thanh toán



2. **Thay đổi cách tính học phí**:

1. Cập nhật logic trong `lib/api.ts` hoặc backend
2. Cập nhật UI hiển thị học phí





### 5.5 Module Lịch học

#### Cấu trúc

- `app/(dashboard)/schedule/page.tsx`: Trang lịch học
- `components/calendar-schedule.tsx`: Component lịch học
- `components/add-schedule-form.tsx`: Form thêm lịch học


#### Luồng dữ liệu

1. Dữ liệu lịch học được lấy từ `fetchSchedule()` trong `lib/api.ts`
2. Lịch học được hiển thị trong `CalendarSchedule`
3. Form thêm lịch học gửi dữ liệu thông qua `createScheduleEvent()`


#### Hướng dẫn bảo trì

1. **Thêm chế độ xem lịch mới**:

1. Thêm case mới trong `CalendarSchedule` cho chế độ xem
2. Cập nhật UI và logic hiển thị



2. **Cập nhật logic xung đột lịch**:

1. Thêm validation trong form thêm lịch
2. Cập nhật logic kiểm tra xung đột





### 5.6 Module Thông báo

#### Cấu trúc

- `app/(dashboard)/notifications/page.tsx`: Trang thông báo
- `components/simplified-notification-form.tsx`: Form gửi thông báo
- `components/notification-history.tsx`: Lịch sử thông báo


#### Luồng dữ liệu

1. Dữ liệu thông báo được lấy từ `fetchNotifications()` trong `lib/api.ts`
2. Form thông báo gửi dữ liệu thông qua `sendNotification()`


#### Hướng dẫn bảo trì

1. **Thêm template thông báo mới**:

1. Cập nhật `notificationTemplates` trong `lib/mockData.ts`
2. Thêm option mới trong form thông báo



2. **Tích hợp với dịch vụ thông báo mới**:

1. Cập nhật `sendNotification()` trong `lib/api.ts`
2. Cập nhật UI nếu cần thiết





## 6. Quản lý dữ liệu

### 6.1 Cấu trúc dữ liệu

Tất cả các kiểu dữ liệu được định nghĩa trong `lib/types.ts`. Các kiểu chính bao gồm:

- `Student`: Thông tin học sinh
- `Class`: Thông tin lớp học
- `Teacher`: Thông tin giáo viên
- `Payment`: Thông tin thanh toán
- `TuitionRecord`: Thông tin học phí
- `ScheduleEvent`: Thông tin lịch học
- `Attendance`: Thông tin điểm danh
- `Notification`: Thông tin thông báo


### 6.2 Mock Data

Dữ liệu mẫu được định nghĩa trong `lib/mockData.ts`. Đây là dữ liệu tạm thời được sử dụng trong quá trình phát triển và sẽ được thay thế bằng dữ liệu thực từ API.

### 6.3 API Layer

API Layer được định nghĩa trong `lib/api.ts`. File này chứa các hàm để gọi API và xử lý dữ liệu. Hiện tại, các hàm này đang sử dụng dữ liệu mẫu, nhưng sẽ được cập nhật để gọi API thực tế trong tương lai.

#### Chuyển từ Mock Data sang API thực tế

Để chuyển từ dữ liệu mẫu sang API thực tế, bạn cần cập nhật các hàm trong `lib/api.ts`. Ví dụ:

```typescript
// Từ:
export const fetchStudents = async (): Promise<Student[]> => {
  await delay(FAKE_DELAY);
  return [...students];
};

// Sang:
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch('/api/students');
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};
```

### 6.4 Custom Hooks

Custom hooks được sử dụng để quản lý trạng thái và logic liên quan đến dữ liệu. Hook chính là `useApiQuery` trong `lib/hooks/use-api-query.ts`, giúp quản lý trạng thái loading, error và data khi gọi API.

#### Sử dụng useApiQuery

```typescript
import { useApiQuery } from '@/lib/hooks/use-api-query';
import { fetchStudents } from '@/lib/api';

function StudentList() {
  const { data, isLoading, error, refetch } = useApiQuery(fetchStudents);

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Làm mới</button>
      {data?.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

## 7. Xử lý lỗi và gỡ lỗi

### 7.1 Chiến lược xử lý lỗi

#### Xử lý lỗi API

Lỗi API được xử lý trong `useApiQuery` hook và các hàm API. Khi có lỗi, hook sẽ cập nhật trạng thái error và component có thể hiển thị thông báo lỗi phù hợp.

```typescript
try {
  const data = await api.fetchStudents();
  // Xử lý dữ liệu
} catch (error) {
  // Hiển thị thông báo lỗi
  toast({
    variant: "destructive",
    title: "Lỗi",
    description: "Không thể tải dữ liệu học sinh. Vui lòng thử lại.",
  });
}
```

#### Xử lý lỗi form

Lỗi form được xử lý bằng Zod và React Hook Form. Zod validation schema được sử dụng để kiểm tra dữ liệu form và hiển thị thông báo lỗi.

```typescript
const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập họ và tên" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
});

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
  },
});
```

### 7.2 Logging

Hệ thống sử dụng `console.error` để log lỗi trong quá trình phát triển. Trong môi trường production, nên sử dụng dịch vụ logging như Sentry hoặc LogRocket.

### 7.3 Debugging

#### Debugging React Components

Sử dụng React DevTools để debug components, props và state:

1. Cài đặt React DevTools extension cho Chrome hoặc Firefox
2. Mở DevTools và chọn tab "Components" hoặc "React"
3. Kiểm tra component tree, props và state


#### Debugging Network Requests

Sử dụng Network tab trong DevTools để debug network requests:

1. Mở DevTools và chọn tab "Network"
2. Lọc requests theo "Fetch/XHR"
3. Kiểm tra requests, responses và status codes


## 8. Tối ưu hóa hiệu suất

### 8.1 Chiến lược tối ưu

#### Memoization

Sử dụng React.memo, useMemo và useCallback để tránh re-renders không cần thiết:

```typescript
// Memoize component
const MemoizedComponent = React.memo(MyComponent);

// Memoize value
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Memoize callback
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

#### Code Splitting

Sử dụng Next.js dynamic imports để chia nhỏ bundle:

```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable Server-Side Rendering if needed
});
```

#### Lazy Loading

Lazy load các components và dữ liệu không cần thiết ngay lập tức:

```typescript
// Lazy load images
<img loading="lazy" src="/large-image.jpg" alt="Large image" />

// Lazy load components
const LazyComponent = React.lazy(() => import('./heavy-component'));
```

### 8.2 Tối ưu hóa rendering

#### Virtualization

Sử dụng virtualization cho danh sách dài:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = React.useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  
  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Debouncing và Throttling

Sử dụng debounce và throttle cho các sự kiện thường xuyên như scroll, resize, input:

```typescript
import { debounce, throttle } from 'lodash';

// Debounce: Chỉ gọi hàm sau khi không có sự kiện trong một khoảng thời gian
const debouncedSearch = debounce((term) => {
  searchApi(term);
}, 300);

// Throttle: Giới hạn số lần gọi hàm trong một khoảng thời gian
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);

// Sử dụng
<input onChange={(e) => debouncedSearch(e.target.value)} />
<div onScroll={throttledScroll}>...</div>
```

### 8.3 Tối ưu hóa bundle size

#### Tree Shaking

Đảm bảo imports cụ thể để tận dụng tree shaking:

```typescript
// Tốt - chỉ import những gì cần thiết
import { Button } from '@/components/ui/button';

// Tránh - import toàn bộ module
import * as UI from '@/components/ui';
```

#### Phân tích Bundle

Sử dụng công cụ như `@next/bundle-analyzer` để phân tích bundle size:

```shellscript
npm install --save-dev @next/bundle-analyzer
```

Cập nhật `next.config.mjs`:

```javascript
import { withBundleAnalyzer } from '@next/bundle-analyzer';

const config = {
  // Next.js config
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(config);
```

Chạy phân tích:

```shellscript
ANALYZE=true npm run build
```

## 9. Bảo mật

### 9.1 Các vấn đề bảo mật cần chú ý

#### Cross-Site Scripting (XSS)

Tránh sử dụng `dangerouslySetInnerHTML` trừ khi thực sự cần thiết. Nếu cần, hãy sanitize dữ liệu trước:

```typescript
import DOMPurify from 'dompurify';

function SafeHTML({ html }) {
  const sanitizedHTML = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
}
```

#### Cross-Site Request Forgery (CSRF)

Sử dụng CSRF token cho các requests thay đổi dữ liệu:

```typescript
async function submitForm(data) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  
  await fetch('/api/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(data),
  });
}
```

#### Authentication và Authorization

Kiểm tra xác thực và phân quyền trước khi hiển thị dữ liệu nhạy cảm:

```typescript
function ProtectedPage() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login to access this page</div>;
  if (!user.hasPermission('view_students')) return <div>Access denied</div>;
  
  return <StudentList />;
}
```

### 9.2 Xử lý dữ liệu nhạy cảm

#### Không lưu dữ liệu nhạy cảm trong localStorage

```typescript
// Tránh
localStorage.setItem('user', JSON.stringify({ name: 'John', token: 'secret-token' }));

// Thay vào đó, sử dụng HTTP-only cookies hoặc session storage
sessionStorage.setItem('user', JSON.stringify({ name: 'John' }));
// Token nên được lưu trong HTTP-only cookie
```

#### Sanitize dữ liệu đầu vào

```typescript
function sanitizeInput(input) {
  // Loại bỏ các ký tự đặc biệt, HTML tags, etc.
  return input.replace(/<[^>]*>?/gm, '');
}

function handleSubmit(e) {
  e.preventDefault();
  const name = sanitizeInput(e.target.name.value);
  // Tiếp tục xử lý
}
```

## 10. Quy trình triển khai

### 10.1 Môi trường

#### Development

- URL: `dev.anhbinhminh.edu.vn`
- Mục đích: Phát triển và test nội bộ
- Cập nhật: Liên tục từ branch `develop`


#### Staging

- URL: `staging.anhbinhminh.edu.vn`
- Mục đích: Test trước khi đưa lên production
- Cập nhật: Khi chuẩn bị release từ branch `release/*`


#### Production

- URL: `anhbinhminh.edu.vn`
- Mục đích: Môi trường chính thức
- Cập nhật: Theo lịch release từ branch `main`


### 10.2 Quy trình triển khai

#### Chuẩn bị

1. Tạo branch `release/vX.Y.Z` từ `develop`
2. Chạy tests và sửa lỗi nếu cần
3. Cập nhật version trong `package.json`
4. Tạo Pull Request vào `main`


#### Triển khai

1. Merge Pull Request vào `main` sau khi được approve
2. Tag version mới: `git tag vX.Y.Z`
3. Push tag: `git push origin vX.Y.Z`
4. CI/CD pipeline sẽ tự động build và deploy


#### Rollback

Nếu có sự cố:

1. Xác định tag version trước đó: `git tag -l`
2. Checkout tag đó: `git checkout vX.Y.W`
3. Tạo branch hotfix: `git checkout -b hotfix/vX.Y.W`
4. Triển khai hotfix


### 10.3 CI/CD

#### GitHub Actions

File `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: .next
      - name: Deploy to production
        uses: some-deployment-action@v1
        with:
          api-key: ${{ secrets.DEPLOYMENT_API_KEY }}
          app-name: 'student-management'
```

## 11. Quy trình cập nhật và nâng cấp

### 11.1 Cập nhật dependencies

#### Kiểm tra updates

Sử dụng `npm-check-updates` để kiểm tra các updates:

```shellscript
npx npm-check-updates
```

Để cập nhật `package.json`:

```shellscript
npx npm-check-updates -u
```

Sau đó cài đặt các phiên bản mới:

```shellscript
npm install
```

#### Chiến lược cập nhật

1. **Cập nhật nhỏ (patch)**: Thực hiện thường xuyên, ít rủi ro
2. **Cập nhật trung bình (minor)**: Thực hiện định kỳ, kiểm tra breaking changes
3. **Cập nhật lớn (major)**: Lên kế hoạch cẩn thận, test kỹ lưỡng


### 11.2 Nâng cấp Next.js

#### Nâng cấp phiên bản Next.js

```shellscript
npm install next@latest react@latest react-dom@latest
```

#### Kiểm tra breaking changes

Tham khảo tài liệu nâng cấp của Next.js: [https://nextjs.org/docs/upgrading](https://nextjs.org/docs/upgrading)

### 11.3 Thêm tính năng mới

#### Quy trình thêm tính năng

1. **Lên kế hoạch**: Xác định yêu cầu và thiết kế
2. **Phát triển**: Tạo branch feature và phát triển
3. **Test**: Kiểm tra kỹ lưỡng
4. **Review**: Code review và feedback
5. **Merge**: Merge vào develop
6. **Deploy**: Triển khai lên staging và production


#### Ví dụ: Thêm tính năng quản lý điểm

1. Thêm types:


```typescript
// lib/types.ts
export type Score = {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  date: string;
  examType: "midterm" | "final";
};
```

2. Thêm mock data:


```typescript
// lib/mockData.ts
export const scores: Score[] = [
  {
    id: "SCORE001",
    studentId: "STU001",
    subject: "math",
    score: 8.5,
    date: "15/06/2023",
    examType: "midterm",
  },
  // Thêm dữ liệu mẫu khác
];
```

3. Thêm API functions:


```typescript
// lib/api.ts
export const fetchScores = async (studentId?: string): Promise<Score[]> => {
  await delay(FAKE_DELAY);
  
  if (studentId) {
    return scores.filter(score => score.studentId === studentId);
  }
  
  return [...scores];
};

export const createScore = async (scoreData: Omit<Score, "id">): Promise<Score> => {
  await delay(FAKE_DELAY);
  
  const newScore: Score = {
    id: `SCORE${String(scores.length + 1).padStart(3, '0')}`,
    ...scoreData,
  };
  
  return newScore;
};
```

4. Tạo components:


```typescript
// components/score-table.tsx
"use client"

import { useState } from "react"
import { useApiQuery } from "@/lib/hooks/use-api-query"
import { fetchScores } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export function ScoreTable({ studentId }: { studentId?: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: scores, isLoading, error } = useApiQuery(() => fetchScores(studentId))
  
  // Filter scores based on search term
  const filteredScores = scores?.filter(score => 
    score.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading scores: {error.message}</div>
  
  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm môn học..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Môn học</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Ngày thi</TableHead>
              <TableHead>Loại</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScores.length > 0 ? (
              filteredScores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell>{score.subject}</TableCell>
                  <TableCell>{score.score}</TableCell>
                  <TableCell>{score.date}</TableCell>
                  <TableCell>{score.examType === "midterm" ? "Giữa kỳ" : "Cuối kỳ"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Không có dữ liệu điểm.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

5. Tích hợp vào page:


```typescript
// app/(dashboard)/students/[id]/scores/page.tsx
import { ScoreTable } from "@/components/score-table"

export default function StudentScoresPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bảng điểm</h1>
        <p className="text-muted-foreground">Xem điểm của học sinh</p>
      </div>
      
      <ScoreTable studentId={params.id} />
    </div>
  )
}
```

## 12. Vấn đề thường gặp và giải pháp

### 12.1 Vấn đề hiệu suất

#### Vấn đề: Render chậm với danh sách lớn

**Triệu chứng**: UI bị lag khi hiển thị danh sách có nhiều items.

**Giải pháp**:

1. Sử dụng virtualization với `react-window` hoặc `react-virtualized`
2. Phân trang dữ liệu
3. Sử dụng `React.memo` để tránh re-renders không cần thiết


#### Vấn đề: Bundle size lớn

**Triệu chứng**: Thời gian tải trang lần đầu chậm.

**Giải pháp**:

1. Sử dụng dynamic imports và code splitting
2. Lazy load components không cần thiết ngay lập tức
3. Tối ưu hóa imports để tận dụng tree shaking
4. Sử dụng `@next/bundle-analyzer` để phân tích và tối ưu bundle


### 12.2 Vấn đề UI/UX

#### Vấn đề: UI không nhất quán

**Triệu chứng**: Các components có style khác nhau, không tuân theo design system.

**Giải pháp**:

1. Sử dụng shadcn/ui components một cách nhất quán
2. Tạo và sử dụng các utility functions như `cn()` để kết hợp classes
3. Tạo theme variables trong Tailwind config


#### Vấn đề: Form validation không đồng nhất

**Triệu chứng**: Các form có logic validation khác nhau, thông báo lỗi không nhất quán.

**Giải pháp**:

1. Sử dụng Zod schemas cho tất cả các forms
2. Tạo các validation helpers để tái sử dụng
3. Đảm bảo thông báo lỗi nhất quán


### 12.3 Vấn đề API

#### Vấn đề: Xử lý lỗi API không đồng nhất

**Triệu chứng**: Một số components hiển thị lỗi, một số không, không có xử lý retry.

**Giải pháp**:

1. Sử dụng `useApiQuery` hook cho tất cả các API calls
2. Tạo error boundary components
3. Thêm logic retry cho các API calls quan trọng


#### Vấn đề: Dữ liệu không đồng bộ

**Triệu chứng**: Dữ liệu hiển thị không đồng bộ giữa các components.

**Giải pháp**:

1. Sử dụng global state hoặc context để chia sẻ dữ liệu
2. Thêm logic invalidation và refetch
3. Sử dụng optimistic updates


## 13. Tài liệu tham khảo

### 13.1 Tài liệu chính thức

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)


### 13.2 Thư viện và công cụ

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [Lucide React Icons](https://lucide.dev/)


### 13.3 Học liệu

- [Next.js App Router Course](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Patterns](https://reactpatterns.com/)


## 14. Liên hệ hỗ trợ

### 14.1 Đội ngũ phát triển

- **Lead Developer**: Nguyễn Văn A - [a@anhbinhminh.edu.vn](mailto:a@anhbinhminh.edu.vn)
- **Frontend Developer**: Trần Thị B - [b@anhbinhminh.edu.vn](mailto:b@anhbinhminh.edu.vn)
- **Backend Developer**: Lê Văn C - [c@anhbinhminh.edu.vn](mailto:c@anhbinhminh.edu.vn)
- **DevOps**: Phạm Thị D - [d@anhbinhminh.edu.vn](mailto:d@anhbinhminh.edu.vn)


### 14.2 Quy trình hỗ trợ

1. **Báo lỗi**: Tạo issue trên GitHub repository với template bug report
2. **Yêu cầu tính năng**: Tạo issue trên GitHub repository với template feature request
3. **Hỗ trợ khẩn cấp**: Liên hệ qua email [support@anhbinhminh.edu.vn](mailto:support@anhbinhminh.edu.vn) hoặc hotline 0901234567


### 14.3 Tài liệu nội bộ

- Wiki: [https://wiki.anhbinhminh.edu.vn](https://wiki.anhbinhminh.edu.vn)
- Confluence: [https://anhbinhminh.atlassian.net](https://anhbinhminh.atlassian.net)
- Jira: [https://anhbinhminh.atlassian.net/jira](https://anhbinhminh.atlassian.net/jira)


---

Tài liệu này được cập nhật lần cuối vào ngày 03/04/2025. Vui lòng kiểm tra phiên bản mới nhất trên hệ thống quản lý tài liệu nội bộ.