package com.example.eduweb.managesystem.service;

import com.example.eduweb.managesystem.dto.StudentDTO;
import com.example.eduweb.managesystem.model.*;
import com.example.eduweb.managesystem.model.Class;
import com.example.eduweb.managesystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
//import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private FinancialAccountRepository financialAccountRepository;

    public List<StudentDTO> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return convertToDTO(student);
    }

    private StudentDTO convertToDTO(Student student) {
        List<StudentClass> studentClasses = studentClassRepository.findByStudentId(student.getId());
        
        // Lấy danh sách môn học và lớp đang học
        List<Class> classes = new ArrayList<>();
        for (StudentClass sc : studentClasses) {
            classRepository.findById(sc.getClassId()).ifPresent(classes::add);
        }

        // Lấy thông tin tài chính
        Optional<FinancialAccount> financialAccount = financialAccountRepository.findByStudentId(student.getId());
        BigDecimal balance = financialAccount.map(FinancialAccount::getCurrentBalance).orElse(BigDecimal.ZERO);
        
        // Tính số tháng còn lại dựa trên số dư (giả định học phí trung bình 1.5 triệu/tháng)
        BigDecimal monthlyTuition = new BigDecimal("1500000");
        Integer balanceMonths = balance.divide(monthlyTuition, 0, RoundingMode.FLOOR).intValue();
        
        // Tìm lịch học
        String classTime = "";
        if (!classes.isEmpty()) {
            Class mainClass = classes.get(0);
            List<Schedule> schedules = scheduleRepository.findByClassId(mainClass.getId());
            if (!schedules.isEmpty()) {
                Schedule schedule = schedules.get(0);
                String weekday = translateWeekday(schedule.getWeekday());
                String timeStart = schedule.getTimeStart().toString().substring(0, 5);
                classTime = weekday + " " + timeStart;
            }
        }
        
        // Tìm lớp chính và giáo viên chính
        String teacher = classes.isEmpty() ? "" : classes.get(0).getTeacher();
        
        // Ngày nhập học
        String enrollmentDate = "";
        if (!studentClasses.isEmpty()) {
            StudentClass firstClass = studentClasses.get(0);
            enrollmentDate = firstClass.getEnrollmentDate() != null ? 
                    firstClass.getEnrollmentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "";
        }
        
        // Trạng thái học sinh
        String status = studentClasses.isEmpty() ? "inactive" : 
                studentClasses.stream().anyMatch(sc -> "active".equals(sc.getStatus())) ? "active" : "inactive";
        
        // Tạo ID format STUxxx
        String studentId = "STU" + String.format("%03d", student.getId());
        
        return StudentDTO.builder()
                .id(studentId)
                .name(student.getName())
                .phone(student.getPhoneStudent())
                .parentPhone(student.getPhoneParent())
                .facebook(student.getFacebookLink())
                .school(student.getSchool())
                .subjects(classes.stream().map(Class::getSubject).collect(Collectors.toList()))
                .grade(student.getGrade())
                .teacher(teacher)
                .classTime(classTime)
                .status(status)
                .notes(student.getNote())
                .avatar("/placeholder.svg?height=40&width=40")
                .enrollmentDate(enrollmentDate)
                .balance(balance)
                .balanceMonths(balanceMonths)
                .build();
    }
    
    private String translateWeekday(String weekday) {
        return switch (weekday.toLowerCase()) {
            case "mon" -> "Thứ 2";
            case "tue" -> "Thứ 3";
            case "wed" -> "Thứ 4";
            case "thu" -> "Thứ 5";
            case "fri" -> "Thứ 6";
            case "sat" -> "Thứ 7";
            case "sun" -> "CN";
            default -> weekday;
        };
    }
} 