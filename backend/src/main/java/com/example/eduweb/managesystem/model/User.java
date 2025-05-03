// src/main/java/com/yourpackage/model/User.java
package com.example.eduweb.managesystem.model; // Hoặc package entity của bạn

import com.example.eduweb.managesystem.model.enums.UserRole; // Import Enum vừa tạo
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users") // Tên bảng trong database
@Data // Lombok: Tự động tạo getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: Tự động tạo constructor không tham số (cần cho JPA)
@AllArgsConstructor // Lombok: Tự động tạo constructor với tất cả tham số (tiện lợi)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng ID
    private Integer id; // Sử dụng Integer vì schema là integer

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", length = 255, nullable = false) // Ánh xạ tên cột nếu khác tên biến
    private String password; // Tên biến nên là 'password', dù lưu hash

    @Column(length = 100, unique = true) // Email có thể null dựa theo schema (ko có not null)
    private String email;

    @Enumerated(EnumType.STRING) // Lưu giá trị Enum dưới dạng String (ADMIN, TEACHER, STAFF)
    @Column(length = 20, nullable = false)
    private UserRole role; // Sử dụng Enum UserRole

    @CreationTimestamp // Tự động gán thời gian tạo khi persist lần đầu
    @Column(name = "created_at", nullable = false, updatable = false) // Không cho phép cập nhật createdAt
    private LocalDateTime createdAt;

    // Các mối quan hệ khác có thể được thêm vào đây nếu cần
    // Ví dụ: @OneToMany(mappedBy = "user") private List<CashierShift> shifts;
    // Ví dụ: @OneToMany(mappedBy = "recordedBy") private List<AttendanceRecord> attendanceRecords;
    // Ví dụ: @OneToMany(mappedBy = "createdBy") private List<Transaction> transactions;
}