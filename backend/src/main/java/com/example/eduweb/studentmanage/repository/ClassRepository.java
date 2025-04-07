package com.example.eduweb.studentmanage.repository;

import com.example.eduweb.studentmanage.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
} 