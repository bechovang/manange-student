package com.example.eduweb.studentmanage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "financial_accounts")
public class FinancialAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_id", nullable = false)
    private Long studentId;
    
    @Column(name = "current_balance", nullable = false)
    private BigDecimal currentBalance;
    
    @Column(name = "credit_limit")
    private BigDecimal creditLimit;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @ManyToOne
    @JoinColumn(name = "student_id", insertable = false, updatable = false)
    private Student student;
} 