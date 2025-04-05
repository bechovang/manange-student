Tôi sẽ tạo một tài liệu chi tiết cho backend của bạn. Đầu tiên, hãy khám phá cấu trúc của project:

Ran tool

Ran tool
# EduWeb Backend Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technical Stack](#2-technical-stack)
3. [Project Structure](#3-project-structure)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [API Documentation](#5-api-documentation)
6. [Database Schema](#6-database-schema)
7. [Security Implementation](#7-security-implementation)
8. [Service Layer](#8-service-layer)
9. [Configuration](#9-configuration)
10. [Testing](#10-testing)
11. [Deployment](#11-deployment)
12. [Error Handling](#12-error-handling)

## 1. Project Overview

EduWeb là một hệ thống quản lý trung tâm học tập hiện đại, được thiết kế để hỗ trợ các trung tâm giáo dục trong việc:
- Quản lý thông tin học viên
- Xử lý đăng ký khóa học
- Gửi thông báo qua email
- Xuất báo cáo dạng Excel
- Quản lý bảng vinh danh học viên xuất sắc

### Mục tiêu của Hệ thống
- Tự động hóa quy trình đăng ký học
- Cung cấp giao diện quản lý trực quan
- Đảm bảo bảo mật thông tin
- Tối ưu hóa quy trình làm việc của nhân viên

## 2. Technical Stack

### Core Technologies
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**: PostgreSQL
- **Security**: Spring Security với JWT
- **Documentation**: Swagger/OpenAPI

### Dependencies
```xml
<!-- Trích từ pom.xml -->
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
</dependencies>
```

## 3. Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/eduweb/
│   │   │       ├── auth/           # Authentication related code
│   │   │       ├── config/         # Configuration classes
│   │   │       ├── controller/     # REST controllers
│   │   │       ├── model/          # Entity classes
│   │   │       ├── repository/     # Data access layer
│   │   │       ├── service/        # Business logic
│   │   │       └── EduwebApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-{profile}.properties
│   └── test/
└── pom.xml
```

### Key Packages

#### 1. auth/
- Xử lý authentication và authorization
- JWT service và filters
- Security configurations

#### 2. config/
- Cấu hình Spring Security
- Cấu hình CORS
- Cấu hình Database

#### 3. controller/
- REST endpoints
- Request/Response handling
- Input validation

#### 4. model/
- Entity classes
- Data Transfer Objects (DTOs)
- Database mappings

#### 5. repository/
- Data access interfaces
- Custom queries
- JPA repositories

#### 6. service/
- Business logic
- Transaction management
- Integration with external services

## 4. Authentication & Authorization

### JWT Implementation

#### JwtService
```java
@Service
public class JwtService {
    private final String secretKey;
    private final long jwtExpiration;
    private final long refreshExpiration;

    public String generateToken(UserDetails userDetails, TokenType type) {
        // Generate JWT token
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        // Validate token
    }
}
```

### Security Flow
1. User đăng nhập với username/password
2. Server xác thực và tạo JWT
3. Client sử dụng JWT cho các request tiếp theo
4. JwtAuthFilter xác thực JWT trong mỗi request

### Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        // Configure security rules
    }
}
```

## 5. API Documentation

### Authentication APIs

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "string",
    "password": "string"
}

Response:
{
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": number,
    "user": {
        "username": "string",
        "role": "string"
    }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "string"
}

Response:
{
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": number
}
```

### Registration APIs

#### Create Registration
```http
POST /api/registrations
Authorization: Bearer {token}
Content-Type: application/json

{
    "studentName": "string",
    "course": "string",
    "email": "string",
    "phone": "string"
}
```

#### Get All Registrations
```http
GET /api/registrations
Authorization: Bearer {token}

Response:
[
    {
        "id": number,
        "studentName": "string",
        "course": "string",
        "status": "string",
        "createdAt": "datetime"
    }
]
```

## 6. Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

### Registrations Table
```sql
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

## 7. Security Implementation

### Password Hashing
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### JWT Security
- Sử dụng HS256 algorithm
- Token expiration: Access token (24h), Refresh token (7 days)
- Token blacklisting cho logout

### CORS Configuration
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    // ... more configuration
}
```

## 8. Service Layer

### Email Service
```java
@Service
public class EmailService {
    public void sendRegistrationConfirmation(Registration registration) {
        // Send confirmation email
    }
    
    public void sendAdminNotification(Registration registration) {
        // Notify admin about new registration
    }
}
```

### Excel Export Service
```java
@Service
public class ExcelExportService {
    public ByteArrayInputStream exportRegistrations(List<Registration> registrations) {
        // Generate Excel file
    }
}
```

## 9. Configuration

### Application Properties
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/eduweb
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

## 10. Testing

### Unit Tests
- Service layer tests
- Repository tests
- Controller tests

### Integration Tests
- End-to-end API tests
- Security tests
- Database integration tests

### Test Configuration
```java
@TestConfiguration
public class TestConfig {
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/**");
    }
}
```

## 11. Deployment

### Docker Configuration
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Environment Variables
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`

### Production Considerations
- Enable HTTPS
- Configure proper CORS
- Set up logging
- Configure rate limiting
- Enable caching

## 12. Error Handling

### Global Exception Handler
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthException ex) {
        // Handle authentication errors
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        // Handle general errors
    }
}
```

### Custom Exceptions
```java
public class AuthException extends RuntimeException {
    private String errorCode;
    private String errorMessage;
    // ... constructors and getters
}
```

### Error Response Format
```json
{
    "error": "string",
    "message": "string",
    "timestamp": "datetime",
    "path": "string"
}
```

Bạn có muốn tôi đi sâu vào chi tiết của bất kỳ phần nào không? Tôi có thể cung cấp thêm thông tin về:
1. Chi tiết triển khai của các service
2. Cấu hình bảo mật
3. Chiến lược testing
4. Quy trình deployment
5. Hoặc bất kỳ phần nào khác bạn quan tâm
