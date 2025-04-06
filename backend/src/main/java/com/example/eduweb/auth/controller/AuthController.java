package com.example.eduweb.auth.controller;

import com.example.eduweb.auth.dto.LoginRequest;
import com.example.eduweb.auth.dto.LoginResponse;
import com.example.eduweb.auth.dto.RefreshTokenRequest;
import com.example.eduweb.auth.exception.AuthException;
import com.example.eduweb.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    // Logger for this controller
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Log login attempt (obfuscate username for security)
        logger.info("Login attempt for user: {}", request.getUsername());
        
        try {
            LoginResponse response = authService.authenticate(request);
            // Log successful login
            logger.info("Login successful for user: {}", request.getUsername());
            return ResponseEntity.ok(response);
        } catch (AuthException e) {
            // Log failed login
            logger.warn("Login failed for user: {}, reason: {}", request.getUsername(), e.getErrorMessage());
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(e.getErrorMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        // Log refresh token attempt
        logger.debug("Token refresh attempt");
        
        try {
            LoginResponse response = authService.refreshToken(request);
            // Log successful token refresh
            logger.info("Token refresh successful");
            return ResponseEntity.ok(response);
        } catch (AuthException e) {
            // Log failed token refresh
            logger.warn("Token refresh failed: {}", e.getErrorMessage());
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(e.getErrorMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Log logout attempt
        logger.info("Logout attempt");
        
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Log token extraction (without showing the actual token)
                logger.debug("Bearer token extracted from header");
                authService.logout(token);
                // Log successful logout
                logger.info("Logout successful");
                return ResponseEntity.ok(new SuccessResponse("Logout successful"));
            }
            // Log scenario where no token was provided
            logger.info("Logout processed with no token provided");
            return ResponseEntity.ok(new SuccessResponse("Logout successful"));
        } catch (Exception e) {
            // Log logout failure with exception details
            logger.error("Logout failed with exception", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Logout failed: " + e.getMessage()));
        }
    }
}

class ErrorResponse {
    private String error;

    public ErrorResponse(String error) {
        this.error = error;
    }

    public String getError() {
        return error;
    }
}

class SuccessResponse {
    private String message;

    public SuccessResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}