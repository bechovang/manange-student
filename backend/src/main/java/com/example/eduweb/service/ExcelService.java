package com.example.eduweb.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import com.example.eduweb.model.Registration;

@Service
public class ExcelService {
    public ByteArrayInputStream exportRegistrationsToExcel(List<Registration> registrations) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Đơn đăng ký");
        
        // Create header style
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);

        // Create normal data style
        CellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setBorderBottom(BorderStyle.THIN);
        dataStyle.setBorderTop(BorderStyle.THIN);
        dataStyle.setBorderLeft(BorderStyle.THIN);
        dataStyle.setBorderRight(BorderStyle.THIN);

        // Create red text style for today's registrations
        CellStyle todayDataStyle = workbook.createCellStyle();
        todayDataStyle.setBorderBottom(BorderStyle.THIN);
        todayDataStyle.setBorderTop(BorderStyle.THIN);
        todayDataStyle.setBorderLeft(BorderStyle.THIN);
        todayDataStyle.setBorderRight(BorderStyle.THIN);
        Font todayFont = workbook.createFont();
        todayFont.setColor(IndexedColors.RED.getIndex());
        todayDataStyle.setFont(todayFont);

        Row headerRow = sheet.createRow(0);
        String[] columns = {
            "ID", "Họ và tên", "SĐT học sinh", "SĐT phụ huynh", 
            "Facebook", "Trường", "Môn học", "Khối lớp", 
            "Ghi chú", "Ngày đăng ký"
        };
        
        // Create header cells
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
            sheet.autoSizeColumn(i);
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        Date today = Calendar.getInstance().getTime();
        
        // Create data rows
        int rowIdx = 1;
        for (Registration reg : registrations) {
            Row row = sheet.createRow(rowIdx++);
            
            // Check if registration is from today
            boolean isToday = isSameDay(today, reg.getCreatedAt());
            CellStyle style = isToday ? todayDataStyle : dataStyle;
            
            createCell(row, 0, reg.getId() != null ? reg.getId().toString() : "", style);
            createCell(row, 1, reg.getFullName(), style);
            createCell(row, 2, reg.getStudentPhone(), style);
            createCell(row, 3, reg.getParentPhone() != null ? reg.getParentPhone() : "", style);
            createCell(row, 4, reg.getFacebookLink() != null ? reg.getFacebookLink() : "", style);
            createCell(row, 5, reg.getSchool(), style);
            createCell(row, 6, getSubjectName(reg.getSubject()), style);
            createCell(row, 7, reg.getGrade(), style);
            createCell(row, 8, reg.getNote() != null ? reg.getNote() : "", style);
            createCell(row, 9, dateFormat.format(reg.getCreatedAt()), style);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void createCell(Row row, int column, String value, CellStyle style) {
        Cell cell = row.createCell(column);
        cell.setCellValue(value);
        cell.setCellStyle(style);
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

    private boolean isSameDay(Date date1, Date date2) {
        if (date1 == null || date2 == null) {
            return false;
        }
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(date1);
        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(date2);
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
               cal1.get(Calendar.MONTH) == cal2.get(Calendar.MONTH) &&
               cal1.get(Calendar.DAY_OF_MONTH) == cal2.get(Calendar.DAY_OF_MONTH);
    }
}