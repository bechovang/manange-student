package com.example.eduweb.studentmanage.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "class_id")
    private Long classId;
    
    @Column(nullable = false)
    private String weekday;
    
    @Column(name = "time_start", nullable = false)
    private LocalTime timeStart;
    
    @Column(name = "time_end", nullable = false)
    private LocalTime timeEnd;
    
    @ManyToOne
    @JoinColumn(name = "class_id", insertable = false, updatable = false)
    private Class classEntity;
} 