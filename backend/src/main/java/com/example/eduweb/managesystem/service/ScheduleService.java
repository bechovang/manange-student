// src/main/java/com/example/eduweb/service/ScheduleService.java
package com.example.eduweb.managesystem.service;

import com.example.eduweb.managesystem.dto.ScheduleEventDTO;
import com.example.eduweb.managesystem.exception.ResourceNotFoundException;
import com.example.eduweb.managesystem.model.Class; // Import Class
import com.example.eduweb.managesystem.model.Schedule;
import com.example.eduweb.managesystem.repository.ClassRepository; // Import ClassRepository
import com.example.eduweb.managesystem.repository.ScheduleRepository;
import com.example.eduweb.managesystem.model.Teacher;
import com.example.eduweb.managesystem.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ClassRepository classRepository; // Need ClassRepository

    @Autowired
    private TeacherRepository teacherRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    // Mapping from weekday string to frontend integer day
    private static final Map<String, Integer> WEEKDAY_TO_DAY_INT = Map.of(
            "sun", 0, "mon", 1, "tue", 2, "wed", 3, "thu", 4, "fri", 5, "sat", 6
    );

    // Mapping from frontend integer day to weekday string
    private static final Map<Integer, String> DAY_INT_TO_WEEKDAY = new HashMap<>();
    static {
        WEEKDAY_TO_DAY_INT.forEach((key, value) -> DAY_INT_TO_WEEKDAY.put(value, key));
    }

    // New mapping for frontend string day format to weekday string
    private static final Map<String, String> DAY_STRING_TO_WEEKDAY = Map.of(
            "2", "mon", "3", "tue", "4", "wed", "5", "thu", 
            "6", "fri", "7", "sat", "cn", "sun"
    );

    @Transactional(readOnly = true)
    public List<ScheduleEventDTO> getAllScheduleEvents() {
        // Use query that fetches details to avoid N+1
        return scheduleRepository.findAllWithDetails().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScheduleEventDTO getScheduleEventById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));
        // You might need to fetch class details explicitly if not using a custom query
        // or ensure lazy loading works within the transaction.
        // Class classEntity = schedule.getClassEntity(); // Access within transaction
        return mapToDTO(schedule);
    }

    @Transactional
    public ScheduleEventDTO createScheduleEvent(ScheduleEventDTO scheduleEventDTO) {
        Schedule schedule;
        Class classEntity;
        
        // Check if we should use an existing class or create a new one
        if (scheduleEventDTO.getClassId() != null) {
            // Use existing class
            classEntity = classRepository.findById(scheduleEventDTO.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class", "id", scheduleEventDTO.getClassId()));
        } else {
            // Check if a class with the same name already exists
            String className = scheduleEventDTO.getTitle();
            Optional<Class> existingClass = classRepository.findByName(className);
            
            if (existingClass.isPresent()) {
                // Use the existing class
                classEntity = existingClass.get();
            } else {
                // Find the teacher first to get the subject
                Teacher teacher = teacherRepository.findById(scheduleEventDTO.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", scheduleEventDTO.getTeacherId()));
                    
                // Create a new Class entity from DTO data
                classEntity = new Class();
                classEntity.setName(scheduleEventDTO.getTitle());
                classEntity.setRoom(scheduleEventDTO.getRoom());
                classEntity.setTeacher(teacher);
                
                // Get subject from the teacher
                classEntity.setSubject(teacher.getSubject());
                
                // Save the new Class entity
                classEntity = classRepository.save(classEntity);
            }
        }

        // Create new Schedule entity
        schedule = new Schedule();
        schedule.setClassEntity(classEntity);
        schedule.setWeekday(scheduleEventDTO.getWeekday());
        schedule.setTimeStart(LocalTime.parse(scheduleEventDTO.getStartTime(), TIME_FORMATTER));
        schedule.setTimeEnd(LocalTime.parse(scheduleEventDTO.getEndTime(), TIME_FORMATTER));

        // Handle date range if provided
        if (scheduleEventDTO.getStartDate() != null) {
            schedule.setStartDate(java.time.LocalDate.parse(scheduleEventDTO.getStartDate()));
        }
        
        if (scheduleEventDTO.getEndDate() != null) {
            schedule.setEndDate(java.time.LocalDate.parse(scheduleEventDTO.getEndDate()));
        }

        // Save the new Schedule entity
        Schedule savedSchedule = scheduleRepository.save(schedule);

        // Map back to DTO for the response
        return mapToDTO(savedSchedule);
    }

    @Transactional
    public ScheduleEventDTO updateScheduleEvent(Long id, ScheduleEventDTO scheduleEventDTO) {
        // 1. Find the existing Schedule entry
        Schedule existingSchedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));

        // 2. Get the current class entity
        Class currentClassEntity = existingSchedule.getClassEntity();
        
        // 3. Check if we need to update the class or create a new one
        if (scheduleEventDTO.getClassId() != null && !scheduleEventDTO.getClassId().equals(currentClassEntity.getId())) {
            // Different class ID - use the specified class
            Class newClassEntity = classRepository.findById(scheduleEventDTO.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class", "id", scheduleEventDTO.getClassId()));
            existingSchedule.setClassEntity(newClassEntity);
        } else if (scheduleEventDTO.getTitle() != null && !scheduleEventDTO.getTitle().equals(currentClassEntity.getName())) {
            // Title changed but no explicit class ID - check if we need to update or find existing class
            Optional<Class> existingClass = classRepository.findByName(scheduleEventDTO.getTitle());
            
            if (existingClass.isPresent()) {
                // Use existing class with this name
                existingSchedule.setClassEntity(existingClass.get());
            } else {
                // Update the current class name
                currentClassEntity.setName(scheduleEventDTO.getTitle());
                
                // Update room if provided
                if (scheduleEventDTO.getRoom() != null) {
                    currentClassEntity.setRoom(scheduleEventDTO.getRoom());
                }
                
                // Update teacher if teacherId is provided and different
                if (scheduleEventDTO.getTeacherId() != null && 
                    (currentClassEntity.getTeacher() == null || 
                     !scheduleEventDTO.getTeacherId().equals(currentClassEntity.getTeacher().getId()))) {
                    
                    Teacher newTeacher = teacherRepository.findById(scheduleEventDTO.getTeacherId())
                        .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", scheduleEventDTO.getTeacherId()));
                    
                    currentClassEntity.setTeacher(newTeacher);
                    
                    // Update the subject based on the new teacher
                    currentClassEntity.setSubject(newTeacher.getSubject());
                }
                
                // Save the updated class
                classRepository.save(currentClassEntity);
            }
        } else {
            // Same class, but check if we need to update teacher or room
            if (scheduleEventDTO.getTeacherId() != null && 
                (currentClassEntity.getTeacher() == null || 
                 !scheduleEventDTO.getTeacherId().equals(currentClassEntity.getTeacher().getId()))) {
                
                Teacher newTeacher = teacherRepository.findById(scheduleEventDTO.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", scheduleEventDTO.getTeacherId()));
                
                currentClassEntity.setTeacher(newTeacher);
                currentClassEntity.setSubject(newTeacher.getSubject());
                classRepository.save(currentClassEntity);
            }
            
            if (scheduleEventDTO.getRoom() != null && !scheduleEventDTO.getRoom().equals(currentClassEntity.getRoom())) {
                currentClassEntity.setRoom(scheduleEventDTO.getRoom());
                classRepository.save(currentClassEntity);
            }
        }

        // 4. Update schedule fields
        if (scheduleEventDTO.getWeekday() != null) {
            // If weekday is provided directly, use it
        existingSchedule.setWeekday(scheduleEventDTO.getWeekday());
        } else if (scheduleEventDTO.getStringDay() != null) {
            // Handle string day format from frontend ("2", "3", "cn")
            String weekday = DAY_STRING_TO_WEEKDAY.get(scheduleEventDTO.getStringDay());
            if (weekday != null) {
                existingSchedule.setWeekday(weekday);
                System.out.println("Converting stringDay " + scheduleEventDTO.getStringDay() + " to weekday " + weekday);
            }
        } else if (scheduleEventDTO.getDay() != null) {
            // If day is provided as integer (0-6), convert to weekday string
            String weekday = DAY_INT_TO_WEEKDAY.get(scheduleEventDTO.getDay());
            if (weekday != null) {
                existingSchedule.setWeekday(weekday);
                System.out.println("Converting day " + scheduleEventDTO.getDay() + " to weekday " + weekday);
            } else {
                System.out.println("Failed to convert day: " + scheduleEventDTO.getDay());
            }
        }
        
        // Update time fields if provided
        if (scheduleEventDTO.getStartTime() != null) {
        existingSchedule.setTimeStart(LocalTime.parse(scheduleEventDTO.getStartTime(), TIME_FORMATTER));
        }
        
        if (scheduleEventDTO.getEndTime() != null) {
        existingSchedule.setTimeEnd(LocalTime.parse(scheduleEventDTO.getEndTime(), TIME_FORMATTER));
        }
        
        // Update date range if provided
        if (scheduleEventDTO.getStartDate() != null) {
            existingSchedule.setStartDate(java.time.LocalDate.parse(scheduleEventDTO.getStartDate()));
        }
        
        if (scheduleEventDTO.getEndDate() != null) {
            existingSchedule.setEndDate(java.time.LocalDate.parse(scheduleEventDTO.getEndDate()));
        }

        // 5. Save the updated schedule entity
        Schedule updatedSchedule = scheduleRepository.save(existingSchedule);

        // 6. Map back to DTO
        return mapToDTO(updatedSchedule);
    }

    @Transactional
    public void deleteScheduleEvent(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule", "id", id);
        }
        scheduleRepository.deleteById(id);
    }

    // --- Helper Mapping Method ---

    private ScheduleEventDTO mapToDTO(Schedule schedule) {
        Class classEntity = schedule.getClassEntity();
        if (classEntity == null) {
            throw new IllegalStateException("Schedule entry " + schedule.getId() + " has no associated class.");
        }
        if (classEntity.getTeacher() == null) {
            throw new IllegalStateException("Class " + classEntity.getId() + " has no associated teacher.");
        }
    
        ScheduleEventDTO dto = new ScheduleEventDTO();
        dto.setId(schedule.getId());
        dto.setClassId(classEntity.getId());
    
        // Map fields from Class
        dto.setTitle(classEntity.getName());
        dto.setTeacherId(classEntity.getTeacher().getId()); // Đảm bảo getId() trả về Long
        dto.setRoom(classEntity.getRoom());
    
        // Map fields from Schedule
        dto.setWeekday(schedule.getWeekday());
        dto.setStartTime(schedule.getTimeStart().format(TIME_FORMATTER));
        dto.setEndTime(schedule.getTimeEnd().format(TIME_FORMATTER));
        dto.setDay(WEEKDAY_TO_DAY_INT.getOrDefault(schedule.getWeekday().toLowerCase(), -1));
        
        // Map date range fields
        if (schedule.getStartDate() != null) {
            dto.setStartDate(schedule.getStartDate().toString());
        }
        
        if (schedule.getEndDate() != null) {
            dto.setEndDate(schedule.getEndDate().toString());
        }
    
        return dto;
    }

     // Optional: Helper to map DTO to Entity (mainly used internally for create/update)
     // Not strictly needed if logic is within create/update methods, but can be useful
    /*
    private Schedule mapToEntity(ScheduleEventDTO dto) {
        Class classEntity = classRepository.findById(dto.getClassId())
                 .orElseThrow(() -> new ResourceNotFoundException("Class", "id", dto.getClassId()));

        Schedule schedule = new Schedule();
        if(dto.getId() != null) schedule.setId(dto.getId()); // Set ID for updates
        schedule.setClassEntity(classEntity);
        schedule.setWeekday(dto.getWeekday());
        schedule.setTimeStart(LocalTime.parse(dto.getStartTime(), TIME_FORMATTER));
        schedule.setTimeEnd(LocalTime.parse(dto.getEndTime(), TIME_FORMATTER));
        return schedule;
    }
    */
}