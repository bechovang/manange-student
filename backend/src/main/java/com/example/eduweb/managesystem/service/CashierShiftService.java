// src/main/java/com/example/eduweb/managesystem/service/CashierShiftService.java
package com.example.eduweb.managesystem.service;

// Import các DTO cần thiết
import com.example.eduweb.managesystem.dto.CashierShiftResponseDto;
import com.example.eduweb.managesystem.dto.CloseShiftRequestDto;
import com.example.eduweb.managesystem.dto.StartShiftRequestDto;

// Import các lớp khác nếu cần (ví dụ: cho kiểu trả về hoặc tham số)
import java.util.List;

/**
 * Interface định nghĩa các nghiệp vụ liên quan đến quản lý ca làm việc của nhân viên thu ngân.
 * Nó chỉ định các hành động mà một service quản lý ca cần có khả năng thực hiện.
 */
public interface CashierShiftService {

    /**
     * Bắt đầu một ca làm việc mới cho nhân viên thu ngân.
     * Yêu cầu thông tin người dùng và số tiền mặt ban đầu.
     * Kiểm tra xem người dùng đã có ca nào đang mở chưa trước khi tạo mới.
     *
     * @param requestDto DTO chứa thông tin để bắt đầu ca (userId, startingCash).
     * @return DTO chứa thông tin chi tiết của ca vừa được tạo.
     * @throws com.example.eduweb.managesystem.exception.ResourceNotFoundException Nếu không tìm thấy User.
     * @throws com.example.eduweb.managesystem.exception.BadRequestException Nếu User đã có ca đang mở.
     */
    CashierShiftResponseDto startShift(StartShiftRequestDto requestDto);

    /**
     * Đóng một ca làm việc đang mở.
     * Yêu cầu ID của ca cần đóng và thông tin khi kết thúc ca (số tiền đếm được, ghi chú, người đóng ca).
     * Thực hiện tính toán tổng tiền thu (tiền mặt, khác), tiền mặt cuối ca dự kiến và chênh lệch.
     * Cập nhật trạng thái ca thành 'CLOSED'.
     *
     * @param shiftId ID của ca làm việc cần đóng.
     * @param requestDto DTO chứa thông tin để đóng ca (endingCashCounted, notes, closedByUserId).
     * @return DTO chứa thông tin chi tiết của ca vừa được đóng và cập nhật.
     * @throws com.example.eduweb.managesystem.exception.ResourceNotFoundException Nếu không tìm thấy CashierShift hoặc User đóng ca.
     * @throws com.example.eduweb.managesystem.exception.BadRequestException Nếu ca không ở trạng thái 'OPEN'.
     */
    CashierShiftResponseDto closeShift(Long shiftId, CloseShiftRequestDto requestDto);

    /**
     * Lấy thông tin chi tiết của một ca làm việc cụ thể dựa vào ID.
     *
     * @param shiftId ID của ca làm việc cần lấy thông tin.
     * @return DTO chứa thông tin chi tiết của ca.
     * @throws com.example.eduweb.managesystem.exception.ResourceNotFoundException Nếu không tìm thấy CashierShift với ID cung cấp.
     */
    CashierShiftResponseDto getShiftById(Long shiftId);

    /**
     * Lấy danh sách tất cả các ca làm việc đã được ghi nhận trong hệ thống.
     * Có thể cần phân trang trong tương lai nếu dữ liệu lớn.
     *
     * @return Danh sách các DTO chứa thông tin của các ca làm việc.
     */
    List<CashierShiftResponseDto> getAllShifts();

    /**
     * Lấy danh sách tất cả các ca làm việc của một nhân viên thu ngân cụ thể.
     *
     * @param userId ID của người dùng (nhân viên thu ngân).
     * @return Danh sách các DTO chứa thông tin các ca làm việc của người dùng đó.
     * @throws com.example.eduweb.managesystem.exception.ResourceNotFoundException Nếu kiểm tra và không tìm thấy User (tùy chọn).
     */
    List<CashierShiftResponseDto> getShiftsByUserId(Long userId);

    /**
     * Lấy thông tin ca làm việc *đang mở* hiện tại của một nhân viên thu ngân cụ thể.
     * Hữu ích để kiểm tra trạng thái hoặc lấy thông tin ca hiện tại mà không cần biết ID.
     *
     * @param userId ID của người dùng (nhân viên thu ngân).
     * @return DTO chứa thông tin chi tiết của ca đang mở, hoặc null (hoặc Optional.empty()) nếu không có ca nào đang mở cho người dùng đó.
     * @throws com.example.eduweb.managesystem.exception.ResourceNotFoundException Nếu kiểm tra và không tìm thấy User (tùy chọn).
     */
    CashierShiftResponseDto getCurrentOpenShiftByUserId(Long userId);

    // --- Các phương thức tiềm năng khác có thể thêm vào đây ---
    // Ví dụ:
    // CashierShiftResponseDto reconcileShift(Long shiftId, Long reconciledByUserId, String notes);
    // CashierShiftResponseDto updateShiftNotes(Long shiftId, String notes);
}