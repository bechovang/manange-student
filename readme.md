# EduWeb - Comprehensive Student Management System

EduWeb is a full-stack web application designed for educational centers to manage students, classes, schedules, attendance, payments, and administrative tasks. The system provides both a public-facing website for student registration and a comprehensive admin dashboard for center management.

## 🚀 Technologies Used

### 🌐 Frontend:
- **Framework**: Next.js 15 (App Router) with TypeScript
- **UI Library**: ShadCN UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Context, React Hook Form
- **Data Tables**: TanStack Table
- **Charts**: Recharts, Chart.js
- **QR Code**: html5-qrcode, qrcode.react
- **Authentication**: JWT with cookies
- **Deployment**: Vercel

### 🖥 Backend:
- **Framework**: Spring Boot 3.1.5
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Security**: Spring Security with JWT
- **Email**: Spring Boot Mail
- **Excel Export**: Apache POI
- **Testing**: JUnit 5, Mockito
- **Deployment**: Docker, Render

## 📋 Key Features

### 1️⃣ Public Website (Frontend)
- **Landing Page**: Showcase educational center with hero section
- **Student Registration**: Online registration form with validation
- **Class Schedule**: Display current class schedules
- **Honor Board**: Showcase outstanding students
- **Contact Information**: Center details and location

### 2️⃣ Admin Dashboard (Protected)
- **Student Management**: CRUD operations for student records
- **Class Management**: Create and manage classes with teachers
- **Schedule Management**: Set up class schedules and timetables
- **Attendance Tracking**: QR code-based attendance system
- **Payment Management**: Track tuition fees and payments
- **Financial Reports**: Generate financial reports and exports
- **Notification System**: Send notifications to students/parents
- **User Management**: Admin and teacher role management

### 3️⃣ Authentication & Authorization
- **JWT-based Authentication**: Secure login/logout system
- **Role-based Access Control**: Admin, Teacher, Staff roles
- **Protected Routes**: Middleware-based route protection
- **Token Refresh**: Automatic token refresh mechanism

### 4️⃣ Advanced Features
- **QR Code Attendance**: Generate and scan QR codes for attendance
- **Excel Export**: Export student lists and reports to Excel
- **Email Notifications**: Automated email notifications
- **Real-time Updates**: Live data updates in dashboard
- **Responsive Design**: Mobile-friendly interface
- **Data Validation**: Comprehensive form validation
- **Error Handling**: Global error handling and user feedback

## 🏗 Project Structure

```
manange-student/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/example/eduweb/
│   │       ├── auth/        # Authentication & authorization
│   │       ├── config/      # Configuration classes
│   │       ├── controller/  # REST controllers
│   │       ├── managesystem/# Core business logic
│   │       │   ├── controller/
│   │       │   ├── model/
│   │       │   ├── repository/
│   │       │   └── service/
│   │       └── EduwebApplication.java
│   ├── Dockerfile
│   └── render.yaml
├── frontend/               # Public website (Next.js)
│   ├── app/
│   │   ├── (dashboard)/   # Admin dashboard routes
│   │   ├── components/    # Reusable components
│   │   └── lib/          # Utilities and API clients
│   └── package.json
├── frontend manage student/ # Admin dashboard (Next.js)
│   ├── app/
│   │   ├── (dashboard)/   # Protected admin routes
│   │   ├── components/    # Admin-specific components
│   │   └── middleware.ts  # Authentication middleware
│   └── package.json
└── database/              # Database scripts and documentation
```

## 🗄 Database Schema

The system uses PostgreSQL with the following main entities:
- **Users**: Authentication and authorization
- **Students**: Student information and records
- **Teachers**: Teacher profiles and subjects
- **Classes**: Class definitions and schedules
- **StudentClasses**: Enrollment relationships
- **Schedule**: Class timetables
- **FinancialAccounts**: Student financial records
- **Payments**: Payment transactions
- **TuitionPlans**: Tuition fee structures
- **AttendanceRecords**: Attendance tracking
- **Notifications**: System notifications

## 🚀 Getting Started

### Prerequisites
- Java 17
- Node.js 18+
- PostgreSQL 12+
- Maven 3.6+

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
# Public website
cd frontend
npm install
npm run dev

