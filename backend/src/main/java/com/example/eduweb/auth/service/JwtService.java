package com.example.eduweb.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.example.eduweb.auth.model.TokenType;
import com.example.eduweb.auth.util.SecurityConstants;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {


    /**
     * Tạo một JWT (JSON Web Token) cho người dùng được cung cấp.
     * 
     * @param userDetails Thông tin người dùng cần tạo token
     * @param tokenType Loại token (ACCESS hoặc REFRESH)
     * @return Chuỗi token đã được mã hóa
     */
    public String generateToken(UserDetails userDetails, TokenType tokenType) {
        long expiration = tokenType == TokenType.ACCESS 
            ? SecurityConstants.JWT_EXPIRATION 
            : SecurityConstants.REFRESH_EXPIRATION;
        
        // Khởi tạo token với các thông tin cần thiết và ký bằng khóa bí mật
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // Đặt chủ thể của token là tên người dùng
                .setIssuedAt(new Date()) // Đặt thời điểm tạo token
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Đặt thời điểm hết hạn
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Ký token bằng khóa bí mật
                .compact();
    }

    /**
     * Lấy tên người dùng từ token được cung cấp.
     * 
     * @param token Token cần phân tích
     * @return Tên người dùng đã được trích xuất từ token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Kiểm tra tính hợp lệ của token.
     * 
     * @param token Token cần kiểm tra
     * @param userDetails Thông tin người dùng cần đối chiếu
     * @return true nếu token hợp lệ, false nếu không hợp lệ
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Kiểm tra xem token đã hết hạn chưa.
     * 
     * @param token Token cần kiểm tra
     * @return true nếu token đã hết hạn, false nếu vẫn còn hiệu lực
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Trích xuất thời điểm hết hạn của token.
     * 
     * @param token Token cần kiểm tra
     * @return Thời điểm hết hạn của token
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Trích xuất một claim cụ thể từ token.
     * 
     * @param <T> Kiểu dữ liệu của claim cần trích xuất
     * @param token Token cần phân tích
     * @param claimsResolver Hàm xử lý để trích xuất claim từ Claims
     * @return Claim đã được trích xuất
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Lấy tất cả các claims từ token.
     * 
     * @param token Token cần phân tích
     * @return Các claims trong token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey()) // Đặt khóa bí mật để xác thực token
                .build()
                .parseClaimsJws(token) // Phân tích token và trích xuất payload
                .getBody();
    }
    
    /**
     * Lấy khóa bí mật để ký và xác thực token.
     * 
     * @return Đối tượng Key dùng để ký token
     */
    private Key getSignInKey() {
        // Chuyển chuỗi bí mật thành mảng byte
        byte[] keyBytes = Decoders.BASE64.decode(SecurityConstants.JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes); // Tạo khóa bí mật dùng để ký token
    }

    /**
     * Lấy thời gian hết hạn của token theo giây.
     * 
     * @param tokenType Loại token (ACCESS hoặc REFRESH)
     * @return Thời gian hết hạn tính theo giây
     */
    public Long getExpirationInSeconds(TokenType tokenType) {
        return tokenType == TokenType.ACCESS 
            ? SecurityConstants.JWT_EXPIRATION / 1000 
            : SecurityConstants.REFRESH_EXPIRATION / 1000;
    }

    /**
     * Tạo một refresh token.
     * 
     * @param userDetails Thông tin người dùng cần tạo refresh token
     * @return Chuỗi refresh token đã được mã hóa
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, TokenType.REFRESH);
    }
}
