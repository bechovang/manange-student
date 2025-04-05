package com.example.eduweb.auth.model;

/**
 * Enum định nghĩa các loại token trong hệ thống
 */
public enum TokenType {
    ACCESS,    // Token truy cập (thời gian ngắn)
    REFRESH    // Token làm mới (thời gian dài)
}