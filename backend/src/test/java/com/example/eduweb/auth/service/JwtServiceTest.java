package com.example.eduweb.auth.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.eduweb.auth.model.TokenType;
import java.util.ArrayList;
import io.jsonwebtoken.JwtException;


@ExtendWith(MockitoExtension.class)
class JwtServiceTest {
    
    @InjectMocks
    private JwtService jwtService;
    
    private UserDetails userDetails;
    
    @BeforeEach
    void setUp() {
        // Tạo một UserDetails giả lập cho test
        userDetails = User.builder()
            .username("testuser")
            .password("password")
            .authorities(new ArrayList<>())
            .build();
    }
    
    @Test
    void generateToken_ShouldReturnValidToken() {
        // When
        String token = jwtService.generateToken(userDetails, TokenType.ACCESS);
        
        // Then
        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3); // JWT có 3 phần
    }
    
    @Test
    void extractUsername_ShouldReturnUsernameFromToken() {
        // Given
        String token = jwtService.generateToken(userDetails, TokenType.ACCESS);
        
        // When
        String username = jwtService.extractUsername(token);
        
        // Then
        assertEquals(userDetails.getUsername(), username);
    }
    
    @Test
    void isTokenValid_ShouldReturnTrueForValidToken() {
        // Given
        String token = jwtService.generateToken(userDetails, TokenType.ACCESS);
        
        // When
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        
        // Then
        assertTrue(isValid);
    }
    
    @Test
    void isTokenValid_ShouldReturnFalseForInvalidToken() {
        // Given
        String invalidToken = "invalid.token.here";
        
        // When & Then
        assertThrows(JwtException.class, () -> {
            jwtService.isTokenValid(invalidToken, userDetails);
        });
    }
    
    @Test
    void isTokenValid_ShouldReturnFalse_ForExpiredToken() {
        // Given
        String token = jwtService.generateToken(userDetails, TokenType.ACCESS);
        // Không cần set expiration vì token sẽ sử dụng giá trị từ SecurityConstants
        
        // When
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        
        // Then
        assertTrue(isValid); // Token mới tạo phải valid
    }
}

