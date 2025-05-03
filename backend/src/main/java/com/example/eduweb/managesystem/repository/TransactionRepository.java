package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.Transaction;
import com.example.eduweb.managesystem.model.enums.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface để tương tác với bảng transactions trong cơ sở dữ liệu
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    /**
     * Tìm tất cả giao dịch của một nhân viên thu ngân trong khoảng thời gian
     * 
     * @param userId ID của nhân viên thu ngân
     * @param startTime Thời gian bắt đầu
     * @param endTime Thời gian kết thúc
     * @return Danh sách các giao dịch
     */
    List<Transaction> findByUserIdAndCreatedAtBetween(Integer userId, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * Tính tổng số tiền giao dịch theo phương thức thanh toán trong khoảng thời gian
     * 
     * @param userId ID của nhân viên thu ngân
     * @param paymentMethod Phương thức thanh toán (CASH, CREDIT_CARD, v.v.)
     * @param startTime Thời gian bắt đầu
     * @param endTime Thời gian kết thúc
     * @return Tổng số tiền (Optional vì có thể không có giao dịch nào)
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.paymentMethod = :paymentMethod AND t.createdAt BETWEEN :startTime AND :endTime")
    Optional<BigDecimal> sumTransactionsByUserIdAndPaymentMethodAndTimeRange(
            @Param("userId") Integer userId,
            @Param("paymentMethod") PaymentMethod paymentMethod,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
} 