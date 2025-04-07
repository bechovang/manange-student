package com.example.eduweb.studentmanage.repository;

import com.example.eduweb.studentmanage.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByClassId(Long classId);
} 