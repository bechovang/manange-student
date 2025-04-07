package com.example.eduweb.studentmanage.repository;

import com.example.eduweb.studentmanage.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
} 