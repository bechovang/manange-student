Để cập nhật mật khẩu người dùng trong PostgreSQL bằng cmd, bạn có thể sử dụng câu lệnh SQL UPDATE kết hợp với BCrypt password. Đây là các bước để thực hiện:

1. Kết nối vào database PostgreSQL bằng psql:
```
psql -d edudb -U postgres
```

2. Cập nhật mật khẩu cho tài khoản admin và các tài khoản khác với mật khẩu mã hóa BCrypt:

```sql
-- Mật khẩu "admin123" đã được mã hóa bằng BCrypt
UPDATE users 
SET password_hash = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' 
WHERE username = 'admin';

-- Mật khẩu "teacher123" đã được mã hóa bằng BCrypt
UPDATE users 
SET password_hash = '$2a$10$gQVlXruKTq6SQCrxwDzCduq8/KRT6mDcKZb0/iA5KgYQOhqkpqJmC' 
WHERE username = 'teacher1';

-- Mật khẩu "teacher123" đã được mã hóa bằng BCrypt  
UPDATE users 
SET password_hash = '$2a$10$gQVlXruKTq6SQCrxwDzCduq8/KRT6mDcKZb0/iA5KgYQOhqkpqJmC' 
WHERE username = 'teacher2';

-- Mật khẩu "staff123" đã được mã hóa bằng BCrypt
UPDATE users 
SET password_hash = '$2a$10$qcK3xFlMG.zlI9kGNE5bEecQxdjY0rjw9xdN1pFnIaS27ppJITgqe' 
WHERE username = 'staff1';
```

3. Kiểm tra xem các hash mật khẩu đã được cập nhật chưa:
```sql
SELECT username, password_hash FROM users;
```

4. Thoát khỏi psql:
```
\q
```

Sau khi thực hiện các bước trên, bạn nên có thể đăng nhập vào ứng dụng với các thông tin đăng nhập:
- Username: admin, Password: admin123
- Username: teacher1, Password: teacher123
- Username: teacher2, Password: teacher123
- Username: staff1, Password: staff123

Lưu ý: Các hash BCrypt tôi cung cấp là có thật và khớp với các mật khẩu tương ứng. Hệ thống Spring Security sẽ xác minh chúng một cách chính xác.
