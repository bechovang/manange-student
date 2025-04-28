// src/main/java/com/example/eduweb/service/TeacherService.java
package com.example.eduweb.managesystem.service;

import com.example.eduweb.managesystem.dto.TeacherScheduleDTO;
import com.example.eduweb.managesystem.exception.ResourceNotFoundException;
import com.example.eduweb.managesystem.model.Teacher;
import com.example.eduweb.managesystem.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ScheduleTeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    // Define colors for the frontend (adjust as needed)
    private static final List<String> TEACHER_COLORS = List.of(
        "bg-red-100 text-red-800 border-red-200",
        "bg-blue-100 text-blue-800 border-blue-200",
        "bg-green-100 text-green-800 border-green-200",
        "bg-purple-100 text-purple-800 border-purple-200",
        "bg-yellow-100 text-yellow-800 border-yellow-200",
        "bg-pink-100 text-pink-800 border-pink-200",
        "bg-indigo-100 text-indigo-800 border-indigo-200",
        "bg-orange-100 text-orange-800 border-orange-200"
    );

    @Transactional(readOnly = true)
    public List<TeacherScheduleDTO> getAllTeachersForSchedule() {
        List<Teacher> teachers = teacherRepository.findAll();
        return IntStream.range(0, teachers.size())
                .mapToObj(i -> mapToTeacherScheduleDTO(teachers.get(i), i))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
     public Teacher findTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
    }

    // Helper to map Teacher to TeacherScheduleDTO
    private TeacherScheduleDTO mapToTeacherScheduleDTO(Teacher teacher, int index) {
        int colorIndex = index % TEACHER_COLORS.size();
        String color = TEACHER_COLORS.get(colorIndex);
        return new TeacherScheduleDTO(
                teacher.getId(),
                teacher.getName(),
                teacher.getSubject(),
                // teacher.getAvatar(), // Avatar field removed
                colorIndex,
                color
        );
    }
}
