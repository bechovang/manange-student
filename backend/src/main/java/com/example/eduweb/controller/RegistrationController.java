package com.example.eduweb.controller;

import com.example.eduweb.model.Registration;
import com.example.eduweb.repository.RegistrationRepository;
import com.example.eduweb.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = {"http://localhost:3000", 
                    "https://edu-web-frontend.vercel.app",
                    "https://trungtamanhbinhminh-bechovangs-projects.vercel.app",
                    "https://trungtamanhbinhminh-bechovang-bechovangs-projects.vercel.app"},
            allowedHeaders = "*",
            methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS},
            allowCredentials = "true")
public class RegistrationController {

    private static final Logger logger = LoggerFactory.getLogger(RegistrationController.class);

    @Autowired
    private RegistrationRepository repository;

    @Autowired
    private EmailService emailService;

    // Mã màu ANSI
    private static final String GREEN = "\u001B[32m";
    private static final String RESET = "\u001B[0m";

    @PostMapping
    public ResponseEntity<String> registerStudent(@RequestBody Registration registration) {
        System.out.println(GREEN + "\n============================");
        System.out.println("API registration da nhan request: " + registration);
        System.out.println("============================\n" + RESET);

        Registration savedRegistration = repository.save(registration);
        emailService.sendRegistrationEmail(savedRegistration);

        logger.info("Dang ky thanh cong: {}", savedRegistration);

        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @GetMapping("/export-excel")
    public ResponseEntity<String> exportAndSendExcel() {
        System.out.println(GREEN + "\n============================");
        System.out.println("API export Excel da nhan request: ");
        System.out.println("============================\n" + RESET);
        try {
            List<Registration> registrations = repository.findAll();
            if (registrations.isEmpty()) {
                return ResponseEntity.badRequest().body("Không có dữ liệu đăng ký để xuất.");
            }
    
            emailService.sendExcelEmail(registrations);
    
            System.out.println(GREEN + "\n============================");
            System.out.println("Da gui file Excel ve mail cua admin ");
            System.out.println("============================\n" + RESET);
    
            return ResponseEntity.ok("Email with the Excel file has been sent successfully!");
        } catch (Exception e) {
            logger.error("Error while sending email with Excel attachment: ", e);
            return ResponseEntity.internalServerError().body("Failed to send email.");
        }
    }
    
    // Thêm endpoint OPTIONS để xử lý preflight request
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }
}