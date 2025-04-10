package com.example.eduweb.managesystem.controller;

import com.example.eduweb.managesystem.model.Class;
import com.example.eduweb.managesystem.repository.ClassRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    private final ClassRepository classRepository;

    public ClassController(ClassRepository classRepository) {
        this.classRepository = classRepository;
    }

    @GetMapping
    public ResponseEntity<List<Class>> getAllClasses() {
        return ResponseEntity.ok(classRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Class> getClassById(@PathVariable Long id) {
        return classRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Class> createClass(@RequestBody Class classEntity) {
        Class savedClass = classRepository.save(classEntity);
        return ResponseEntity.ok(savedClass);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Class> updateClass(@PathVariable Long id, 
                                           @RequestBody Class classDetails) {
        return classRepository.findById(id)
                .map(classEntity -> {
                    classEntity.setName(classDetails.getName());
                    classEntity.setTeacher_id(classDetails.getTeacher_id());
                    classEntity.setSubject(classDetails.getSubject());
                    classEntity.setRoom(classDetails.getRoom());
                    classEntity.setStartDate(classDetails.getStartDate());
                    classEntity.setEndDate(classDetails.getEndDate());
                    return ResponseEntity.ok(classRepository.save(classEntity));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable Long id) {
        return classRepository.findById(id)
                .map(classEntity -> {
                    classRepository.delete(classEntity);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}