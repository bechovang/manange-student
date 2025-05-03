package com.example.eduweb.managesystem.repository;

import com.example.eduweb.managesystem.model.Schedule;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Tìm lịch học theo lớp (chỉ ID)
    List<Schedule> findByClassEntityId(Long classId);

    // Tìm tất cả lịch học với thông tin lớp và giáo viên
    @EntityGraph(attributePaths = {"classEntity", "classEntity.teacher"})
    @Query("SELECT DISTINCT s FROM Schedule s ORDER BY s.id")
    List<Schedule> findAllWithDetails();

    // Tìm lịch học theo ngày trong tuần
    List<Schedule> findByWeekday(String weekday);

    // Tìm lịch học theo lớp (id))
    List<Schedule> findByClassEntity_Id(Long classId);

      // Tìm lịch học theo lớp (đối tượng)
    // Sửa lại phương thức findByClassEntity với tham số rõ ràng
    // @EntityGraph(attributePaths = {"classEntity"})
    // List<Schedule> findByClassEntity(com.example.eduweb.managesystem.model.Class classEntity);

}