# Admin dashboard
cd "frontend manage student"
npm install
npm run dev
```

### Database Setup
```bash
# Create database and run migrations
psql -U postgres
CREATE DATABASE eduweb;
\c eduweb
\i database/create_tables.sql
\i database/insert_data.sql
```

## 🔧 Configuration

### Backend Configuration
Update `application.properties` with your database and email settings:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eduweb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### Frontend Configuration
Update API endpoints in `lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment (Render)
The backend is configured for deployment on Render with Docker:
- Automatic builds from Git repository
- PostgreSQL database integration
- Environment variable configuration

### Frontend Deployment (Vercel)
Both frontend applications can be deployed on Vercel:
- Automatic deployments from Git
- Environment variable configuration
- Custom domain support

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:
- Authentication system documentation
- API documentation
- Database schema documentation
- Maintenance guides
- User guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Contact

For inquiries and support:
- **Email**: phuchcm2006@gmail.com
- **Project**: EduWeb Student Management System

---

🔥 *EduWeb - Empowering Education with Modern Technology!*

---

# EduWeb - Hệ Thống Quản Lý Học Sinh Toàn Diện

EduWeb là một ứng dụng web full-stack được thiết kế cho các trung tâm giáo dục để quản lý học sinh, lớp học, lịch trình, điểm danh, thanh toán và các tác vụ hành chính. Hệ thống cung cấp cả website công khai cho việc đăng ký học sinh và bảng điều khiển quản trị toàn diện cho việc quản lý trung tâm.

## 🚀 Công Nghệ Sử Dụng

### 🌐 Frontend:
- **Framework**: Next.js 15 (App Router) với TypeScript
- **UI Library**: ShadCN UI với Radix UI primitives
- **Styling**: Tailwind CSS
- **Quản lý State**: React Context, React Hook Form
- **Bảng dữ liệu**: TanStack Table
- **Biểu đồ**: Recharts, Chart.js
- **QR Code**: html5-qrcode, qrcode.react
- **Xác thực**: JWT với cookies
- **Triển khai**: Vercel

### 🖥 Backend:
- **Framework**: Spring Boot 3.1.5
- **Ngôn ngữ**: Java 17
- **Cơ sở dữ liệu**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Bảo mật**: Spring Security với JWT
- **Email**: Spring Boot Mail
- **Xuất Excel**: Apache POI
- **Testing**: JUnit 5, Mockito
- **Triển khai**: Docker, Render

## 📋 Tính Năng Chính

### 1️⃣ Website Công Khai (Frontend)
- **Trang chủ**: Giới thiệu trung tâm giáo dục với hero section
- **Đăng ký học sinh**: Form đăng ký trực tuyến với validation
- **Lịch học**: Hiển thị lịch học hiện tại
- **Bảng vinh danh**: Giới thiệu học sinh xuất sắc
- **Thông tin liên hệ**: Chi tiết và địa chỉ trung tâm

### 2️⃣ Bảng Điều Khiển Quản Trị (Được bảo vệ)
- **Quản lý học sinh**: Thao tác CRUD cho hồ sơ học sinh
- **Quản lý lớp học**: Tạo và quản lý lớp học với giáo viên
- **Quản lý lịch trình**: Thiết lập lịch học và thời khóa biểu
- **Theo dõi điểm danh**: Hệ thống điểm danh bằng QR code
- **Quản lý thanh toán**: Theo dõi học phí và thanh toán
- **Báo cáo tài chính**: Tạo báo cáo tài chính và xuất dữ liệu
- **Hệ thống thông báo**: Gửi thông báo cho học sinh/phụ huynh
- **Quản lý người dùng**: Quản lý vai trò admin và giáo viên

### 3️⃣ Xác Thực & Phân Quyền
- **Xác thực JWT**: Hệ thống đăng nhập/đăng xuất an toàn
- **Kiểm soát truy cập theo vai trò**: Vai trò Admin, Teacher, Staff
- **Bảo vệ route**: Bảo vệ route dựa trên middleware
- **Làm mới token**: Cơ chế tự động làm mới token

### 4️⃣ Tính Năng Nâng Cao
- **Điểm danh QR Code**: Tạo và quét mã QR để điểm danh
- **Xuất Excel**: Xuất danh sách học sinh và báo cáo ra Excel
- **Thông báo Email**: Thông báo email tự động
- **Cập nhật thời gian thực**: Cập nhật dữ liệu trực tiếp trong dashboard
- **Thiết kế responsive**: Giao diện thân thiện với mobile
- **Xác thực dữ liệu**: Xác thực form toàn diện
- **Xử lý lỗi**: Xử lý lỗi toàn cục và phản hồi người dùng

