
## Xác thực và Ủy quyền (Authentication & Authorization)

Tất cả các yêu cầu đến API này cần được xác thực (ví dụ: sử dụng JWT Bearer Token trong header `Authorization`). Quyền truy cập cụ thể cho từng endpoint có thể được cấu hình (ví dụ: chỉ Admin mới xem được tất cả các ca, Staff chỉ xem/quản lý ca của mình).

## Định dạng Dữ liệu

*   **Request Body:** JSON (`application/json`)
*   **Response Body:** JSON (`application/json`)

## Các Endpoint

---

### 1. Bắt đầu Ca Làm Việc Mới

Bắt đầu một phiên làm việc mới cho nhân viên thu ngân, ghi nhận số tiền mặt ban đầu trong ngăn kéo.

*   **Endpoint:** `POST /start`
*   **Quyền hạn:** Staff, Admin
*   **Mô tả:**
    *   Tạo một bản ghi `cashier_shifts` mới với trạng thái `OPEN`.
    *   Kiểm tra xem `userId` được cung cấp có tồn tại không.
    *   Kiểm tra xem `userId` này đã có ca nào đang `OPEN` hay chưa. Nếu có, trả về lỗi.
    *   Ghi nhận `starting_cash` và `shift_start_time` (tự động).
*   **Request Body:** (`StartShiftRequestDto`)

    ```json
    {
      "userId": 12,               // Long, Bắt buộc: ID của nhân viên thu ngân bắt đầu ca
      "startingCash": 500000.00  // BigDecimal, Bắt buộc >= 0: Số tiền mặt ban đầu
    }
    ```

*   **Success Response:** (`201 Created`)

    *   Body: `CashierShiftResponseDto` (chi tiết ca vừa tạo, với trạng thái `OPEN`)

    ```json
    {
      "id": 101,
      "userId": 12,
      "userFullName": "Nguyễn Văn An",
      "shiftStartTime": "2023-10-27T08:00:00",
      "shiftEndTime": null,
      "startingCash": 500000.00,
      "endingCashCounted": null,
      "totalCashReceived": null,
      "totalNonCashReceived": null,
      "calculatedEndingCash": null,
      "cashDiscrepancy": null,
      "status": "OPEN",
      "notes": null,
      "closedById": null,
      "closedByFullName": null,
      "createdAt": "2023-10-27T08:00:00",
      "updatedAt": "2023-10-27T08:00:00"
    }
    ```

*   **Error Responses:**
    *   `400 Bad Request`: Dữ liệu request không hợp lệ (thiếu trường, sai kiểu dữ liệu), hoặc User đã có ca đang mở.
    *   `401 Unauthorized`: Chưa xác thực.
    *   `403 Forbidden`: Không có quyền thực hiện.
    *   `404 Not Found`: `userId` không tồn tại.
    *   `500 Internal Server Error`: Lỗi hệ thống.

---

### 2. Kết thúc Ca Làm Việc

Đóng một ca làm việc đang mở, ghi nhận số tiền mặt thực tế đếm được và thực hiện tính toán đối soát.

*   **Endpoint:** `POST /{shiftId}/close`
*   **Quyền hạn:** Staff (chỉ ca của mình), Admin
*   **Mô tả:**
    *   Tìm ca làm việc theo `shiftId`.
    *   Kiểm tra ca phải đang ở trạng thái `OPEN`.
    *   Kiểm tra `closedByUserId` tồn tại.
    *   **Tính toán:** Dựa vào các giao dịch (`transactions`) được tạo bởi `user` của ca này trong khoảng thời gian từ `shift_start_time` đến thời điểm hiện tại:
        *   `total_cash_received`: Tổng tiền mặt thu vào.
        *   `total_non_cash_received`: Tổng tiền không phải tiền mặt thu vào.
        *   `calculated_ending_cash`: Số tiền mặt lý thuyết cuối ca (`starting_cash` + `total_cash_received`).
        *   `cash_discrepancy`: Chênh lệch (`ending_cash_counted` - `calculated_ending_cash`).
    *   Cập nhật các trường thông tin cuối ca (`ending_cash_counted`, `notes`, `closed_by`, `shift_end_time`, các trường tính toán) và chuyển `status` thành `CLOSED`.
