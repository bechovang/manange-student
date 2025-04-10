package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    

    
    // JPQL query to get teacher name by ID (recommended)
    @Query("SELECT t.name FROM Teacher t WHERE t.id = :teacherId")
    Optional<String> findNameById(@Param("teacherId") Long teacherId);
}