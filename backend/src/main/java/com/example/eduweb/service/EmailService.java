package com.example.eduweb.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.example.eduweb.model.Registration;
import java.util.List;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ExcelService excelService;

    // Danh sách email admin
    private static final List<String> ADMIN_EMAILS = Arrays.asList(
        "phuchcm2006@gmail.com",
        "mcphuchcm2006@gmail.com" // Thay bằng email thứ hai của admin
    );

    public void sendRegistrationEmail(Registration registration) {
        SimpleMailMessage message = new SimpleMailMessage();
        // Gửi đến tất cả email trong danh sách ADMIN_EMAILS
        message.setTo(ADMIN_EMAILS.toArray(new String[0]));
        message.setSubject("📌 Thông báo: Đơn đăng ký mới từ " + registration.getFullName());

        String emailContent = String.format(
            "📢 Một đơn đăng ký mới đã được gửi:\n\n" +
            "🔹 Họ và tên: %s\n" +
            "🔹 SĐT học viên: %s\n" +
            "🔹 SĐT phụ huynh: %s\n" +
            "🔹 Facebook: %s\n" +
            "🔹 Trường: %s\n" +
            "🔹 Môn học: %s\n" +
            "🔹 Khối lớp: %s\n" +
            "🔹 Ghi chú: %s\n\n" +
            "⏳ Ngày gửi: %s\n\n" +
            "📩 Vui lòng kiểm tra hệ thống để xử lý đơn đăng ký.",
            registration.getFullName(),
            registration.getStudentPhone(),
            registration.getParentPhone() != null ? registration.getParentPhone() : "Không có",
            registration.getFacebookLink() != null ? registration.getFacebookLink() : "Không có",
            registration.getSchool(),
            getSubjectName(registration.getSubject()),
            registration.getGrade(),
            registration.getNote() != null ? registration.getNote() : "Không có",
            new SimpleDateFormat("dd/MM/yyyy HH:mm").format(registration.getCreatedAt())
        );

        message.setText(emailContent);
        mailSender.send(message);
    }

    public void sendExcelEmail(List<Registration> registrations) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    
        // Gửi đến tất cả email trong danh sách ADMIN_EMAILS
        helper.setTo(ADMIN_EMAILS.toArray(new String[0]));
        helper.setSubject("📌 File Excel Tổng hợp đơn đăng ký học");
    
        String emailContent = "📢 Danh sách đơn đăng ký học được đính kèm trong file Excel.\n\n" +
                "Vui lòng kiểm tra File để xử lý đơn đăng ký.";
    
        helper.setText(emailContent, true);
    
        ByteArrayInputStream excelStream = excelService.exportRegistrationsToExcel(registrations);
        InputStreamSource attachment = new ByteArrayResource(excelStream.readAllBytes());
    
        helper.addAttachment("DanhSachDonDangKyHoc.xlsx", attachment);
    
        mailSender.send(message);
    }

    private String getSubjectName(String subjectCode) {
        return switch (subjectCode) {
            case "chemistry" -> "Hóa học";
            case "math" -> "Toán học";
            case "physics" -> "Vật lý";
            case "biology" -> "Sinh học";
            default -> subjectCode;
        };
    }
}