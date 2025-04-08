package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.Schedule;
import com.example.eduweb.managesystem.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByClassEntityId(Long classId);
    List<Schedule> findByClassEntity(Class classEntity);
} 