*   **Path Parameter:**
    *   `shiftId` (Long): ID của ca cần đóng.
*   **Request Body:** (`CloseShiftRequestDto`)

    ```json
    {
      "endingCashCounted": 7850000.50, // BigDecimal, Bắt buộc >= 0: Số tiền mặt thực tế đếm được
      "notes": "Thiếu 50.000đ do trả nhầm tiền thừa.", // String, Tùy chọn: Ghi chú về ca
      "closedByUserId": 12             // Long, Bắt buộc: ID của người thực hiện đóng ca (có thể là chính cashier hoặc quản lý)
    }
    ```

*   **Success Response:** (`200 OK`)

    *   Body: `CashierShiftResponseDto` (chi tiết ca vừa được đóng và cập nhật)

    ```json
    {
      "id": 101,
      "userId": 12,
      "userFullName": "Nguyễn Văn An",
      "shiftStartTime": "2023-10-27T08:00:00",
      "shiftEndTime": "2023-10-27T16:05:30",
      "startingCash": 500000.00,
      "endingCashCounted": 7850000.50,
      "totalCashReceived": 7400000.50,   // Giá trị được tính toán
      "totalNonCashReceived": 12500000.00, // Giá trị được tính toán
      "calculatedEndingCash": 7900000.50, // Giá trị được tính toán (starting + totalCash)
      "cashDiscrepancy": -50000.00,       // Giá trị được tính toán (endingCounted - calculated)
      "status": "CLOSED",
      "notes": "Thiếu 50.000đ do trả nhầm tiền thừa.",
      "closedById": 12,
      "closedByFullName": "Nguyễn Văn An",
      "createdAt": "2023-10-27T08:00:00",
      "updatedAt": "2023-10-27T16:05:30"
    }
    ```

*   **Error Responses:**
    *   `400 Bad Request`: Dữ liệu request không hợp lệ, hoặc ca không ở trạng thái `OPEN`.
    *   `401 Unauthorized`: Chưa xác thực.
    *   `403 Forbidden`: Không có quyền thực hiện.
    *   `404 Not Found`: `shiftId` hoặc `closedByUserId` không tồn tại.
    *   `500 Internal Server Error`: Lỗi hệ thống (ví dụ: lỗi khi tính toán từ transactions).

---

### 3. Lấy Thông Tin Chi Tiết Ca Làm Việc

Lấy thông tin đầy đủ của một ca làm việc cụ thể bằng ID.

*   **Endpoint:** `GET /{shiftId}`
*   **Quyền hạn:** Staff (chỉ ca của mình), Admin
*   **Mô tả:** Trả về chi tiết của ca làm việc tương ứng với `shiftId`.
*   **Path Parameter:**
    *   `shiftId` (Long): ID của ca cần xem.
*   **Success Response:** (`200 OK`)
    *   Body: `CashierShiftResponseDto`
*   **Error Responses:**
    *   `401 Unauthorized`: Chưa xác thực.
    *   `403 Forbidden`: Không có quyền xem ca này.
    *   `404 Not Found`: `shiftId` không tồn tại.
    *   `500 Internal Server Error`: Lỗi hệ thống.

---

### 4. Lấy Danh Sách Tất Cả Các Ca Làm Việc

Lấy danh sách tất cả các ca làm việc trong hệ thống. (Cân nhắc thêm phân trang nếu dữ liệu lớn).

*   **Endpoint:** `GET /`
*   **Quyền hạn:** Admin (hoặc vai trò quản lý phù hợp)
*   **Mô tả:** Trả về một danh sách các ca làm việc. Có thể bổ sung các tham số query để lọc theo trạng thái, ngày tháng, user,...
*   **Query Parameters (Ví dụ - tùy chọn):**
    *   `userId` (Long): Lọc theo ID nhân viên.
    *   `status` (String: OPEN | CLOSED | RECONCILED): Lọc theo trạng thái.
    *   `startDate` (String: yyyy-MM-dd): Lọc từ ngày.
    *   `endDate` (String: yyyy-MM-dd): Lọc đến ngày.
    *   `page` (Integer, default=0): Số trang (cho phân trang).
    *   `size` (Integer, default=20): Kích thước trang (cho phân trang).
