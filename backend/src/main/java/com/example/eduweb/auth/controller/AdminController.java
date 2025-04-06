package com.example.eduweb.auth.controller;

import com.example.eduweb.auth.model.User;
import com.example.eduweb.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/setup")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/init")
    public ResponseEntity<?> initializeAdmin() {
        if (userRepository.findByUsername("admin").isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin already exists");
            return ResponseEntity.ok(response);
        }

        User admin = new User();
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("admin123")); // Mã hóa mật khẩu với BCrypt
        admin.setEmail("admin@school.com");
        admin.setRole("admin");
        admin.setCreatedAt(LocalDateTime.now());

        userRepository.save(admin);

        // Tạo thêm tài khoản giáo viên và nhân viên
        User teacher = new User();
        teacher.setUsername("teacher1");
        teacher.setPasswordHash(passwordEncoder.encode("teacher123"));
        teacher.setEmail("teacher1@school.com");
        teacher.setRole("teacher");
        teacher.setCreatedAt(LocalDateTime.now());
        userRepository.save(teacher);

        User staff = new User();
        staff.setUsername("staff1");
        staff.setPasswordHash(passwordEncoder.encode("staff123"));
        staff.setEmail("staff1@school.com");
        staff.setRole("staff");
        staff.setCreatedAt(LocalDateTime.now());
        userRepository.save(staff);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Users created successfully");
        response.put("users", new Object[]{
            Map.of("username", "admin", "password", "admin123", "role", "admin"),
            Map.of("username", "teacher1", "password", "teacher123", "role", "teacher"),
            Map.of("username", "staff1", "password", "staff123", "role", "staff")
        });
        return ResponseEntity.ok(response);
    }
} 