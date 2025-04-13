package com.example.eduweb.managesystem.service;

import com.example.eduweb.managesystem.model.Class;
import com.example.eduweb.managesystem.model.Schedule;
import com.example.eduweb.managesystem.repository.ClassRepository;
import com.example.eduweb.managesystem.repository.ScheduleRepository;
import com.example.eduweb.managesystem.repository.StudentClassRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClassService {

    private final ClassRepository classRepository;
    private final StudentClassRepository studentClassRepository;
    private final ScheduleRepository scheduleRepository;

    public ClassService(ClassRepository classRepository,
                       StudentClassRepository studentClassRepository,
                       ScheduleRepository scheduleRepository) {
        this.classRepository = classRepository;
        this.studentClassRepository = studentClassRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<ClassResponse> getAllClasses() {
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
        response.setTeacherId(classEntity.getTeacher_id());
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