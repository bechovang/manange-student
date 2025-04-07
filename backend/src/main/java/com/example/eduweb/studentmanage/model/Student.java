package com.example.eduweb.studentmanage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;
    
    @Column(nullable = false)
    private String gender;
    
    @Column(nullable = false)
    private String school;
    
    @Column(nullable = false)
    private String grade;
    
    @Column(name = "phone_student")
    private String phoneStudent;
    
    @Column(name = "phone_parent")
    private String phoneParent;
    
    @Column(name = "facebook_link")
    private String facebookLink;
    
    private String note;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
} 