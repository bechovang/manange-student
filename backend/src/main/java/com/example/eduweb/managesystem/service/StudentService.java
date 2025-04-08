package com.example.eduweb.managesystem.service;

import com.example.eduweb.managesystem.model.Student;
import com.example.eduweb.managesystem.model.StudentClass;
import com.example.eduweb.managesystem.model.TuitionPlan;
import com.example.eduweb.managesystem.model.Class;
import com.example.eduweb.managesystem.model.Schedule;
import com.example.eduweb.managesystem.repository.StudentRepository;
import com.example.eduweb.managesystem.repository.StudentClassRepository;
import com.example.eduweb.managesystem.repository.TuitionPlanRepository;
import com.example.eduweb.managesystem.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.ArrayList;

/**
 * Service class for handling student-related operations
 * This service manages student data and their relationships with classes and schedules
 */
@Service
public class StudentService {
    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private TuitionPlanRepository tuitionPlanRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    private final Random random = new Random();

    /**
     * Lấy danh sách môn học của học sinh dựa trên các lớp đang học
     */
    private List<String> getSubjectsForStudent(Student student) {
        try {
            logger.debug("Getting subjects for student: {}", student.getId());
            List<StudentClass> studentClasses = studentClassRepository.findByStudent(student);
            List<String> subjects = new ArrayList<>();
            
            for (StudentClass studentClass : studentClasses) {
                Class classEntity = studentClass.getClassEntity();
                if (classEntity != null && classEntity.getSubject() != null) {
                    subjects.add(classEntity.getSubject());
                }
            }
            
            logger.debug("Found {} subjects for student {}", subjects.size(), student.getId());
            return subjects.isEmpty() ? new ArrayList<>() : subjects;
        } catch (Exception e) {
            logger.error("Error getting subjects for student {}: {}", student.getId(), e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Gets the teacher name for a student based on their enrolled classes
     * @param student The student to get teacher for
     * @return Teacher name or null if not found
     */
    private String getTeacherForStudent(Student student) {
        try {
            logger.debug("Getting teacher for student: {}", student.getId());
            List<StudentClass> studentClasses = studentClassRepository.findByStudent(student);
            
            if (!studentClasses.isEmpty()) {
                Class classEntity = studentClasses.get(0).getClassEntity();
                if (classEntity != null && classEntity.getTeacher() != null) {
                    logger.debug("Found teacher {} for student {}", classEntity.getTeacher(), student.getId());
                    return classEntity.getTeacher();
                }
            }
            logger.debug("No teacher found for student: {}", student.getId());
            return "Chưa có giáo viên";
        } catch (Exception e) {
            logger.error("Error getting teacher for student {}: {}", student.getId(), e.getMessage());
            return "Chưa có giáo viên";
        }
    }

    /**
     * Gets the class time for a student based on their enrolled classes
     * @param student The student to get class time for
     * @return Class time string or null if not found
     */
    private String getClassTimeForStudent(Student student) {
        try {
            logger.debug("Getting class time for student: {}", student.getId());
            List<StudentClass> studentClasses = studentClassRepository.findByStudent(student);
            
            if (!studentClasses.isEmpty()) {
                Class classEntity = studentClasses.get(0).getClassEntity();
                if (classEntity != null) {
                    List<Schedule> schedules = scheduleRepository.findByClassEntity(classEntity);
                    if (!schedules.isEmpty()) {
                        Schedule schedule = schedules.get(0);
                        String classTime = schedule.getTimeStart() + " - " + schedule.getTimeEnd();
                        logger.debug("Found class time {} for student {}", classTime, student.getId());
                        return classTime;
                    }
                }
            }
            logger.debug("No class time found for student: {}", student.getId());
            return "Chưa có lịch học";
        } catch (Exception e) {
            logger.error("Error getting class time for student {}: {}", student.getId(), e.getMessage());
            return "Chưa có lịch học";
        }
    }

    /**
     * Generates a random status for a student
     * @return Random status string
     */
    private String generateRandomStatus() {
        String[] statuses = {"present", "absent", "no class"};
        String status = statuses[random.nextInt(statuses.length)];
        logger.debug("Generated random status: {}", status);
        return status;
    }

    /**
     * Retrieves all students with their associated information
     * @return List of all students
     * @throws RuntimeException if there's an error fetching students
     */
    public List<Student> getAllStudents() {
        try {
            logger.info("Fetching all students");
            List<Student> students = studentRepository.findAll();
            
            for (Student student : students) {
                // Cập nhật thông tin từ các bảng liên quan
                student.setTeacher(getTeacherForStudent(student));
                student.setClassTime(getClassTimeForStudent(student));
                student.setStatus(generateRandomStatus());
                
                // Cập nhật danh sách môn học
                student.setSubjects(getSubjectsForStudent(student));
                
                // Tính toán balance và balanceMonths
                student.setBalance(calculateBalance(student));
                student.setBalanceMonths(calculateBalanceMonths(student));
            }
            
            logger.info("Successfully fetched {} students", students.size());
            return students;
        } catch (Exception e) {
            logger.error("Error fetching all students: {}", e.getMessage());
            throw new RuntimeException("Error fetching students: " + e.getMessage());
        }
    }

    /**
     * Retrieves a student by their ID
     * @param id The student ID
     * @return Student object or null if not found
     * @throws RuntimeException if there's an error fetching the student
     */
    public Student getStudentById(Long id) {
        try {
            logger.info("Fetching student with ID: {}", id);
            Student student = studentRepository.findById(id).orElse(null);
            
            if (student != null) {
                student.setTeacher(getTeacherForStudent(student));
                student.setClassTime(getClassTimeForStudent(student));
                student.setStatus(generateRandomStatus());
                logger.info("Successfully fetched student: {}", id);
            } else {
                logger.warn("Student not found with ID: {}", id);
            }
            
            return student;
        } catch (Exception e) {
            logger.error("Error fetching student {}: {}", id, e.getMessage());
            throw new RuntimeException("Error fetching student: " + e.getMessage());
        }
    }

    /**
     * Creates a new student
     * @param student The student to create
     * @return The created student
     * @throws RuntimeException if there's an error creating the student
     */
    public Student createStudent(Student student) {
        try {
            logger.info("Creating new student");
            Student savedStudent = studentRepository.save(student);
            logger.info("Successfully created student with ID: {}", savedStudent.getId());
            return savedStudent;
        } catch (Exception e) {
            logger.error("Error creating student: {}", e.getMessage());
            throw new RuntimeException("Error creating student: " + e.getMessage());
        }
    }

    /**
     * Updates an existing student
     * @param id The student ID
     * @param studentDetails The updated student details
     * @return The updated student or null if not found
     * @throws RuntimeException if there's an error updating the student
     */
    public Student updateStudent(Long id, Student studentDetails) {
        try {
            logger.info("Updating student with ID: {}", id);
            Student student = studentRepository.findById(id).orElse(null);
            
            if (student != null) {
                student.setName(studentDetails.getName());
                student.setPhoneStudent(studentDetails.getPhoneStudent());
                student.setPhoneParent(studentDetails.getPhoneParent());
                student.setFacebookLink(studentDetails.getFacebookLink());
                student.setSchool(studentDetails.getSchool());
                student.setGrade(studentDetails.getGrade());
                student.setNote(studentDetails.getNote());
                
                Student updatedStudent = studentRepository.save(student);
                logger.info("Successfully updated student: {}", id);
                return updatedStudent;
            }
            
            logger.warn("Student not found for update: {}", id);
            return null;
        } catch (Exception e) {
            logger.error("Error updating student {}: {}", id, e.getMessage());
            throw new RuntimeException("Error updating student: " + e.getMessage());
        }
    }

    /**
     * Deletes a student
     * @param id The student ID
     * @throws RuntimeException if there's an error deleting the student
     */
    public void deleteStudent(Long id) {
        try {
            logger.info("Deleting student with ID: {}", id);
            studentRepository.deleteById(id);
            logger.info("Successfully deleted student: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting student {}: {}", id, e.getMessage());
            throw new RuntimeException("Error deleting student: " + e.getMessage());
        }
    }

    /**
     * Tính tổng học phí hàng tháng của học sinh
     * Dựa trên các lớp học mà học sinh đang tham gia
     */
    private double calculateMonthlyTuition(Student student) {
        List<StudentClass> studentClasses = studentClassRepository.findByStudent(student);
        double totalMonthlyTuition = 0.0;

        for (StudentClass studentClass : studentClasses) {
            Optional<TuitionPlan> tuitionPlanOpt = tuitionPlanRepository
                .findByClassEntityAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
                    studentClass.getClassEntity(),
                    LocalDate.now()
                );
            
            if (tuitionPlanOpt.isPresent()) {
                totalMonthlyTuition += tuitionPlanOpt.get().getAmount().doubleValue();
            }
        }

        return totalMonthlyTuition;
    }

    /**
     * Tính số tiền dư/nợ của học sinh
     * Balance = Tổng tiền đã đóng - Tổng tiền phải đóng
     */
    private double calculateBalance(Student student) {
        double monthlyTuition = calculateMonthlyTuition(student);
        LocalDate enrollmentDate = student.getCreatedAt();
        LocalDate currentDate = LocalDate.now();

        // Tính số tháng từ ngày nhập học đến hiện tại
        long months = ChronoUnit.MONTHS.between(enrollmentDate, currentDate);

        // Tính tổng số tiền phải đóng
        double totalAmount = monthlyTuition * months;

        // Lấy tổng số tiền đã đóng từ các payment
        double totalPaid = student.getPayments().stream()
                .mapToDouble(payment -> payment.getAmount().doubleValue())
                .sum();

        // Balance = Tổng đã đóng - Tổng phải đóng
        return totalPaid - totalAmount;
    }

    /**
     * Tính số tháng dư/nợ của học sinh
     * BalanceMonths = Balance / MonthlyTuition
     */
    private int calculateBalanceMonths(Student student) {
        double balance = calculateBalance(student);
        double monthlyTuition = calculateMonthlyTuition(student);

        if (monthlyTuition == 0) {
            return 0;
        }

        // Số tháng dư/nợ = Balance / MonthlyTuition
        return (int) Math.round(balance / monthlyTuition);
    }
}