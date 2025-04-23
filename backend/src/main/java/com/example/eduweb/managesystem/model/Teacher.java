package com.example.eduweb.managesystem.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "teachers") // Quan trọng
public class Teacher {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String subject;

    // Quan hệ One-to-Many (tùy chọn)
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<Class> classes;

    // Constructor mặc định
    public Teacher() {}

    // Constructor với tham số
    public Teacher(String name, String subject) {
        this.name = name;
        this.subject = subject;
    }

    // Getter và Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}