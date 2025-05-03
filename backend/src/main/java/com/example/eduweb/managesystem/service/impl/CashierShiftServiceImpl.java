// src/main/java/com/example/eduweb/managesystem/service/impl/CashierShiftServiceImpl.java
// (Thường đặt implementation trong một sub-package 'impl')
package com.example.eduweb.managesystem.service.impl;

// Import Interface mà lớp này triển khai
import com.example.eduweb.managesystem.service.CashierShiftService;

// Import các DTO cần thiết
import com.example.eduweb.managesystem.dto.CashierShiftResponseDto;
import com.example.eduweb.managesystem.dto.CloseShiftRequestDto;
import com.example.eduweb.managesystem.dto.StartShiftRequestDto;

// Import các Exception tùy chỉnh
import com.example.eduweb.managesystem.exception.BadRequestException; // Thay bằng package đúng
import com.example.eduweb.managesystem.exception.ResourceNotFoundException; // Thay bằng package đúng

// Import các Model/Entity
import com.example.eduweb.managesystem.model.CashierShift;
import com.example.eduweb.managesystem.model.enums.CashierShiftStatus;
import com.example.eduweb.auth.model.User; // Sử dụng User từ module auth
import com.example.eduweb.managesystem.model.enums.PaymentMethod;

// Import các Repository
import com.example.eduweb.managesystem.repository.CashierShiftRepository;
import com.example.eduweb.auth.repository.UserRepository; // Sử dụng UserRepository từ module auth
import com.example.eduweb.managesystem.repository.TransactionRepository;

// Import các thư viện cần thiết khác
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Lớp triển khai các nghiệp vụ quản lý ca làm việc, thực thi hợp đồng định nghĩa
 * trong {@link CashierShiftService}.
 */
@Service // Đánh dấu là một Spring Service Bean
@RequiredArgsConstructor // Lombok: Tự tạo constructor để inject dependency
public class CashierShiftServiceImpl implements CashierShiftService {

    // Khai báo các dependency cần thiết (sẽ được inject qua constructor)
    private final CashierShiftRepository cashierShiftRepository;
    private final UserRepository userRepository; // Sử dụng UserRepository từ module auth
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu khi bắt đầu ca
    public CashierShiftResponseDto startShift(StartShiftRequestDto requestDto) {
        // 1. Xác thực User
        User cashier = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", requestDto.getUserId()));

        // 2. Kiểm tra ca đang mở
        cashierShiftRepository.findByUserIdAndStatus(requestDto.getUserId(), CashierShiftStatus.OPEN)
                .ifPresent(shift -> {
                    throw new BadRequestException("Người dùng này đã có một ca đang mở (ID: " + shift.getId() + ")");
                });

        // 3. Tạo ca mới
        CashierShift newShift = CashierShift.builder()
                .user(cashier)
                .startingCash(requestDto.getStartingCash())
                // status và shiftStartTime thường được xử lý bởi @PrePersist trong Entity
                .build();

        // 4. Lưu và trả về DTO
        CashierShift savedShift = cashierShiftRepository.save(newShift);
        return CashierShiftResponseDto.fromEntity(savedShift);
    }

    @Override
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu khi đóng ca
    public CashierShiftResponseDto closeShift(Long shiftId, CloseShiftRequestDto requestDto) {
        // 1. Tìm ca cần đóng
        CashierShift shift = cashierShiftRepository.findById(shiftId)
                .orElseThrow(() -> new ResourceNotFoundException("CashierShift", "id", shiftId));

        // 2. Kiểm tra trạng thái ca
        if (shift.getStatus() != CashierShiftStatus.OPEN) {
            throw new BadRequestException("Ca làm việc không ở trạng thái OPEN. Trạng thái hiện tại: " + shift.getStatus());
        }

        // 3. Xác thực người đóng ca
        User closingUser = userRepository.findById(requestDto.getClosedByUserId())
                 .orElseThrow(() -> new ResourceNotFoundException("User (người đóng ca)", "id", requestDto.getClosedByUserId()));

        // 4. *** Tính toán các giá trị tổng *** (Quan trọng: Cần implement thực tế)
        LocalDateTime endTimeForCalculation = LocalDateTime.now();
        BigDecimal totalCash = calculateTotalCashReceived(shift.getUser().getId(), shift.getShiftStartTime(), endTimeForCalculation);
        BigDecimal totalNonCash = calculateTotalNonCashReceived(shift.getUser().getId(), shift.getShiftStartTime(), endTimeForCalculation);

        // 5. Tính toán giá trị cuối ca và chênh lệch
        BigDecimal calculatedEnding = shift.getStartingCash().add(totalCash); // Giả sử không có chi tiền
        BigDecimal discrepancy = requestDto.getEndingCashCounted().subtract(calculatedEnding);

        // 6. Cập nhật thông tin ca
        shift.setShiftEndTime(endTimeForCalculation);
        shift.setEndingCashCounted(requestDto.getEndingCashCounted());
        shift.setTotalCashReceived(totalCash);
        shift.setTotalNonCashReceived(totalNonCash);
        shift.setCalculatedEndingCash(calculatedEnding);
        shift.setCashDiscrepancy(discrepancy);
        shift.setStatus(CashierShiftStatus.CLOSED);
        shift.setNotes(requestDto.getNotes());
        shift.setClosedBy(closingUser);

        // 7. Lưu và trả về DTO
        CashierShift updatedShift = cashierShiftRepository.save(shift);
        return CashierShiftResponseDto.fromEntity(updatedShift);
    }

