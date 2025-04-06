Để kiểm tra xem frontend đã được liên kết thành công với backend và hệ thống authentication đã hoạt động chưa, bạn có thể thực hiện các bước sau:

```bash
cd backend && ./mvnw spring-boot:run
```

```bash
cd frontend\ manage\ student && npm run dev
```
Để kiểm tra xem frontend đã liên kết thành công với backend và hệ thống authentication đã hoạt động chưa, hãy làm theo các bước sau:

## 1. Kiểm tra cấu hình backend và khởi động server

Đảm bảo backend đang chạy trên port 8080 (như đã cấu hình trong file .env.local):

```bash
cd backend
./mvnw spring-boot:run
```

## 2. Khởi động frontend server

Trong một terminal mới:

```bash
cd frontend\ manage\ student
npm run dev
```

## 3. Test login

Sau khi cả hai server đã khởi động, thực hiện các bước test sau:

### Test 1: Truy cập trang dashboard khi chưa đăng nhập
1. Mở trình duyệt và truy cập: http://localhost:3000/dashboard
2. Nếu authentication hoạt động đúng, hệ thống sẽ chuyển hướng bạn về trang đăng nhập

### Test 2: Đăng nhập với tài khoản hợp lệ
1. Truy cập: http://localhost:3000/login
2. Nhập thông tin đăng nhập với tài khoản có trong hệ thống backend
3. Nếu đăng nhập thành công, hệ thống sẽ:
   - Chuyển hướng bạn đến trang dashboard
   - Lưu token trong cookies (kiểm tra trong DevTools > Application > Cookies)

### Test 3: Kiểm tra token trong Cookies
1. Mở DevTools của trình duyệt (F12)
2. Chuyển đến tab Application > Cookies > http://localhost:3000
3. Kiểm tra xem có cookies tên "accessToken" và "refreshToken" không

### Test 4: Kiểm tra network request
1. Mở DevTools của trình duyệt (F12)
2. Chuyển đến tab Network
3. Tải lại trang dashboard
4. Tìm các request đến backend (localhost:8080)
5. Kiểm tra xem các request có header "Authorization: Bearer [token]" không

### Test 5: Đăng xuất
1. Nhấn vào nút đăng xuất trong ứng dụng
2. Kiểm tra xem hệ thống có chuyển hướng về trang login không
3. Kiểm tra xem cookies "accessToken" và "refreshToken" đã bị xóa chưa

## 4. Kiểm tra trong console

Bạn cũng nên kiểm tra console của cả frontend và backend để xem có lỗi nào không:

1. Console của frontend (trong DevTools của trình duyệt)
2. Console nơi chạy backend server

## 5. Dùng API client để test trực tiếp

Nếu bạn muốn test API trực tiếp, sử dụng Postman hoặc curl:

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Kết quả mong đợi sẽ bao gồm accessToken và refreshToken
```

## Vấn đề thường gặp và cách xử lý:

1. **CORS lỗi**: Kiểm tra log backend, nếu có lỗi CORS, đảm bảo cấu hình CORS trong backend đã cho phép frontend domain.

2. **401 Unauthorized**: Kiểm tra xem token có được gửi đúng định dạng không, nếu backend trả về 401 khi truy cập API.

3. **Cannot read property of undefined**: Kiểm tra xem API response có đúng định dạng mà frontend mong đợi không.

Nếu bạn gặp lỗi cụ thể trong quá trình test, hãy kiểm tra console và chia sẻ thông báo lỗi để tôi có thể giúp khắc phục.