## 🏗 Cấu Trúc Dự Án

```
manange-student/
├── backend/                 # Ứng dụng Spring Boot
│   ├── src/main/java/
│   │   └── com/example/eduweb/
│   │       ├── auth/        # Xác thực & phân quyền
│   │       ├── config/      # Các lớp cấu hình
│   │       ├── controller/  # REST controllers
│   │       ├── managesystem/# Logic nghiệp vụ cốt lõi
│   │       │   ├── controller/
│   │       │   ├── model/
│   │       │   ├── repository/
│   │       │   └── service/
│   │       └── EduwebApplication.java
│   ├── Dockerfile
│   └── render.yaml
├── frontend/               # Website công khai (Next.js)
│   ├── app/
│   │   ├── (dashboard)/   # Routes bảng điều khiển
│   │   ├── components/    # Components tái sử dụng
│   │   └── lib/          # Tiện ích và API clients
│   └── package.json
├── frontend manage student/ # Bảng điều khiển admin (Next.js)
│   ├── app/
│   │   ├── (dashboard)/   # Routes admin được bảo vệ
│   │   ├── components/    # Components dành riêng cho admin
│   │   └── middleware.ts  # Middleware xác thực
│   └── package.json
└── database/              # Scripts và tài liệu cơ sở dữ liệu
```

## 🗄 Schema Cơ Sở Dữ Liệu

Hệ thống sử dụng PostgreSQL với các entity chính sau:
- **Users**: Xác thực và phân quyền
- **Students**: Thông tin và hồ sơ học sinh
- **Teachers**: Hồ sơ giáo viên và môn học
- **Classes**: Định nghĩa lớp học và lịch trình
- **StudentClasses**: Mối quan hệ đăng ký
- **Schedule**: Thời khóa biểu lớp học
- **FinancialAccounts**: Hồ sơ tài chính học sinh
- **Payments**: Giao dịch thanh toán
- **TuitionPlans**: Cấu trúc học phí
- **AttendanceRecords**: Theo dõi điểm danh
- **Notifications**: Thông báo hệ thống

## 🚀 Bắt Đầu

### Yêu Cầu
- Java 17
- Node.js 18+
- PostgreSQL 12+
- Maven 3.6+

### Thiết Lập Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Thiết Lập Frontend
```bash
# Website công khai
cd frontend
npm install
npm run dev

# Bảng điều khiển admin
cd "frontend manage student"
npm install
npm run dev
```

### Thiết Lập Cơ Sở Dữ Liệu
```bash
# Tạo cơ sở dữ liệu và chạy migrations
psql -U postgres
CREATE DATABASE eduweb;
\c eduweb
\i database/create_tables.sql
\i database/insert_data.sql
```

## 🔧 Cấu Hình

### Cấu Hình Backend
Cập nhật `application.properties` với cài đặt cơ sở dữ liệu và email:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eduweb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### Cấu Hình Frontend
Cập nhật endpoints API trong `lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🧪 Testing

### Test Backend
```bash
cd backend
mvn test
```

### Test Frontend
```bash
cd frontend
npm test
```

## 📦 Triển Khai

### Triển Khai Backend (Render)
Backend được cấu hình để triển khai trên Render với Docker:
- Build tự động từ Git repository
- Tích hợp cơ sở dữ liệu PostgreSQL
- Cấu hình biến môi trường

### Triển Khai Frontend (Vercel)
Cả hai ứng dụng frontend có thể được triển khai trên Vercel:
- Triển khai tự động từ Git
- Cấu hình biến môi trường
- Hỗ trợ tên miền tùy chỉnh

## 📚 Tài Liệu

Tài liệu toàn diện có sẵn trong thư mục `docs/`:
- Tài liệu hệ thống xác thực
- Tài liệu API
- Tài liệu schema cơ sở dữ liệu
- Hướng dẫn bảo trì
- Hướng dẫn người dùng

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch
3. Thực hiện thay đổi
4. Thêm test nếu cần thiết
5. Gửi pull request

## 📞 Liên Hệ

Để hỏi đáp và hỗ trợ:
- **Email**: phuchcm2006@gmail.com
- **Dự án**: Hệ Thống Quản Lý Học Sinh EduWeb

---

🔥 *EduWeb - Nâng Tầm Giáo Dục Với Công Nghệ Hiện Đại!*

