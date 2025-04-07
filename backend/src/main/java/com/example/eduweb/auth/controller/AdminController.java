package com.example.eduweb.auth.controller;

import com.example.eduweb.auth.model.User;
import com.example.eduweb.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
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
    
    @GetMapping("/update-password/{username}")
    public ResponseEntity<?> updatePassword(@PathVariable String username, @RequestParam String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        User user = userOpt.get();
        user.setPasswordHash(passwordEncoder.encode(password));
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully for user: " + username);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/fix-all-passwords")
    public ResponseEntity<?> fixAllPasswords() {
        // Tìm tất cả người dùng
        List<User> users = userRepository.findAll();
        int count = 0;
        
        // Cập nhật tất cả mật khẩu thành username + "123"
        for (User user : users) {
            String newPassword = user.getUsername() + "123";
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            count++;
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Fixed passwords for " + count + " users");
        response.put("note", "Each user's password is now their username + '123'");
        return ResponseEntity.ok(response);
    }
} 