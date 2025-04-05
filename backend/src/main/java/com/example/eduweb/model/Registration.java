package com.example.eduweb.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

@Entity
@Table(name = "registrations")
@Getter
@Setter
@NoArgsConstructor
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String fullName;

    @Column(length = 20)
    private String studentPhone;

    @Column(length = 20)
    private String parentPhone;

    @Column(columnDefinition = "TEXT")
    private String facebookLink;

    @Column(nullable = false, length = 255)
    private String school;

    @Column(nullable = false, length = 50)
    private String subject;

    @Column(nullable = false, length = 10)
    private String grade;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date(); // Lưu theo UTC
    }

}