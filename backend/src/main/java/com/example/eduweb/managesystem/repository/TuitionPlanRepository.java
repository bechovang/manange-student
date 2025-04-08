package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.TuitionPlan;
import com.example.eduweb.managesystem.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TuitionPlanRepository extends JpaRepository<TuitionPlan, Long> {
    
    // Tìm học phí hiện tại cho một lớp
    Optional<TuitionPlan> findByClassEntityAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
        Class classEntity, 
        LocalDate currentDate
    );

    // Lấy lịch sử học phí của một lớp
    List<TuitionPlan> findByClassEntityOrderByEffectiveDateDesc(Class classEntity);

    // Lấy tất cả học phí có hiệu lực trong một khoảng thời gian
    @Query("SELECT tp FROM TuitionPlan tp WHERE tp.effectiveDate BETWEEN :startDate AND :endDate")
    List<TuitionPlan> findAllByEffectiveDateBetween(
        @Param("startDate") LocalDate startDate, 
        @Param("endDate") LocalDate endDate
    );

    // Kiểm tra xem đã có học phí cho lớp trong ngày hiệu lực chưa
    boolean existsByClassEntityAndEffectiveDate(Class classEntity, LocalDate effectiveDate);
}