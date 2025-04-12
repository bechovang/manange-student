package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.StudentClass;
import com.example.eduweb.managesystem.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, Long> {
    
    // Lấy danh sách lớp của một học sinh
    List<StudentClass> findByStudent(Student student);

    // Lấy danh sách học sinh của một lớp
    List<StudentClass> findByClassEntityId(Long classId);

    // Lấy danh sách lớp của học sinh với trạng thái cụ thể
    List<StudentClass> findByStudentAndStatus(Student student, String status);

    // Lấy danh sách học sinh của lớp với trạng thái cụ thể
    List<StudentClass> findByClassEntityIdAndStatus(Long classId, String status);

    // Kiểm tra xem học sinh đã đăng ký lớp chưa
    boolean existsByStudentAndClassEntityId(Student student, Long classId);

    // Lấy số lượng học sinh đang học trong một lớp
    @Query("SELECT COUNT(sc) FROM StudentClass sc WHERE sc.classEntity.id = :classId")
    Integer countStudentsByClassId(@Param("classId") Long classId);

    // Lấy danh sách học sinh đăng ký trong khoảng thời gian
    @Query("SELECT sc FROM StudentClass sc WHERE sc.enrollmentDate BETWEEN :startDate AND :endDate")
    List<StudentClass> findEnrollmentsBetweenDates(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}