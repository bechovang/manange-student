package com.example.eduweb.auth.service;

import com.example.eduweb.auth.repository.UserRepository;
import com.example.eduweb.auth.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    // Logger for this class
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    
    @Autowired
    private UserRepository userRepository;  // Tiêm repository để truy cập dữ liệu người dùng từ cơ sở dữ liệu.

    /**
     * Phương thức này thực thi việc tải thông tin người dùng từ cơ sở dữ liệu
     * dựa trên username và trả về đối tượng UserDetails dùng trong Spring Security.
     *
     * @param username Tên người dùng cần xác thực.
     * @return UserDetails chứa thông tin người dùng và quyền truy cập của họ.
     * @throws UsernameNotFoundException nếu người dùng không tồn tại trong cơ sở dữ liệu.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Attempting to load user by username: {}", username);
        
        try {
            // Tìm người dùng từ cơ sở dữ liệu dựa trên username
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            logger.info("User found: {}", username);
            logger.debug("User role: {}", user.getRole());
            
            // Trả về đối tượng UserDetails với thông tin người dùng và quyền truy cập của họ
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),  // Tên người dùng
                    user.getPasswordHash(),  // Mật khẩu đã được mã hóa
                    getAuthorities(user.getRole())  // Quyền truy cập của người dùng dựa trên vai trò
            );
        } catch (UsernameNotFoundException e) {
            logger.warn("Failed to find user: {}", username);
            throw e;
        } catch (Exception e) {
            logger.error("Error loading user: {}", username, e);
            throw new UsernameNotFoundException("Error loading user", e);
        }
    }

    /**
     * Phương thức này xác định quyền truy cập của người dùng dựa trên vai trò của họ.
     * Trong Spring Security, quyền truy cập phải bắt đầu với "ROLE_" (theo quy tắc của Spring Security).
     *
     * @param role Vai trò của người dùng (admin, teacher, staff...).
     * @return Collection các quyền truy cập của người dùng.
     */
    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        logger.debug("Creating authority for role: {}", role);
        // Trả về quyền truy cập dạng Collection. Mỗi vai trò sẽ được chuyển thành quyền "ROLE_<role>"
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }
}