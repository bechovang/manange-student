package com.example.eduweb;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EduwebApplicationTests {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void contextLoads() {
        // Test mặc định để kiểm tra context khởi tạo thành công
    }

    @Test
    void verifyApplicationContext() {
        // Kiểm tra application context không null
        assertNotNull(applicationContext, "Application context should not be null");
    }

    @Test
    void verifyMainBeansAreAvailable() {
        // Kiểm tra các bean quan trọng có tồn tại
        assertDoesNotThrow(() -> {
            applicationContext.getBean("jwtAuthFilter");
            applicationContext.getBean("userRepository");
            applicationContext.getBean("authController");
        }, "Essential beans should be available");
    }

    @Test
    void verifyDatabaseConnection() {
        // Kiểm tra kết nối database (nếu có)
        assertDoesNotThrow(() -> {
            Object dataSource = applicationContext.getBean("dataSource");
            assertNotNull(dataSource, "DataSource bean should exist");
        }, "Database connection should be available");
    }

    @Test
    void verifySecurityConfiguration() {
        // Kiểm tra cấu hình security
        assertDoesNotThrow(() -> {
            Object securityFilterChain = applicationContext.getBean("securityFilterChain");
            assertNotNull(securityFilterChain, "Security filter chain should be configured");
        }, "Security configuration should be available");
    }
}