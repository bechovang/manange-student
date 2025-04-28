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
('Le Van C', '2004-01-10', 'male', 'THPT DEF', '11', '0912345680', '0987654323', 'facebook.com/levanc', 'Hoc sinh moi'),
('Pham Thi D', '2005-07-12', 'female', 'THPT KLM', '10', '0912345681', '0987654324', 'facebook.com/phamthid', 'Hoc gioi tieng Anh'),
('Hoang Van E', '2006-11-05', 'male', 'THPT XYZ', '9', '0912345682', '0987654325', 'facebook.com/hoangvane', 'Can cai thien mon Ly');

-- 3. Teachers (mới thêm vào)
INSERT INTO teachers (name, subject) VALUES
('Nguyen Thi D', 'math'),
('Tran Van E', 'physics'),
('Le Thi F', 'chemistry'),
('Pham Van G', 'math'),
('Hoang Thi H', 'english'),
('Vu Van I', 'biology');

-- 4. Classes (cần có trước khi thêm student_classes, cập nhật để dùng teacher_id)
INSERT INTO classes (name, teacher_id, subject, room, start_date, end_date) VALUES
('Toan 10 NC', 1, 'math', 'P101', '2023-09-01', '2024-05-30'),
('Ly 11 CB', 2, 'physic', 'P102', '2023-09-01', '2024-05-30'),
('Hoa 12', 3, 'chemistry', 'P103', '2023-09-01', '2024-05-30'),
('Toan 9 CB', 4, 'math', 'P104', '2023-09-01', '2024-05-30'),
('Anh 10 NC', 5, 'other', 'P105', '2023-09-01', '2024-05-30');

-- 5. Financial_accounts (phụ thuộc vào students)
INSERT INTO financial_accounts (student_id, current_balance) VALUES
(1, 2000000),
(2, 1500000),
(3, 0),
(4, 3000000),
(5, 500000);

-- 6. Tuition_plans (phụ thuộc vào classes)
INSERT INTO tuition_plans (class_id, amount, effective_date) VALUES
(1, 500000, '2023-09-01'),
(2, 600000, '2023-09-01'),
(3, 700000, '2023-09-01'),
(4, 450000, '2023-09-01'),
(5, 550000, '2023-09-01');

-- 7. Student_classes (phụ thuộc vào students và classes)
INSERT INTO student_classes (student_id, class_id, status) VALUES
(1, 1, 'active'),
(1, 2, 'active'),
(2, 1, 'active'),
(3, 3, 'active'),
(4, 5, 'active'),
(4, 1, 'active'),
(5, 4, 'active'),
(2, 2, 'active');

-- 8. Schedule (phụ thuộc vào classes) - Updated with new time slots
INSERT INTO schedule (class_id, weekday, time_start, time_end) VALUES
(1, 'mon', '08:30:00', '10:00:00'),  -- Toan 10 NC: Mon 8:30-10:00
(1, 'wed', '08:30:00', '10:00:00'),  -- Toan 10 NC: Wed 8:30-10:00
(2, 'tue', '13:30:00', '15:00:00'),  -- Ly 11 CB: Tue 13:30-15:00
(2, 'thu', '13:30:00', '15:00:00'),  -- Ly 11 CB: Thu 13:30-15:00
(3, 'fri', '15:30:00', '17:00:00'),  -- Hoa 12: Fri 15:30-17:00
(4, 'mon', '15:30:00', '17:00:00'),  -- Toan 9 CB: Mon 15:30-17:00
(4, 'thu', '15:30:00', '17:00:00'),  -- Toan 9 CB: Thu 15:30-17:00
(5, 'tue', '07:00:00', '08:30:00'),  -- Anh 10 NC: Tue 7:00-8:30
(5, 'fri', '07:00:00', '08:30:00');   -- Anh 10 NC: Fri 7:00-8:30

-- 9. Invoices (phụ thuộc vào students)
INSERT INTO invoices (student_id, invoice_number, issue_date, due_date, total_amount, paid_amount, status) VALUES
(1, 'INV-202310-001', '2023-10-01', '2023-10-10', 1100000, 1100000, 'paid'),
(2, 'INV-202310-002', '2023-10-01', '2023-10-10', 500000, 300000, 'partial'),
(3, 'INV-202310-003', '2023-10-01', '2023-10-10', 700000, 0, 'pending'),
(4, 'INV-202310-004', '2023-10-01', '2023-10-10', 1050000, 1050000, 'paid'),
(5, 'INV-202310-005', '2023-10-01', '2023-10-10', 450000, 200000, 'partial');

-- 10. Invoice_items (phụ thuộc vào invoices và classes)
INSERT INTO invoice_items (invoice_id, class_id, amount, quantity, subtotal) VALUES
(1, 1, 500000, 1, 500000),
(1, 2, 600000, 1, 600000),
(2, 1, 500000, 1, 500000),
(3, 3, 700000, 1, 700000),
(4, 5, 550000, 1, 550000),
(4, 1, 500000, 1, 500000),
(5, 4, 450000, 1, 450000);

-- 11. Transactions (phụ thuộc vào financial_accounts và invoices)
INSERT INTO transactions (account_id, invoice_id, amount, transaction_type, payment_method, created_by) VALUES
(1, 1, -1100000, 'tuition', NULL, 1),
(1, 1, 1100000, 'payment', 'bank', 4),
(2, 2, -500000, 'tuition', NULL, 1),
(2, 2, 300000, 'payment', 'cash', 4),
(3, 3, -700000, 'tuition', NULL, 1),
(4, 4, -1050000, 'tuition', NULL, 1),
(4, 4, 1050000, 'payment', 'bank', 4),
(5, 5, -450000, 'tuition', NULL, 1),
(5, 5, 200000, 'payment', 'cash', 4);

-- 12. Attendance_records (phụ thuộc vào students và classes)
INSERT INTO attendance_records (student_id, class_id, date, status, recorded_by) VALUES
(1, 1, '2023-10-02', 'present', 2),
(1, 2, '2023-10-03', 'present', 3),
(2, 1, '2023-10-02', 'absent', 2),
(3, 3, '2023-10-06', 'late', 3),
(4, 5, '2023-10-03', 'present', 2),
(4, 1, '2023-10-02', 'excused', 2),
(5, 4, '2023-10-02', 'present', 2),
(1, 1, '2023-10-09', 'present', 2),
(2, 1, '2023-10-09', 'present', 2),
(3, 3, '2023-10-13', 'absent', 3);

-- 13. Notifications (không phụ thuộc)
INSERT INTO notifications (phone, title, content, notification_type) VALUES
('0987654321', 'Thong bao hoc phi', 'Vui long thanh toan hoc phi thang 10', 'payment'),
('0912345679', 'Thong bao nghi hoc', 'Ngay mai lop nghi do co giao ban', 'attendance'),
('0987654322', 'Thong bao he thong', 'He thong se bao tri vao 20/10', 'system'),
('0987654324', 'Thong bao lop hoc', 'Lop tieng Anh se chuyen sang phong moi', 'attendance'),
('0987654325', 'Thong bao hoc phi', 'Vui long thanh toan phan hoc phi con lai', 'payment');