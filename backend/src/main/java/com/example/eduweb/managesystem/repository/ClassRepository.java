package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
} 