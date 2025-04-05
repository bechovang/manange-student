package com.example.eduweb.auth.repository;

import com.example.eduweb.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Tìm user bằng username
    Optional<User> findByUsername(String username);
    
    // Tìm user bằng email
    Optional<User> findByEmail(String email);
    
    // Kiểm tra username đã tồn tại chưa
    boolean existsByUsername(String username);
    
    // Kiểm tra email đã tồn tại chưa
    boolean existsByEmail(String email);
    

    
    // Cập nhật mật khẩu
    @Modifying
    @Query("UPDATE User u SET u.passwordHash = :newPassword WHERE u.id = :userId")
    void updatePassword(Long userId, String newPassword);
}