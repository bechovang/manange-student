package com.example.eduweb.managesystem.service;

import com.example.eduweb.managesystem.exception.ResourceNotFoundException;
import com.example.eduweb.managesystem.model.Class;
import com.example.eduweb.managesystem.model.Schedule;
import com.example.eduweb.managesystem.repository.ClassRepository;
import com.example.eduweb.managesystem.repository.ScheduleRepository;
import com.example.eduweb.managesystem.repository.StudentClassRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClassService {

    private final ClassRepository classRepository;
    private final StudentClassRepository studentClassRepository;
    private final ScheduleRepository scheduleRepository;

    @Transactional
    public Class getClassWithSchedules(Long classId) {
        Class classEntity = classRepository.findWithSchedulesById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
                
        // Check if the class has any schedules and delete it if not
        if (classEntity.getSchedules() == null || classEntity.getSchedules().isEmpty()) {
            classRepository.delete(classEntity);
            throw new ResourceNotFoundException("Class has no schedules and has been deleted");
        }
        
        return classEntity;
    }

    /**
     * Cleans up all classes that don't have any schedules.
     * @return The number of classes deleted
     */
    @Transactional
    public int cleanupClassesWithNoSchedules() {
        int deletedCount = 0;
        List<Class> allClasses = classRepository.findAll();
        
        for (Class classEntity : allClasses) {
            // Force loading of schedules if they're lazily loaded
            List<Schedule> schedules = scheduleRepository.findByClassEntityId(classEntity.getId());
            
            if (schedules == null || schedules.isEmpty()) {
                classRepository.delete(classEntity);
                deletedCount++;
            }
        }
        
        return deletedCount;
    }

    /**
     * Gộp tất cả các lớp có cùng tên vào một lớp và xóa các lớp còn lại.
     * @return Số lượng lớp đã bị xóa sau khi gộp
     */
    @Transactional
    public int mergeClassesWithSameName() {
        int deletedCount = 0;
        // Lấy danh sách tất cả các lớp
        List<Class> allClasses = classRepository.findAll();
        
        // Tạo map để nhóm các lớp theo tên
        Map<String, List<Class>> classesByName = allClasses.stream()
                .collect(Collectors.groupingBy(Class::getName));
        
        // Xử lý từng nhóm lớp có cùng tên
        for (Map.Entry<String, List<Class>> entry : classesByName.entrySet()) {
            List<Class> classesWithSameName = entry.getValue();
            
            // Nếu chỉ có 1 lớp với tên này, không cần gộp
            if (classesWithSameName.size() <= 1) {
                continue;
            }
            
            // Chọn lớp đầu tiên để giữ lại
            Class primaryClass = classesWithSameName.get(0);
            
            // Lặp qua các lớp còn lại để chuyển lịch học và xóa lớp
            for (int i = 1; i < classesWithSameName.size(); i++) {
                Class duplicateClass = classesWithSameName.get(i);
                
                // Lấy tất cả lịch học của lớp trùng lặp
                List<Schedule> schedules = scheduleRepository.findByClassEntityId(duplicateClass.getId());
                
                // Chuyển từng lịch học sang lớp chính
                for (Schedule schedule : schedules) {
                    schedule.setClassEntity(primaryClass);
                    scheduleRepository.save(schedule);
                }
                
                // Xóa lớp trùng lặp
                classRepository.delete(duplicateClass);
                deletedCount++;
                
                System.out.println("Đã gộp lớp ID " + duplicateClass.getId() + 
                                  " vào lớp ID " + primaryClass.getId() + 
                                  " (cùng tên: " + primaryClass.getName() + ")");
            }
        }
        
        return deletedCount;
    }

    public ClassService(ClassRepository classRepository,
                       StudentClassRepository studentClassRepository,
                       ScheduleRepository scheduleRepository) {
        this.classRepository = classRepository;
        this.studentClassRepository = studentClassRepository;
        this.scheduleRepository = scheduleRepository;
    }

    /**
     * Chạy tự động khi lấy danh sách lớp học để làm sạch dữ liệu
     */
    public List<ClassResponse> getAllClasses() {
        // Gộp các lớp trùng tên trước
        int mergedCount = mergeClassesWithSameName();
        if (mergedCount > 0) {
            System.out.println("Đã gộp " + mergedCount + " lớp trùng tên");
        }
        
        // Xóa các lớp không có lịch học
        int deletedCount = cleanupClassesWithNoSchedules();
        if (deletedCount > 0) {
            System.out.println("Đã xóa " + deletedCount + " lớp không có lịch học");
        }
        
        // Lấy danh sách lớp đã được làm sạch
        return classRepository.findAll().stream()
                .map(this::convertToClassResponse)
                .collect(Collectors.toList());
    }

    public Optional<ClassResponse> getClassById(Long id) {
        return classRepository.findById(id)
                .map(this::convertToClassResponse);
    }

    private ClassResponse convertToClassResponse(Class classEntity) {
        ClassResponse response = new ClassResponse();
        response.setId(classEntity.getId().toString());
        response.setName(classEntity.getName());
        response.setTeacherId(classEntity.getTeacher().getId());
        response.setStudents(getStudentCountByClassId(classEntity.getId()));
        response.setSchedule(getScheduleByClassId(classEntity.getId()));
        response.setStatus(determineClassStatus(classEntity));
        return response;
    }

    private int getStudentCountByClassId(Long classId) {
        return studentClassRepository.countStudentsByClassId(classId);
    }

    private String getScheduleByClassId(Long classId) {
        List<Schedule> schedules = scheduleRepository.findByClassEntityId(classId);
        if (schedules.isEmpty()) {
            return "Chưa có lịch học";
        }

        return schedules.stream()
                .map(this::formatSchedule)
                .collect(Collectors.joining(", "));
    }

    private String formatSchedule(Schedule schedule) {
        String dayName = convertWeekday(schedule.getWeekday());
        String timeRange = formatTimeRange(schedule.getTimeStart(), schedule.getTimeEnd());
        return dayName + " " + timeRange;
    }

    private String convertWeekday(String weekday) {
        switch (weekday.toLowerCase()) {
            case "mon": return "Thứ 2";
            case "tue": return "Thứ 3";
            case "wed": return "Thứ 4";
            case "thu": return "Thứ 5";
            case "fri": return "Thứ 6";
            case "sat": return "Thứ 7";
            case "sun": return "Chủ nhật";
            default: return weekday;
        }
    }

    private String formatTimeRange(LocalTime start, LocalTime end) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return "(" + start.format(formatter) + " - " + end.format(formatter) + ")";
    }

    private String determineClassStatus(Class classEntity) {
        return "active"; // TODO: change to the correct status.default is active
    }

    public static class ClassResponse {
        private String id;
        private String name;
        private Long teacherId;
        private Integer students;
        private String schedule;
        private String status;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Long getTeacherId() { return teacherId; }
        public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
        public Integer getStudents() { return students; }
        public void setStudents(Integer students) { this.students = students; }
        public String getSchedule() { return schedule; }
        public void setSchedule(String schedule) { this.schedule = schedule; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}