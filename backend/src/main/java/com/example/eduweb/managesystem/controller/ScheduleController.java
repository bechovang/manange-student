// src/main/java/com/example/eduweb/controller/ScheduleController.java
package com.example.eduweb.managesystem.controller;

import com.example.eduweb.managesystem.dto.ScheduleEventDTO;
import com.example.eduweb.managesystem.dto.TeacherScheduleDTO;
import com.example.eduweb.managesystem.service.ScheduleService;
import com.example.eduweb.managesystem.service.ScheduleTeacherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize; // Uncomment if using method security
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private ScheduleTeacherService teacherService;

    // --- Schedule Entry CRUD ---

    @GetMapping
    // @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STAFF')")
    public ResponseEntity<List<ScheduleEventDTO>> getAllScheduleEvents() {
        List<ScheduleEventDTO> events = scheduleService.getAllScheduleEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STAFF')")
    public ResponseEntity<ScheduleEventDTO> getScheduleEventById(@PathVariable Long id) {
        ScheduleEventDTO event = scheduleService.getScheduleEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduleEventDTO> createScheduleEvent(@Valid @RequestBody ScheduleEventDTO scheduleEventDTO) {
        // Note: The input DTO for creation *must* have classId, weekday, startTime, endTime
        // It will *not* have title, teacherId, room directly as input, those come from the linked class.
        // The service layer handles finding the class and mapping.
        ScheduleEventDTO createdEvent = scheduleService.createScheduleEvent(scheduleEventDTO);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduleEventDTO> updateScheduleEvent(@PathVariable Long id, @Valid @RequestBody ScheduleEventDTO scheduleEventDTO) {
         // Note: Input DTO for update mainly uses weekday, startTime, endTime.
         // The service logic currently assumes classId isn't changed via this DTO field.
         // Ensure classId is present if needed by validation, even if not used for update itself.
        ScheduleEventDTO updatedEvent = scheduleService.updateScheduleEvent(id, scheduleEventDTO);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteScheduleEvent(@PathVariable Long id) {
        scheduleService.deleteScheduleEvent(id);
        return ResponseEntity.noContent().build();
    }

    // --- Endpoint for Teachers formatted for Schedule ---

    @GetMapping("/teachers")
    // @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STAFF')")
    public ResponseEntity<List<TeacherScheduleDTO>> getTeachersForSchedule() {
        List<TeacherScheduleDTO> teachers = teacherService.getAllTeachersForSchedule();
        return ResponseEntity.ok(teachers);
    }
}