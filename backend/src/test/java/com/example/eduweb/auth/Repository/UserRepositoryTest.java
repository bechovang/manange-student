package com.example.eduweb.auth.Repository;



import com.example.eduweb.auth.model.User;
import com.example.eduweb.auth.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void findByUsername_ShouldReturnUser_WhenUserExists() {
        // Given
        User user = new User();
        user.setUsername("testuser");
        user.setPasswordHash("password");
        user.setRole("USER");
        entityManager.persist(user);
        entityManager.flush();
        
        // When
        Optional<User> found = userRepository.findByUsername(user.getUsername());
        
        // Then
        assertTrue(found.isPresent());
        assertEquals(user.getUsername(), found.get().getUsername());
    }
    
    @Test
    void findByUsername_ShouldReturnEmpty_WhenUserDoesNotExist() {
        // When
        Optional<User> found = userRepository.findByUsername("nonexistent");
        
        // Then
        assertFalse(found.isPresent());
    }
    
    @Test
    void existsByUsername_ShouldReturnTrue_WhenUsernameExists() {
        // Given
        User user = new User();
        user.setUsername("existinguser");
        user.setPasswordHash("password");
        user.setRole("USER");
        entityManager.persist(user);
        entityManager.flush();
        
        // When
        boolean exists = userRepository.existsByUsername(user.getUsername());
        
        // Then
        assertTrue(exists);
    }
}