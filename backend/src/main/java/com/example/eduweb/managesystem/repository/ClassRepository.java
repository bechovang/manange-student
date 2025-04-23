package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.Class;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {

    // Tìm lớp với thông tin giáo viên và lịch học
    @EntityGraph(attributePaths = {"teacher", "schedules"})
    @Query("SELECT DISTINCT c FROM Class c WHERE c.id = :id")
    Optional<Class> findByIdWithDetails(@Param("id") Long id);

    // Tìm tất cả lớp với thông tin giáo viên
    @EntityGraph(attributePaths = {"teacher"})
    @Query("SELECT DISTINCT c FROM Class c")
    List<Class> findAllWithTeacher();

    // Tìm lớp với lịch học
    @EntityGraph(attributePaths = {"schedules"})
    @Query("SELECT DISTINCT c FROM Class c WHERE c.id = :id")
    Optional<Class> findWithSchedulesById(@Param("id") Long id);

    // Tìm lớp theo giáo viên
    List<Class> findByTeacherId(Long teacherId);
}