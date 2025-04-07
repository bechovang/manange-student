package com.example.eduweb.studentmanage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_classes")
public class StudentClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_id")
    private Long studentId;
    
    @Column(name = "class_id")
    private Long classId;
    
    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;
    
    @Column
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "student_id", insertable = false, updatable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "class_id", insertable = false, updatable = false)
    private Class classEntity;
} 