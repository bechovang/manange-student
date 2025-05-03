package com.example.eduweb.managesystem.model;

import com.example.eduweb.managesystem.model.enums.PaymentMethod;
import com.example.eduweb.auth.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Nhân viên thực hiện giao dịch

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount; // Số tiền giao dịch

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod; // Phương thức thanh toán (CASH, CREDIT_CARD, v.v.)

    @Column(length = 50)
    private String referenceNumber; // Số tham chiếu (nếu có - dùng cho thanh toán điện tử, chuyển khoản...)

    @Column(columnDefinition = "TEXT")
    private String description; // Mô tả giao dịch

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student; // Học sinh liên quan (nếu có)

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // Thời gian tạo giao dịch

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt; // Thời gian cập nhật gần nhất
} 