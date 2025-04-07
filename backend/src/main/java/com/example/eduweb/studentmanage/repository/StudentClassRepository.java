package com.example.eduweb.studentmanage.repository;

import com.example.eduweb.studentmanage.model.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, Long> {
    List<StudentClass> findByStudentId(Long studentId);
} 