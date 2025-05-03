// src/main/java/com/yourpackage/dto/StartShiftRequestDto.java
package com.example.eduweb.managesystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class StartShiftRequestDto {

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Starting cash cannot be null")
    @PositiveOrZero(message = "Starting cash must be zero or positive")
    private BigDecimal startingCash;
}

