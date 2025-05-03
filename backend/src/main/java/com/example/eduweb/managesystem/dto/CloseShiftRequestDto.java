// src/main/java/com/yourpackage/dto/CloseShiftRequestDto.java
package com.example.eduweb.managesystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CloseShiftRequestDto {

    @NotNull(message = "Ending cash counted cannot be null")
    @PositiveOrZero(message = "Ending cash counted must be zero or positive")
    private BigDecimal endingCashCounted;

    private String notes; // Optional notes about the closing

    @NotNull(message = "Closing user ID cannot be null")
    private Long closedByUserId; // ID of the user performing the closing action
}


