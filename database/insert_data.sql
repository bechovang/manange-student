-- 1. Users (không phụ thuộc vào bảng nào)
INSERT INTO users (username, password_hash, email, role) VALUES
('admin', '$2a$10$xJwL5v5Jz7t6VhD5x5Yz5eR5z5Y5z5Y5', 'admin@school.com', 'admin'),
('teacher1', '$2a$10$xJwL5v5Jz7t6VhD5x5Yz5eR5z5Y5z5Y5', 'teacher1@school.com', 'teacher'),
('teacher2', '$2a$10$xJwL5v5Jz7t6VhD5x5Yz5eR5z5Y5z5Y5', 'teacher2@school.com', 'teacher'),
('staff1', '$2a$10$xJwL5v5Jz7t6VhD5x5Yz5eR5z5Y5z5Y5', 'staff1@school.com', 'staff');

-- 2. Students (bảng cha của nhiều bảng khác)
INSERT INTO students (name, date_of_birth, gender, school, grade, phone_student, phone_parent, facebook_link, note) VALUES
('Nguyen Van A', '2005-03-15', 'male', 'THPT ABC', '10', '0912345678', '0987654321', 'facebook.com/nguyenvana', 'Hoc sinh cham chi'),
('Tran Thi B', '2006-05-20', 'female', 'THPT XYZ', '9', '0912345679', '0987654322', 'facebook.com/tranthib', 'Can ho tro toan'),
('Le Van C', '2004-01-10', 'male', 'THPT DEF', '11', '0912345680', '0987654323', 'facebook.com/levanc', 'Hoc sinh moi');

-- 3. Classes (cần có trước khi thêm student_classes)
INSERT INTO classes (name, teacher, subject, room, start_date, end_date) VALUES
('Toan 10 NC', 'Nguyen Thi D', 'math', 'P101', '2023-09-01', '2024-05-30'),
('Ly 11 CB', 'Tran Van E', 'physic', 'P102', '2023-09-01', '2024-05-30'),
('Hoa 12', 'Le Thi F', 'chemistry', 'P103', '2023-09-01', '2024-05-30');

-- 4. Financial_accounts (phụ thuộc vào students)
INSERT INTO financial_accounts (student_id, current_balance) VALUES
(1, 2000000),
(2, 1500000),
(3, 0);

-- 5. Tuition_plans (phụ thuộc vào classes)
INSERT INTO tuition_plans (class_id, amount, effective_date) VALUES
(1, 500000, '2023-09-01'),
(2, 600000, '2023-09-01'),
(3, 700000, '2023-09-01');

-- 6. Student_classes (phụ thuộc vào students và classes)
INSERT INTO student_classes (student_id, class_id, status) VALUES
(1, 1, 'active'),
(1, 2, 'active'),
(2, 1, 'active'),
(3, 3, 'active');

-- 7. Schedule (phụ thuộc vào classes)
INSERT INTO schedule (class_id, weekday, time_start, time_end) VALUES
(1, 'mon', '08:00:00', '10:00:00'),
(1, 'wed', '08:00:00', '10:00:00'),
(2, 'tue', '13:00:00', '15:00:00'),
(2, 'thu', '13:00:00', '15:00:00'),
(3, 'fri', '15:00:00', '17:00:00');

-- 8. Invoices (phụ thuộc vào students)
INSERT INTO invoices (student_id, invoice_number, issue_date, due_date, total_amount, paid_amount, status) VALUES
(1, 'INV-202310-001', '2023-10-01', '2023-10-10', 1100000, 1100000, 'paid'),
(2, 'INV-202310-002', '2023-10-01', '2023-10-10', 500000, 300000, 'partial'),
(3, 'INV-202310-003', '2023-10-01', '2023-10-10', 700000, 0, 'pending');

-- 9. Invoice_items (phụ thuộc vào invoices và classes)
INSERT INTO invoice_items (invoice_id, class_id, amount, quantity, subtotal) VALUES
(1, 1, 500000, 1, 500000),
(1, 2, 600000, 1, 600000),
(2, 1, 500000, 1, 500000),
(3, 3, 700000, 1, 700000);

-- 10. Transactions (phụ thuộc vào financial_accounts và invoices)
INSERT INTO transactions (account_id, invoice_id, amount, transaction_type, payment_method, created_by) VALUES
(1, 1, -1100000, 'tuition', NULL, 1),
(1, 1, 1100000, 'payment', 'bank', 4),
(2, 2, -500000, 'tuition', NULL, 1),
(2, 2, 300000, 'payment', 'cash', 4),
(3, 3, -700000, 'tuition', NULL, 1);

-- 11. Attendance_records (phụ thuộc vào students và classes)
INSERT INTO attendance_records (student_id, class_id, date, status, recorded_by) VALUES
(1, 1, '2023-10-02', 'present', 2),
(1, 2, '2023-10-03', 'present', 3),
(2, 1, '2023-10-02', 'absent', 2),
(3, 3, '2023-10-06', 'late', 3);

-- 12. Notifications (không phụ thuộc)
INSERT INTO notifications (phone, title, content, notification_type) VALUES
('0987654321', 'Thong bao hoc phi', 'Vui long thanh toan hoc phi thang 10', 'payment'),
('0912345679', 'Thong bao nghi hoc', 'Ngay mai lop nghi do co giao ban', 'attendance'),
('0987654322', 'Thong bao he thong', 'He thong se bao tri vao 20/10', 'system');