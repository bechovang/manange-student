package com.example.eduweb.config;



import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void unauthenticatedRequestToPublicEndpoint_ShouldSucceed() throws Exception {
        mockMvc.perform(get("/api/auth/public"))
                .andExpect(status().isNotFound()); // 404 vì endpoint này không tồn tại, nhưng không bị chặn
    }
    
    @Test
    void unauthenticatedRequestToProtectedEndpoint_ShouldFail() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isForbidden()); // 403 vì không có token
    }
    
    @Test
    @WithMockUser(roles = "USER")
    void authenticatedRequestWithUserRole_ShouldSucceed() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isNotFound()); // 404 vì endpoint không tồn tại, nhưng không bị chặn bởi security
    }
    
    @Test
    @WithMockUser(roles = "USER")
    void userRoleAccessingAdminEndpoint_ShouldFail() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void adminRoleAccessingAdminEndpoint_ShouldSucceed() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isNotFound()); // 404 vì endpoint không tồn tại, nhưng không bị chặn bởi security
    }
}