*   **Success Response:** (`200 OK`)
    *   Body: `List<CashierShiftResponseDto>` (hoặc đối tượng Page nếu có phân trang)
*   **Error Responses:**
    *   `400 Bad Request`: Tham số query không hợp lệ.
    *   `401 Unauthorized`: Chưa xác thực.
    *   `403 Forbidden`: Không có quyền xem danh sách này.
    *   `500 Internal Server Error`: Lỗi hệ thống.

---

### 5. Lấy Danh Sách Ca Làm Việc Theo User ID

Lấy danh sách tất cả các ca làm việc của một nhân viên thu ngân cụ thể.

*   **Endpoint:** `GET /user/{userId}`
*   **Quyền hạn:** Admin, Staff (chỉ được xem user ID của chính mình)
*   **Mô tả:** Trả về danh sách các ca làm việc của `userId` được chỉ định.
*   **Path Parameter:**
    *   `userId` (Long): ID của nhân viên thu ngân.
*   **Success Response:** (`200 OK`)
    *   Body: `List<CashierShiftResponseDto>`
*   **Error Responses:**
    *   `401 Unauthorized`: Chưa xác thực.
    *   `403 Forbidden`: Không có quyền xem ca của user này.
    *   `404 Not Found`: `userId` không tồn tại (nếu có kiểm tra).
    *   `500 Internal Server Error`: Lỗi hệ thống.

---

### 6. Lấy Ca Làm Việc Đang Mở Hiện Tại Của User

Kiểm tra và lấy thông tin ca làm việc đang `OPEN` của một nhân viên cụ thể. Hữu ích cho giao diện người dùng để biết trạng thái hiện tại.

*   **Endpoint:** `GET /user/{userId}/current`
*   **Quyền hạn:** Admin, Staff (chỉ được xem user ID của chính mình)
*   **Mô tả:** Tìm và trả về ca có trạng thái `OPEN` của `userId` chỉ định. Nếu không có ca nào đang mở, trả về response phù hợp (ví dụ: 204 No Content).
*   **Path Parameter:**
    *   `userId` (Long): ID của nhân viên thu ngân.
*   **Success Response:**
    *   `200 OK`: Nếu tìm thấy ca đang mở.
        *   Body: `CashierShiftResponseDto`
    *   `204 No Content`: Nếu không tìm thấy ca nào đang mở cho user này.
        *   Body: (Trống)
*   **Error Responses:**
    *   `401 Unauthorized`: Chưa xác thực.
    *   `403 Forbidden`: Không có quyền truy cập thông tin user này.
    *   `404 Not Found`: `userId` không tồn tại (nếu có kiểm tra).
    *   `500 Internal Server Error`: Lỗi hệ thống.

---

## Mô Hình Dữ Liệu Phản Hồi (`CashierShiftResponseDto`)

```json
{
  "id": Long,                   // ID của ca
  "userId": Long,               // ID của nhân viên thực hiện ca
  "userFullName": String,       // Tên đầy đủ của nhân viên
  "shiftStartTime": DateTime,   // Thời gian bắt đầu ca (ISO 8601 format)
  "shiftEndTime": DateTime,     // Thời gian kết thúc ca (null nếu đang mở)
  "startingCash": BigDecimal,   // Tiền mặt đầu ca
  "endingCashCounted": BigDecimal,// Tiền mặt thực tế cuối ca (null nếu đang mở/chưa đếm)
  "totalCashReceived": BigDecimal,// Tổng tiền mặt thu trong ca (null nếu đang mở)
  "totalNonCashReceived": BigDecimal,// Tổng tiền khác thu trong ca (null nếu đang mở)
  "calculatedEndingCash": BigDecimal,// Tiền mặt LẼ RA phải có cuối ca (null nếu đang mở)
  "cashDiscrepancy": BigDecimal, // Chênh lệch tiền mặt (null nếu đang mở)
  "status": String,             // Trạng thái ca: "OPEN", "CLOSED", "RECONCILED"
  "notes": String,              // Ghi chú về ca
  "closedById": Long,           // ID người đóng ca (null nếu đang mở)
  "closedByFullName": String,   // Tên người đóng ca (null nếu đang mở)
  "createdAt": DateTime,        // Thời gian tạo bản ghi
  "updatedAt": DateTime         // Thời gian cập nhật cuối
}