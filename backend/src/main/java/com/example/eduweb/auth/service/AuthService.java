package com.example.eduweb.auth.service;

import com.example.eduweb.auth.dto.LoginRequest;
import com.example.eduweb.auth.dto.LoginResponse;
import com.example.eduweb.auth.dto.RefreshTokenRequest;
import com.example.eduweb.auth.dto.UserDto;
import com.example.eduweb.auth.exception.AuthException;
import com.example.eduweb.auth.model.TokenType;
import com.example.eduweb.auth.repository.UserRepository;
import com.example.eduweb.auth.model.User; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;


@Service
public class AuthService {
    

    // Inject các service cần thiết vào AuthService
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private UserRepository userRepository;    

    /**
     * Xác thực người dùng và tạo token (access và refresh).
     * @param request LoginRequest chứa thông tin đăng nhập (username, password)
     * @return LoginResponse chứa các thông tin token và thông tin người dùng
     */
    public LoginResponse authenticate(LoginRequest request) {
        final Logger logger = LoggerFactory.getLogger(AuthService.class);
        final String username = request.getUsername();

        // Kiểm tra user tồn tại 
        User user = userRepository.findByUsername(username)
        .orElseThrow(() -> {
            logger.error("User not found: {}", username);
            return new AuthException("User not found");
        });
        // Sử dụng user object để ko lỗi
        logger.debug("User role: {}", user.getRole());
        
        try {
            logger.info("Bắt đầu quá trình xác thực cho user: {}", username);
            logger.debug("Thông tin yêu cầu: username={}", username);
            
            // Tiến hành xác thực người dùng với AuthenticationManager
            try {
                logger.debug("Đang xác thực thông tin đăng nhập...");
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        username,
                        request.getPassword()
                    )
                );
                logger.info("Xác thực thành công cho user: {}", username);
            } catch (AuthenticationException e) {
                logger.error("Xác thực thất bại cho user: {} - Lỗi: {}", username, e.getMessage());
                throw e;
            }
            
            // Sau khi xác thực thành công, tải thông tin người dùng
            logger.debug("Đang tải thông tin user details...");
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            logger.debug("Đã tải thông tin user details thành công");
            
            // Tạo access token và refresh token
            logger.debug("Đang tạo access token...");
            String accessToken = jwtService.generateToken(userDetails, TokenType.ACCESS);
            logger.debug("Đã tạo access token thành công");
            
            logger.debug("Đang tạo refresh token...");
            String refreshToken = jwtService.generateRefreshToken(userDetails);
            logger.debug("Đã tạo refresh token thành công");
            
            // Tạo đối tượng UserDto
            logger.debug("Đang tạo UserDto...");
            UserDto userDto = new UserDto();
            userDto.setUsername(userDetails.getUsername());
            logger.debug("Đã tạo UserDto với username: {}", userDto.getUsername());
            
            // Log thông tin token (chỉ nên log ở môi trường dev)
            if (logger.isDebugEnabled()) {
                logger.debug("Access token sẽ hết hạn sau: {} giây", 
                    jwtService.getExpirationInSeconds(TokenType.ACCESS));
                logger.debug("Refresh token sẽ hết hạn sau: {} giây", 
                    jwtService.getExpirationInSeconds(TokenType.REFRESH));
            }
            
            logger.info("Hoàn tất quá trình xác thực cho user: {}", username);
            
            return new LoginResponse(
                accessToken,
                refreshToken,
                jwtService.getExpirationInSeconds(TokenType.ACCESS),
                userDto
            );
            
        } catch (Exception e) {
            logger.error("Lỗi trong quá trình xác thực user: {} - Nguyên nhân: {}", 
                username, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Làm mới access token sử dụng refresh token.
     * @param request RefreshTokenRequest chứa refresh token
     * @return LoginResponse với access token mới
     */
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        final Logger logger = LoggerFactory.getLogger(AuthService.class);

        // Giải nén username từ refresh token
        String username = jwtService.extractUsername(request.getRefreshToken());

        // Kiểm tra user tồn tại 
        User user = userRepository.findByUsername(username)
        .orElseThrow(() -> {
            logger.error("User not found: {}", username);
            return new AuthException("User not found");
        });
        // Sử dụng user object để ko lỗi
        logger.debug("User role: {}", user.getRole());
        
        // Kiểm tra nếu username hợp lệ
        if (username != null) {
            // Tải thông tin người dùng từ username
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Kiểm tra xem refresh token có hợp lệ không
            if (jwtService.isTokenValid(request.getRefreshToken(), userDetails)) {
                // Tạo access token mới
                String newAccessToken = jwtService.generateToken(userDetails, TokenType.ACCESS);
                
                // Tạo đối tượng UserDto từ UserDetails
                UserDto userDto = new UserDto();
                userDto.setUsername(userDetails.getUsername());
                
                // Trả về LoginResponse với access token mới
                return new LoginResponse(
                    newAccessToken,         // Access token mới
                    request.getRefreshToken(), // Refresh token không thay đổi
                    jwtService.getExpirationInSeconds(TokenType.ACCESS), // Thời gian hết hạn access token
                    userDto                  // Thông tin người dùng
                );
            }
        }
        
        // Nếu refresh token không hợp lệ, ném ra ngoại lệ
        throw new AuthException("Invalid refresh token");
    }

    /**
     * Đăng xuất người dùng bằng cách thêm token vào danh sách đen.
     * @param token Token của người dùng cần logout
     */
    public void logout(String token) {
        final Logger logger = LoggerFactory.getLogger(AuthService.class);
        logger.info("Logout token: {}", token);
        // Thêm token vào danh sách đen để không thể sử dụng lại
        tokenBlacklistService.addToBlacklist(token);
    }
}
