package com.example.eduweb.auth.service;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TokenBlacklistService {
    // Logger for this class
    private static final Logger logger = LoggerFactory.getLogger(TokenBlacklistService.class);
    
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    public void addToBlacklist(String token) {
        blacklistedTokens.add(token);
        // Log when a token is added to blacklist
        logger.debug("Token added to blacklist: {}", token.substring(0, Math.min(10, token.length())) + "...");
    }
    
    public boolean isBlacklisted(String token) {
        boolean result = blacklistedTokens.contains(token);
        // Log token check results
        if (result) {
            logger.debug("Token found in blacklist: {}", token.substring(0, Math.min(10, token.length())) + "...");
        }
        return result;
    }
    
    public void removeExpiredTokens() {
        // Log before cleanup operation
        logger.info("Starting blacklist cleanup, current size: {}", blacklistedTokens.size());
        
        // Có thể mở rộng để kiểm tra thời gian hết hạn nếu cần
        blacklistedTokens.clear(); // Hiện tại xóa toàn bộ, có thể tối ưu sau
        
        // Log after cleanup is complete
        logger.info("Blacklist cleanup completed");
    }
    
    @PostConstruct
    public void init() {
        // Log when service initializes
        logger.info("TokenBlacklistService initialized");
        
        // Dọn dẹp blacklist mỗi giờ
        scheduler.scheduleAtFixedRate(this::removeExpiredTokens, 1, 1, TimeUnit.HOURS);
        logger.info("Scheduled blacklist cleanup task every 1 hour");
    }
    
    @PreDestroy
    public void cleanup() {
        // Log when service is shutting down
        logger.info("TokenBlacklistService shutting down");
        scheduler.shutdown();
        logger.info("Scheduler shutdown completed");
    }
}