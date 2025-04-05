package com.example.eduweb.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.quality.Strictness;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.eduweb.auth.dto.LoginRequest;
import com.example.eduweb.auth.dto.LoginResponse;
import com.example.eduweb.auth.dto.RefreshTokenRequest;
import com.example.eduweb.auth.exception.AuthException;
import com.example.eduweb.auth.model.TokenType;
import com.example.eduweb.auth.model.User;
import com.example.eduweb.auth.repository.UserRepository;

@ExtendWith(MockitoExtension.class)  // Extension của JUnit để hỗ trợ Mockito
@org.mockito.junit.jupiter.MockitoSettings(strictness = Strictness.LENIENT) // Thiết lập độ nghiêm ngặt của Mockito
class AuthServiceTest {

     // Mock đối tượng 
    @Mock
    private UserRepository userRepository; 

    @Mock
    private PasswordEncoder passwordEncoder; 

    @Mock
    private JwtService jwtService; 

    @Mock
    private UserDetailsServiceImpl userDetailsService; 

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenBlacklistService tokenBlacklistService; 

    @InjectMocks
    private AuthService authService; // Inject các Mock vào AuthService

    private User user; // Khai báo một đối tượng User

    private LoginRequest loginRequest; // Khai báo một đối tượng LoginRequest

    @BeforeEach
    void setUp() {
        // Tạo một đối tượng User để mock trả về khi cần
        user = new User();
        user.setUsername("testuser");
        user.setPasswordHash("encodedPassword");
        user.setRole("USER");

        // Tạo một đối tượng LoginRequest với thông tin giả định
        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");
    }

    @Test
    void authenticate_ShouldReturnLoginResponse_WhenCredentialsAreValid() {
        // Mock data
        User mockUser = new User();
        mockUser.setUsername("testuser");
        mockUser.setPasswordHash("encodedPassword");
        
        // Mock repository
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        
        // Mock authentication
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        
        // Mock UserDetails
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
            .username("testuser")
            .password("encodedPassword")
            .roles("USER")
            .build();
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        
        // Mock tokens
        when(jwtService.generateToken(userDetails, TokenType.ACCESS)).thenReturn("testToken");
        when(jwtService.generateRefreshToken(userDetails)).thenReturn("testRefreshToken");
        
        // Execute
        LoginResponse response = authService.authenticate(loginRequest);
        
        // Verify
        assertNotNull(response);
        assertEquals("testToken", response.getAccessToken());
        assertEquals("testRefreshToken", response.getRefreshToken());
        assertEquals("testuser", response.getUser().getUsername());
        
        // Verify interactions
        verify(userRepository).findByUsername("testuser");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userDetailsService).loadUserByUsername("testuser");
        verify(jwtService).generateToken(userDetails, TokenType.ACCESS);
        verify(jwtService).generateRefreshToken(userDetails);

    }

    @Test
    void authenticate_ShouldThrowAuthException_WhenUserNotFound() {
        // Khi tài khoản không tồn tại, hàm authenticate phải ném ra AuthException
        when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.empty());

        // Kiểm tra nếu AuthException được ném ra
        assertThrows(AuthException.class, () -> authService.authenticate(loginRequest));

        // Kiểm tra rằng các mock không được gọi nếu không có User
        verify(userRepository).findByUsername(loginRequest.getUsername());
        verifyNoInteractions(passwordEncoder, jwtService, authenticationManager);
    }

    @Test
    void refreshToken_ShouldReturnNewAccessToken_WhenRefreshTokenIsValid() {
        // Setup test data
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("validRefreshToken");
        
        // Mock JWT service
        when(jwtService.extractUsername("validRefreshToken")).thenReturn("testuser");
        
        // Mock User data
        User mockUser = new User();
        mockUser.setUsername("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        
        // Mock UserDetails
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("testuser")
                .password("password")
                .roles("USER")
                .build();
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        
        // Mock token validation
        when(jwtService.isTokenValid("validRefreshToken", userDetails)).thenReturn(true);
        
        // Mock new token generation
        when(jwtService.generateToken(userDetails, TokenType.ACCESS)).thenReturn("newAccessToken");
        
        // Execute
        LoginResponse response = authService.refreshToken(request);
        
        // Verify
        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("validRefreshToken", response.getRefreshToken());
        
        // Verify interactions
        verify(jwtService).extractUsername("validRefreshToken");
        verify(userRepository).findByUsername("testuser");
        verify(userDetailsService).loadUserByUsername("testuser");
        verify(jwtService).isTokenValid("validRefreshToken", userDetails);
        verify(jwtService).generateToken(userDetails, TokenType.ACCESS);
    }
    
    @Test
    void logout_ShouldAddTokenToBlacklist() {
        // Gọi hàm logout trong AuthService và kiểm tra xem token đã được thêm vào blacklist chưa
        authService.logout("tokenToBlacklist");

        // Kiểm tra xem hàm addToBlacklist đã được gọi
        verify(tokenBlacklistService).addToBlacklist("tokenToBlacklist");
    }



}
