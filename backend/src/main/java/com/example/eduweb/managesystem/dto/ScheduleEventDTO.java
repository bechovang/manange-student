
// src/main/java/com/example/eduweb/dto/ScheduleEventDTO.java
package com.example.eduweb.managesystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleEventDTO {
    private Long id; // Corresponds to schedule.id

    // Fields derived from the Class entity
    private String title; // Mapped from Class.name
    private Long teacherId; // Mapped from Class.teacher.id
    private String room; // Mapped from Class.room

    // Fields from the Schedule entity
    @NotNull(message = "Class ID is required for schedule entry")
    private Long classId; // Need classId to create/update a schedule entry

    @NotNull(message = "Weekday is required")
    @Pattern(regexp = "^(mon|tue|wed|thu|fri|sat|sun)$", message = "Weekday must be one of: mon, tue, wed, thu, fri, sat, sun")
    private String weekday; // "mon", "tue", etc.

    @NotNull(message = "Start time is required")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Start time must be in HH:mm format")
    private String startTime; // "HH:mm"

    @NotNull(message = "End time is required")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "End time must be in HH:mm format")
    private String endTime;  // "HH:mm"

    // --- Frontend specific fields (for GET responses) ---
    private Integer day; // 0-6 - This will be calculated in the service layer for GET requests
}