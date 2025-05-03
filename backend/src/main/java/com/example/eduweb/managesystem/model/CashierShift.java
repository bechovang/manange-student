// src/main/java/com/yourpackage/model/CashierShift.java
package com.example.eduweb.managesystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.example.eduweb.managesystem.model.enums.CashierShiftStatus;
import com.example.eduweb.auth.model.User; // Import User từ module auth

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cashier_shifts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // Useful for creating instances easily
public class CashierShift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Nhân viên thu ngân phụ trách ca

    @Column(nullable = false)
    private LocalDateTime shiftStartTime;

    @Column // Nullable until the shift is closed
    private LocalDateTime shiftEndTime;

    @Column(nullable = false, precision = 12, scale = 2, columnDefinition = "decimal(12,2) default 0.00")
    private BigDecimal startingCash;

    @Column(precision = 12, scale = 2) // Nullable until counted
    private BigDecimal endingCashCounted; // Tiền mặt thực tế đếm được

    // --- Calculated fields (populated when closing the shift) ---
    @Column(precision = 12, scale = 2)
    private BigDecimal totalCashReceived; // Tổng tiền mặt thu vào (từ transactions)

    @Column(precision = 12, scale = 2)
    private BigDecimal totalNonCashReceived; // Tổng tiền không phải mặt thu vào

    @Column(precision = 12, scale = 2)
    private BigDecimal calculatedEndingCash; // Tiền mặt LẼ RA phải có

    @Column(precision = 12, scale = 2)
    private BigDecimal cashDiscrepancy; // Chênh lệch (ending_cash_counted - calculated_ending_cash)
    // --- End of calculated fields ---

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CashierShiftStatus status;

    @Column(columnDefinition = "TEXT") // Use TEXT for potentially long notes
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closed_by") // Nullable until closed
    private User closedBy; // Người đóng ca

    @CreationTimestamp // Automatically set by Hibernate on creation
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp // Automatically set by Hibernate on update
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist // Set default status and start time before saving if not set
    protected void onCreate() {
        if (status == null) {
            status = CashierShiftStatus.OPEN;
        }
        if (shiftStartTime == null) {
             shiftStartTime = LocalDateTime.now();
        }
         if (startingCash == null) {
            startingCash = BigDecimal.ZERO;
        }
    }
}