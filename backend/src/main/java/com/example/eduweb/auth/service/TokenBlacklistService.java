package com.example.eduweb.auth.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public void addToBlacklist(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    public void removeExpiredTokens() {
        // Có thể mở rộng để kiểm tra thời gian hết hạn nếu cần
        blacklistedTokens.clear(); // Hiện tại xóa toàn bộ, có thể tối ưu sau
    }

    @PostConstruct
    public void init() {
        // Dọn dẹp blacklist mỗi giờ
        scheduler.scheduleAtFixedRate(this::removeExpiredTokens, 1, 1, TimeUnit.HOURS);
    }

    @PreDestroy
    public void cleanup() {
        scheduler.shutdown();
    }
}