package com.example.eduweb.auth.config;  // Đảm bảo package khớp với vị trí file

import com.example.eduweb.auth.service.JwtService;
import com.example.eduweb.auth.service.UserDetailsServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    
    // Logger for this filter
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final ObjectMapper objectMapper;

    //@Autowired
    public JwtAuthFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.objectMapper = new ObjectMapper();
        logger.debug("JwtAuthFilter initialized");
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        boolean shouldSkip = request.getServletPath().startsWith("/api/auth/");
        if (shouldSkip) {
            logger.debug("Skipping JWT filter for auth endpoint: {}", request.getServletPath());
        }
        return shouldSkip;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, 
            @NonNull HttpServletResponse response, 
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        logger.debug("Processing request: {}", request.getRequestURI());
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No Bearer token found in request, skipping authentication");
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            final String jwt = authHeader.substring(7);
            logger.debug("JWT token extracted from header");
            
            final String username = jwtService.extractUsername(jwt);
            logger.debug("Username extracted from token: {}", username);
            
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.debug("Loading user details for username: {}", username);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    logger.info("JWT token validated successfully for user: {}", username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Authentication set in SecurityContext");
                } else {
                    logger.warn("Invalid JWT token for user: {}", username);
                }
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            logger.warn("Expired JWT token detected", e);
            handleAuthenticationException(response, "Token has expired");
        } catch (JwtException e) {
            logger.warn("Invalid JWT token", e);
            handleAuthenticationException(response, "Invalid token");
        } catch (Exception e) {
            logger.error("Authentication failed", e);
            handleAuthenticationException(response, "Authentication failed");
        }
    }

    private void handleAuthenticationException(HttpServletResponse response, String message) throws IOException {
        logger.debug("Handling authentication exception: {}", message);
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Map<String, String> error = new HashMap<>();
        error.put("error", "Unauthorized");
        error.put("message", message);

        response.getWriter().write(objectMapper.writeValueAsString(error));
        logger.info("Authentication error response sent: {}", message);
    }
}