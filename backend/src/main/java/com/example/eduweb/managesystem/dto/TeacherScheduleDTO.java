// src/main/java/com/example/eduweb/dto/TeacherScheduleDTO.java
package com.example.eduweb.managesystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherScheduleDTO {
    private Long id;
    private String name;
    private String subject;
    // private String avatar; // Removed as it's not in the DB teacher table
    private Integer colorIndex;
    private String color;
}

