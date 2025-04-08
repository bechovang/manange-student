package com.example.eduweb.managesystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
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
    private LocalDate createdAt;

    @OneToMany(mappedBy = "student")
    @JsonIgnore
    private List<StudentClass> studentClasses;

    @OneToMany(mappedBy = "student")
    @JsonIgnore
    private List<Payment> payments;

    // Transient fields for calculations
    @Transient
    private double balance;

    @Transient
    private int balanceMonths;

    // Transient fields for display
    @Transient
    private String teacher;

    @Transient
    private String classTime;

    @Transient
    private String status;

    @Transient
    private List<String> subjects;
} 