// src/main/java/com/yourpackage/dto/CashierShiftResponseDto.java
package com.example.eduweb.managesystem.dto;

import com.example.eduweb.managesystem.model.enums.CashierShiftStatus;
import com.example.eduweb.managesystem.model.CashierShift;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CashierShiftResponseDto {
    private Long id;
    private Integer userId;
    private String userName; // Đổi từ userFullName thành userName vì User không có getFullName()
    private LocalDateTime shiftStartTime;
    private LocalDateTime shiftEndTime;
    private BigDecimal startingCash;
    private BigDecimal endingCashCounted;
    private BigDecimal totalCashReceived;
    private BigDecimal totalNonCashReceived;
    private BigDecimal calculatedEndingCash;
    private BigDecimal cashDiscrepancy;
    private CashierShiftStatus status;
    private String notes;
    private Integer closedById;
    private String closedByUserName; // Đổi từ closedByFullName thành closedByUserName
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Static factory method for mapping (or use MapStruct)
    public static CashierShiftResponseDto fromEntity(CashierShift shift) {
        if (shift == null) return null;
        return CashierShiftResponseDto.builder()
                .id(shift.getId())
                .userId(shift.getUser() != null ? shift.getUser().getId() : null)
                .userName(shift.getUser() != null ? shift.getUser().getUsername() : null) // Sử dụng getUsername() thay vì getFullName()
                .shiftStartTime(shift.getShiftStartTime())
                .shiftEndTime(shift.getShiftEndTime())
                .startingCash(shift.getStartingCash())
                .endingCashCounted(shift.getEndingCashCounted())
                .totalCashReceived(shift.getTotalCashReceived())
                .totalNonCashReceived(shift.getTotalNonCashReceived())
                .calculatedEndingCash(shift.getCalculatedEndingCash())
                .cashDiscrepancy(shift.getCashDiscrepancy())
                .status(shift.getStatus())
                .notes(shift.getNotes())
                .closedById(shift.getClosedBy() != null ? shift.getClosedBy().getId() : null)
                .closedByUserName(shift.getClosedBy() != null ? shift.getClosedBy().getUsername() : null) // Sử dụng getUsername() thay vì getFullName()
                .createdAt(shift.getCreatedAt())
                .updatedAt(shift.getUpdatedAt())
                .build();
    }
}