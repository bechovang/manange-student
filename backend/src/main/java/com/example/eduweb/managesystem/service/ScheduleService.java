// src/main/java/com/example/eduweb/service/ScheduleService.java
package com.example.eduweb.managesystem.service;

import com.example.eduweb.managesystem.dto.ScheduleEventDTO;
import com.example.eduweb.managesystem.exception.ResourceNotFoundException;
import com.example.eduweb.managesystem.model.Class; // Import Class
import com.example.eduweb.managesystem.model.Schedule;
import com.example.eduweb.managesystem.repository.ClassRepository; // Import ClassRepository
import com.example.eduweb.managesystem.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ClassRepository classRepository; // Need ClassRepository

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
        // 1. Find the associated Class
        Class classEntity = classRepository.findById(scheduleEventDTO.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class", "id", scheduleEventDTO.getClassId()));

        // 2. Create new Schedule entity
        Schedule schedule = new Schedule();
        schedule.setClassEntity(classEntity);
        schedule.setWeekday(scheduleEventDTO.getWeekday());
        schedule.setTimeStart(LocalTime.parse(scheduleEventDTO.getStartTime(), TIME_FORMATTER));
        schedule.setTimeEnd(LocalTime.parse(scheduleEventDTO.getEndTime(), TIME_FORMATTER));

        // 3. Save the new Schedule entity
        Schedule savedSchedule = scheduleRepository.save(schedule);

        // 4. Map back to DTO for the response
        return mapToDTO(savedSchedule);
    }

    @Transactional
    public ScheduleEventDTO updateScheduleEvent(Long id, ScheduleEventDTO scheduleEventDTO) {
        // 1. Find the existing Schedule entry
        Schedule existingSchedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));

        // 2. Validate if the class needs to be changed (optional, depends on requirements)
        // If classId in DTO is different, you might need to find the new class
        // or throw an error if changing class is not allowed.
        // For simplicity, let's assume class doesn't change in an update here.
        // If it can change, add:
        // Class classEntity = classRepository.findById(scheduleEventDTO.getClassId())
        //     .orElseThrow(() -> new ResourceNotFoundException("Class", "id", scheduleEventDTO.getClassId()));
        // existingSchedule.setClassEntity(classEntity);


        // 3. Update fields
        existingSchedule.setWeekday(scheduleEventDTO.getWeekday());
        existingSchedule.setTimeStart(LocalTime.parse(scheduleEventDTO.getStartTime(), TIME_FORMATTER));
        existingSchedule.setTimeEnd(LocalTime.parse(scheduleEventDTO.getEndTime(), TIME_FORMATTER));

        // 4. Save the updated entity
        Schedule updatedSchedule = scheduleRepository.save(existingSchedule);

        // 5. Map back to DTO
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