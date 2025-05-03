// src/main/java/com/yourpackage/repository/CashierShiftRepository.java
package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.CashierShift;
import com.example.eduweb.managesystem.model.enums.CashierShiftStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CashierShiftRepository extends JpaRepository<CashierShift, Long> {

    // Find shifts by user ID
    List<CashierShift> findByUserId(Long userId);

    // Find shifts by status
    List<CashierShift> findByStatus(CashierShiftStatus status);

    // Find an OPEN shift for a specific user (important for preventing duplicates)
    Optional<CashierShift> findByUserIdAndStatus(Long userId, CashierShiftStatus status);

     // Optional: Find the most recent shift for a user (could be open or closed)
    Optional<CashierShift> findTopByUserIdOrderByShiftStartTimeDesc(Long userId);

    // You might need more specific queries later, e.g., finding shifts within a date range
    // List<CashierShift> findByShiftStartTimeBetween(LocalDateTime start, LocalDateTime end);
}