    @Override
    public CashierShiftResponseDto getShiftById(Long shiftId) {
        // Tìm hoặc ném lỗi nếu không thấy
        CashierShift shift = cashierShiftRepository.findById(shiftId)
                .orElseThrow(() -> new ResourceNotFoundException("CashierShift", "id", shiftId));
        // Chuyển đổi và trả về
        return CashierShiftResponseDto.fromEntity(shift);
    }

    @Override
    public List<CashierShiftResponseDto> getAllShifts() {
        // Lấy tất cả
        List<CashierShift> shifts = cashierShiftRepository.findAll();
        // Chuyển đổi danh sách sang DTO
        return shifts.stream()
                .map(CashierShiftResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CashierShiftResponseDto> getShiftsByUserId(Long userId) {
        // Tùy chọn: Kiểm tra user tồn tại
        // userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Lấy danh sách theo user id
        List<CashierShift> shifts = cashierShiftRepository.findByUserId(userId);
        // Chuyển đổi danh sách sang DTO
        return shifts.stream()
                .map(CashierShiftResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CashierShiftResponseDto getCurrentOpenShiftByUserId(Long userId) {
        // Tùy chọn: Kiểm tra user tồn tại
        // userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Tìm ca đang mở của user
        Optional<CashierShift> openShiftOpt = cashierShiftRepository.findByUserIdAndStatus(userId, CashierShiftStatus.OPEN);
        // Nếu có thì chuyển sang DTO, nếu không trả về null (hoặc xử lý khác tùy yêu cầu)
        return openShiftOpt.map(CashierShiftResponseDto::fromEntity).orElse(null);
    }


    // --- Các phương thức Helper cho việc tính toán (private) ---
    // Chứa logic tính toán cụ thể, cần truy vấn TransactionRepository

    /**
     * [HELPER - CẦN IMPLEMENT] Tính tổng số tiền mặt thu được.
     */
    private BigDecimal calculateTotalCashReceived(Integer userId, LocalDateTime startTime, LocalDateTime endTime) {
        // Tổng hợp tất cả giao dịch tiền mặt trong khoảng thời gian của ca làm việc
        return transactionRepository.sumTransactionsByUserIdAndPaymentMethodAndTimeRange(
                userId, 
                PaymentMethod.CASH, 
                startTime, 
                endTime
        ).orElse(BigDecimal.ZERO);
    }

    /**
     * [HELPER - CẦN IMPLEMENT] Tính tổng số tiền không phải tiền mặt thu được.
     */
    private BigDecimal calculateTotalNonCashReceived(Integer userId, LocalDateTime startTime, LocalDateTime endTime) {
        // Tổng hợp tất cả giao dịch không phải tiền mặt (thanh toán điện tử, thẻ, chuyển khoản)
        BigDecimal bankTransfer = transactionRepository.sumTransactionsByUserIdAndPaymentMethodAndTimeRange(
                userId, 
                PaymentMethod.BANK, 
                startTime, 
                endTime
        ).orElse(BigDecimal.ZERO);
        
        // Tổng hợp tất cả các phương thức thanh toán không phải tiền mặt
        return bankTransfer;
    }

    // Có thể thêm các helper khác nếu cần, ví dụ: calculateTotalPayouts
}