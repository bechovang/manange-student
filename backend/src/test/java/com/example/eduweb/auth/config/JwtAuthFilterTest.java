package com.example.eduweb.auth.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import com.example.eduweb.auth.service.JwtService;
import com.example.eduweb.auth.service.UserDetailsServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class JwtAuthFilterTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private JwtService jwtService;
    
    @MockBean
    private UserDetailsServiceImpl userDetailsService;
    
    @Test
    void doFilterInternal_WithInvalidToken_ShouldReturnUnauthorized() throws Exception {
        // Given
        when(jwtService.extractUsername(anyString()))
            .thenThrow(new JwtException("Invalid token"));
        
        // When & Then
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer invalidToken"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid token"));
        
        verify(jwtService).extractUsername("invalidToken");
        verifyNoInteractions(userDetailsService);
    }
    
    @Test
    void doFilterInternal_WithExpiredToken_ShouldReturnUnauthorized() throws Exception {
        // Given
        when(jwtService.extractUsername(anyString()))
            .thenThrow(new ExpiredJwtException(null, null, "Token has expired"));
        
        // When & Then
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer expiredToken"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Token has expired"));
        
        verify(jwtService).extractUsername("expiredToken");
        verifyNoInteractions(userDetailsService);
    }
}

