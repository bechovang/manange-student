package com.example.eduweb.studentmanage.repository;

import com.example.eduweb.studentmanage.model.FinancialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinancialAccountRepository extends JpaRepository<FinancialAccount, Long> {
    Optional<FinancialAccount> findByStudentId(Long studentId);
} 