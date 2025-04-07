package com.example.eduweb.managesystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private String id;
    private String name;
    private String phone;
    private String parentPhone;
    private String facebook;
    private String school;
    private List<String> subjects;
    private String grade;
    private String teacher;
    private String classTime;
    private String status;
    private String notes;
    private String avatar;
    private String enrollmentDate;
    private BigDecimal balance;
    private Integer balanceMonths;
} 