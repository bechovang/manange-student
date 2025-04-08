package com.example.eduweb.managesystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "classes")
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String teacher;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String room;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @OneToMany(mappedBy = "classEntity")
    @JsonIgnore
    private List<StudentClass> studentClasses;

    @OneToMany(mappedBy = "classEntity")
    @JsonIgnore
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "classEntity")
    @JsonIgnore
    private List<TuitionPlan> tuitionPlans;
} 