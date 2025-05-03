-- =====================================================================
-- ==                  EDUWEB SAMPLE DATA INSERT SCRIPT               ==
-- =====================================================================
-- Chay script nay sau khi da tao tat ca cac bang.
-- No se them du lieu mau vao tat ca cac bang theo thu tu phu thuoc.
-- =====================================================================

-- (Tuy chon) Xoa du lieu cu theo thu tu nguoc lai de tranh loi khoa ngoai
/*
DELETE FROM registrations;
DELETE FROM cashier_shifts;
DELETE FROM notifications;
DELETE FROM attendance_records;
DELETE FROM transactions;
DELETE FROM invoice_items;
DELETE FROM invoices;
DELETE FROM schedule;
DELETE FROM student_classes;
DELETE FROM tuition_plans;
DELETE FROM financial_accounts;
DELETE FROM classes;
DELETE FROM teachers;
DELETE FROM students;
DELETE FROM users;
*/

-- =====================================================================
-- 1. Bang USERS (Khong phu thuoc)
-- =====================================================================
INSERT INTO users (id, username, password_hash, email, role) VALUES
(1, 'admin', '$2a$10$xJwL5v5Jz7t6VhD5x5Yz5eR5z5Y5z5Y5', 'admin@school.com', 'admin'),
(2, 'teacher1', '$2a$10$xJwL5v5Jz7t6VhD5x5Yz5eR5z5Y5z5Y5', 'teacher1@school.com', 'teacher'),
(3, 'teacher2', '$2a$10$xJwL5v5Jz7t6VhD5x5Yz5eR5z5Y5z5Y5', 'teacher2@school.com', 'teacher'),
(4, 'staff1', '$2a$10$xJwL5v5Jz7t6VhD5x5Yz5eR5z5Y5z5Y5', 'staff1@school.com', 'staff') -- Thu ngan chinh cho ca
ON CONFLICT (id) DO NOTHING; -- Bo qua neu ID da ton tai

-- Dat lai sequence neu can (sau khi INSERT tuong minh ID)
-- SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- =====================================================================
-- 2. Bang TEACHERS (Khong phu thuoc)
-- =====================================================================
INSERT INTO teachers (id, name, subject) VALUES
(1, 'Nguyen Thi D', 'math'),
(2, 'Tran Van E', 'physics'),
(3, 'Le Thi F', 'chemistry'),
(4, 'Pham Van G', 'math'),
(5, 'Hoang Thi H', 'english'),
(6, 'Vu Van I', 'biology')
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('teachers_id_seq', (SELECT MAX(id) FROM teachers));

-- =====================================================================
-- 3. Bang STUDENTS (Khong phu thuoc)
-- =====================================================================
INSERT INTO students (id, name, date_of_birth, gender, school, grade, phone_student, phone_parent, facebook_link, note) VALUES
(1, 'Nguyen Van A', '2005-03-15', 'male', 'THPT ABC', '10', '0912345678', '0987654321', 'facebook.com/nguyenvana', 'Hoc sinh cham chi'),
(2, 'Tran Thi B', '2006-05-20', 'female', 'THPT XYZ', '9', '0912345679', '0987654322', 'facebook.com/tranthib', 'Can ho tro toan'),
(3, 'Le Van C', '2004-01-10', 'male', 'THPT DEF', '11', '0912345680', '0987654323', 'facebook.com/levanc', 'Hoc sinh moi'),
(4, 'Pham Thi D', '2005-07-12', 'female', 'THPT KLM', '10', '0912345681', '0987654324', 'facebook.com/phamthid', 'Hoc gioi tieng Anh'),
(5, 'Hoang Van E', '2006-11-05', 'male', 'THPT XYZ', '9', '0912345682', '0987654325', 'facebook.com/hoangvane', 'Can cai thien mon Ly')
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('students_id_seq', (SELECT MAX(id) FROM students));

-- =====================================================================
-- 4. Bang CLASSES (Phu thuoc vao TEACHERS)
-- =====================================================================
INSERT INTO classes (id, name, teacher_id, subject, room, start_date, end_date) VALUES
(1, 'Toan 10 NC', 1, 'math', 'P101', '2023-09-01', '2024-05-30'),
(2, 'Ly 11 CB', 2, 'physic', 'P102', '2023-09-01', '2024-05-30'),
(3, 'Hoa 12', 3, 'chemistry', 'P103', '2023-09-01', '2024-05-30'),
(4, 'Toan 9 CB', 4, 'math', 'P104', '2023-09-01', '2024-05-30'),
(5, 'Anh 10 NC', 5, 'other', 'P105', '2023-09-01', '2024-05-30')
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('classes_id_seq', (SELECT MAX(id) FROM classes));

-- =====================================================================
-- 5. Bang FINANCIAL_ACCOUNTS (Phu thuoc vao STUDENTS)
-- =====================================================================
INSERT INTO financial_accounts (id, student_id, current_balance, credit_limit) VALUES
(1, 1, 2000000, 0),
(2, 2, 1500000, 0),
(3, 3, 0, 500000), -- Cho phep no 500k
(4, 4, 3000000, 0),
(5, 5, 500000, 0)
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('financial_accounts_id_seq', (SELECT MAX(id) FROM financial_accounts));

-- =====================================================================
-- 6. Bang TUITION_PLANS (Phu thuoc vao CLASSES)
-- =====================================================================
INSERT INTO tuition_plans (id, class_id, amount, effective_date) VALUES
(1, 1, 500000, '2023-09-01'),
(2, 2, 600000, '2023-09-01'),
(3, 3, 700000, '2023-09-01'),
(4, 4, 450000, '2023-09-01'),
(5, 5, 550000, '2023-09-01')
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('tuition_plans_id_seq', (SELECT MAX(id) FROM tuition_plans));

-- =====================================================================
-- 7. Bang STUDENT_CLASSES (Phu thuoc vao STUDENTS va CLASSES)
-- =====================================================================
INSERT INTO student_classes (student_id, class_id, status, enrollment_date) VALUES
(1, 1, 'active', '2023-09-05'),
(1, 2, 'active', '2023-09-05'),
(2, 1, 'active', '2023-09-06'),
(3, 3, 'active', '2023-09-07'),
(4, 5, 'active', '2023-09-08'),
(4, 1, 'inactive', '2023-09-08'), -- Vi du hoc sinh da nghi lop nay
(5, 4, 'active', '2023-09-09'),
(2, 2, 'dropped', '2023-10-15') -- Vi du hoc sinh bo hoc giua chung
ON CONFLICT (student_id, class_id) DO NOTHING; -- Khoa chinh la (student_id, class_id)

-- =====================================================================
-- 8. Bang SCHEDULE (Phu thuoc vao CLASSES)
-- =====================================================================
INSERT INTO schedule (class_id, weekday, time_start, time_end) VALUES
(1, 'mon', '08:30:00', '10:00:00'),
(1, 'wed', '08:30:00', '10:00:00'),
(2, 'tue', '13:30:00', '15:00:00'),
(2, 'thu', '13:30:00', '15:00:00'),
(3, 'fri', '15:30:00', '17:00:00'),
(4, 'mon', '15:30:00', '17:00:00'),
(4, 'thu', '15:30:00', '17:00:00'),
(5, 'tue', '07:00:00', '08:30:00'),
(5, 'fri', '07:00:00', '08:30:00');

-- =====================================================================
-- 9. Bang INVOICES (Phu thuoc vao STUDENTS)
-- =====================================================================
INSERT INTO invoices (id, student_id, invoice_number, issue_date, due_date, total_amount, paid_amount, status, notes) VALUES
(1, 1, 'INV-202405-001', '2024-05-01', '2024-05-10', 1100000, 1100000, 'paid', 'Hoa don thang 5 cho Nguyen Van A'),
(2, 2, 'INV-202405-002', '2024-05-01', '2024-05-10', 500000, 300000, 'partial', 'Hoa don thang 5 cho Tran Thi B'),
(3, 3, 'INV-202405-003', '2024-05-01', '2024-05-10', 700000, 0, 'pending', 'Hoa don thang 5 cho Le Van C'),
(4, 4, 'INV-202405-004', '2024-05-01', '2024-05-10', 1050000, 1050000, 'paid', 'Hoa don thang 5 cho Pham Thi D'),
(5, 5, 'INV-202405-005', '2024-05-01', '2024-05-10', 450000, 200000, 'partial', 'Hoa don thang 5 cho Hoang Van E'),
(6, 1, 'INV-202406-001', '2024-06-01', '2024-06-10', 1100000, 0, 'pending', 'Hoa don thang 6 cho Nguyen Van A') -- Hoa don chua thanh toan
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('invoices_id_seq', (SELECT MAX(id) FROM invoices));

-- =====================================================================
-- 10. Bang INVOICE_ITEMS (Phu thuoc vao INVOICES va CLASSES)
-- =====================================================================
INSERT INTO invoice_items (id, invoice_id, class_id, description, amount, quantity, subtotal) VALUES
(1, 1, 1, 'Hoc phi Toan 10 NC T5', 500000, 1, 500000),
(2, 1, 2, 'Hoc phi Ly 11 CB T5', 600000, 1, 600000),
(3, 2, 1, 'Hoc phi Toan 10 NC T5', 500000, 1, 500000),
(4, 3, 3, 'Hoc phi Hoa 12 T5', 700000, 1, 700000),
(5, 4, 5, 'Hoc phi Anh 10 NC T5', 550000, 1, 550000),
(6, 4, 1, 'Hoc phi Toan 10 NC T5', 500000, 1, 500000), -- Hoc sinh D hoc 2 lop
(7, 5, 4, 'Hoc phi Toan 9 CB T5', 450000, 1, 450000),
(8, 6, 1, 'Hoc phi Toan 10 NC T6', 500000, 1, 500000), -- Item cho hoa don thang 6
(9, 6, 2, 'Hoc phi Ly 11 CB T6', 600000, 1, 600000)  -- Item cho hoa don thang 6
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('invoice_items_id_seq', (SELECT MAX(id) FROM invoice_items));

-- =====================================================================
-- 11. Bang TRANSACTIONS (Phu thuoc vao FINANCIAL_ACCOUNTS, INVOICES, USERS)
-- Chua cac giao dich tao hoc phi va cac giao dich thanh toan (ca cu va moi cho test ca)
-- =====================================================================
-- Giao dich tao hoc phi tu dong (gia su do he thong/admin id=1 tao)
INSERT INTO transactions (account_id, invoice_id, amount, transaction_type, created_by, created_at) VALUES
(1, 1, -1100000, 'tuition', 1, '2024-05-01 00:00:01'),
(2, 2, -500000, 'tuition', 1, '2024-05-01 00:00:02'),
(3, 3, -700000, 'tuition', 1, '2024-05-01 00:00:03'),
(4, 4, -1050000, 'tuition', 1, '2024-05-01 00:00:04'),
(5, 5, -450000, 'tuition', 1, '2024-05-01 00:00:05'),
(1, 6, -1100000, 'tuition', 1, '2024-06-01 00:00:01'); -- Hoc phi thang 6

-- Giao dich thanh toan (do staff1 id=4 thuc hien, dung de test tinh toan ca)
-- ** QUAN TRONG: created_at PHAI khop voi thoi gian cua cac ca lam viec **

-- Thanh toan cho Ca ngay 10/05/2024 (Shift ID 1)
INSERT INTO transactions (account_id, invoice_id, amount, transaction_type, payment_method, created_by, created_at, description) VALUES
(1, 1, 500000.00, 'payment', 'cash', 4, '2024-05-10 09:30:00', 'Nop tien mat T5 dot 1'),
(2, 2, 300000.00, 'payment', 'cash', 4, '2024-05-10 11:15:00', 'Nop tien mat T5 dot 1'),
(4, 4, 1050000.00, 'payment', 'bank', 4, '2024-05-10 14:00:00', 'Chuyen khoan T5 du'),
(5, 5, 200000.00, 'payment', 'cash', 4, '2024-05-10 15:45:00', 'Nop tien mat T5 dot 1');

-- Thanh toan cho Ca ngay 11/05/2024 (Shift ID 2)
INSERT INTO transactions (account_id, invoice_id, amount, transaction_type, payment_method, created_by, created_at, description) VALUES
(3, 3, 700000.00, 'payment', 'cash', 4, '2024-05-11 10:00:00', 'Nop du T5 tien mat'),
(1, NULL, 150000.00, 'payment', 'transfer', 4, '2024-05-11 12:00:00', 'Chuyen khoan le'), -- Thanh toan le khong qua invoice cu the
(2, 2, 200000.00, 'payment', 'cash', 4, '2024-05-11 14:30:00', 'Nop them T5 tien mat'); -- Hoc sinh B nop them

-- Thanh toan cho Ca ngay 12/05/2024 (Shift ID 3)
INSERT INTO transactions (account_id, invoice_id, amount, transaction_type, payment_method, created_by, created_at, description) VALUES
(5, 5, 250000.00, 'payment', 'cash', 4, '2024-05-12 08:45:00', 'Nop du T5 tien mat'),
(4, NULL, 800000.00, 'payment', 'bank', 4, '2024-05-12 11:00:00', 'Chuyen khoan T6'), -- Thanh toan truoc cho T6
(1, 6, 400000.00, 'payment', 'cash', 4, '2024-05-12 13:15:00', 'Nop truoc T6 tien mat'); -- Thanh toan truoc cho T6

-- Thanh toan cho Ca ngay 13/05/2024 (Shift ID 4 - Ca dang mo)
INSERT INTO transactions (account_id, invoice_id, amount, transaction_type, payment_method, created_by, created_at, description) VALUES
(2, NULL, 100000.00, 'payment', 'cash', 4, '2024-05-13 09:00:00', 'Nop them tien mat'); -- Giao dich trong ca dang mo

-- SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions));

-- =====================================================================
-- 12. Bang ATTENDANCE_RECORDS (Phu thuoc vao STUDENTS, CLASSES, USERS)
-- =====================================================================
INSERT INTO attendance_records (student_id, class_id, date, status, recorded_by, notes) VALUES
(1, 1, '2024-05-06', 'present', 2, NULL), -- teacher1 diem danh
(1, 2, '2024-05-07', 'present', 3, NULL), -- teacher2 diem danh
(2, 1, '2024-05-06', 'absent', 2, 'Nghi co phep'),
(3, 3, '2024-05-10', 'late', 3, 'Vao muon 10 phut'),
(4, 5, '2024-05-07', 'present', 2, NULL),
(4, 1, '2024-05-06', 'absent', 2, 'Don xin nghi'),
(5, 4, '2024-05-06', 'present', 2, NULL),
(1, 1, '2024-05-13', 'present', 2, NULL), -- Diem danh ngay hom nay
(2, 1, '2024-05-13', 'present', 2, NULL)
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('attendance_records_id_seq', (SELECT MAX(id) FROM attendance_records));

-- =====================================================================
-- 13. Bang NOTIFICATIONS (Khong co khoa ngoai cung)
-- =====================================================================
INSERT INTO notifications (id, phone, title, content, notification_type, is_read, read_at, is_rep, rep_at) VALUES
(1, '0987654321', 'Nhac no hoc phi thang 5', 'HS Nguyen Van A con no 0d', 'payment', true, '2024-05-02 10:00:00', false, null),
(2, '0987654322', 'Nhac no hoc phi thang 5', 'HS Tran Thi B con no 200000d', 'payment', false, null, false, null),
(3, '0912345679', 'Thong bao nghi hoc dot xuat', 'Lop Ly 11 CB ngay 14/05 nghi do giao vien ban cong tac.', 'attendance', false, null, false, null),
(4, '0987654323', 'Nhac no hoc phi thang 5', 'HS Le Van C con no 700000d', 'payment', false, null, false, null),
(5, '0987654325', 'Nhac no hoc phi thang 5', 'HS Hoang Van E con no 250000d', 'payment', true, '2024-05-12 09:00:00', true, '2024-05-12 09:05:00') -- Da doc va da phan hoi
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));

-- =====================================================================
-- 14. Bang CASHIER_SHIFTS (Phu thuoc vao USERS)
-- Du lieu duoc tinh toan dua tren cac giao dich INSERT o tren
-- =====================================================================
-- Ca 1: Da ket thuc, khong sai lech (Gia dinh Shift ID = 1)
INSERT INTO cashier_shifts (id, user_id, shift_start_time, shift_end_time, starting_cash, ending_cash_counted,
                           total_cash_received, total_non_cash_received, calculated_ending_cash,
                           cash_discrepancy, status, notes, closed_by, created_at, updated_at) VALUES
(1, 4, '2024-05-10 08:00:00', '2024-05-10 16:00:00', 500000.00, 1500000.00,
   1000000.00, 1050000.00, 1500000.00,
   0.00, 'RECONCILED', 'Ca lam viec ngay 10/05, khong co sai lech.', 1, '2024-05-10 08:00:00', '2024-05-10 16:05:00')
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id, shift_start_time = EXCLUDED.shift_start_time, shift_end_time = EXCLUDED.shift_end_time, starting_cash = EXCLUDED.starting_cash, ending_cash_counted = EXCLUDED.ending_cash_counted,
    total_cash_received = EXCLUDED.total_cash_received, total_non_cash_received = EXCLUDED.total_non_cash_received, calculated_ending_cash = EXCLUDED.calculated_ending_cash,
    cash_discrepancy = EXCLUDED.cash_discrepancy, status = EXCLUDED.status, notes = EXCLUDED.notes, closed_by = EXCLUDED.closed_by, updated_at = EXCLUDED.updated_at;

-- Ca 2: Đã kết thúc, thiếu tiền (Giả định Shift ID = 2)
INSERT INTO cashier_shifts (id, user_id, shift_start_time, shift_end_time, starting_cash, ending_cash_counted,
                           total_cash_received, total_non_cash_received, calculated_ending_cash,
                           cash_discrepancy, status, notes, closed_by, created_at, updated_at) VALUES
(2, 4, '2024-05-11 08:00:00', '2024-05-11 16:00:00', 500000.00, 1400000.00,
   950000.00, 150000.00, 1450000.00,
   -50000.00, 'CLOSED', 'Thieu 50.000d ngay 11/05, co the do tra nham tien thua.', 4, '2024-05-11 08:00:00', '2024-05-11 16:03:00')
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id, shift_start_time = EXCLUDED.shift_start_time, shift_end_time = EXCLUDED.shift_end_time, starting_cash = EXCLUDED.starting_cash, ending_cash_counted = EXCLUDED.ending_cash_counted,
    total_cash_received = EXCLUDED.total_cash_received, total_non_cash_received = EXCLUDED.total_non_cash_received, calculated_ending_cash = EXCLUDED.calculated_ending_cash,
    cash_discrepancy = EXCLUDED.cash_discrepancy, status = EXCLUDED.status, notes = EXCLUDED.notes, closed_by = EXCLUDED.closed_by, updated_at = EXCLUDED.updated_at;

-- Ca 3: Đã kết thúc, thừa tiền (Giả định Shift ID = 3)
INSERT INTO cashier_shifts (id, user_id, shift_start_time, shift_end_time, starting_cash, ending_cash_counted,
                           total_cash_received, total_non_cash_received, calculated_ending_cash,
                           cash_discrepancy, status, notes, closed_by, created_at, updated_at) VALUES
(3, 4, '2024-05-12 08:00:00', '2024-05-12 16:00:00', 500000.00, 1170000.00,
   650000.00, 800000.00, 1150000.00,
   20000.00, 'CLOSED', 'Thua 20.000d ngay 12/05, co the khach dua thua.', 1, '2024-05-12 08:00:00', '2024-05-12 16:08:00')
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id, shift_start_time = EXCLUDED.shift_start_time, shift_end_time = EXCLUDED.shift_end_time, starting_cash = EXCLUDED.starting_cash, ending_cash_counted = EXCLUDED.ending_cash_counted,
    total_cash_received = EXCLUDED.total_cash_received, total_non_cash_received = EXCLUDED.total_non_cash_received, calculated_ending_cash = EXCLUDED.calculated_ending_cash,
    cash_discrepancy = EXCLUDED.cash_discrepancy, status = EXCLUDED.status, notes = EXCLUDED.notes, closed_by = EXCLUDED.closed_by, updated_at = EXCLUDED.updated_at;

-- Ca 4: Ca đang mở (Giả định Shift ID = 4)
INSERT INTO cashier_shifts (id, user_id, shift_start_time, shift_end_time, starting_cash, ending_cash_counted,
                           total_cash_received, total_non_cash_received, calculated_ending_cash,
                           cash_discrepancy, status, notes, closed_by, created_at, updated_at) VALUES
(4, 4, '2024-05-13 08:00:00', NULL, 500000.00, NULL,
   NULL, NULL, NULL,
   NULL, 'OPEN', NULL, NULL, '2024-05-13 08:00:00', '2024-05-13 08:00:00')
ON CONFLICT (id) DO UPDATE SET -- Cho phép cập nhật ca đang mở nếu chạy lại script
    user_id = EXCLUDED.user_id, shift_start_time = EXCLUDED.shift_start_time, shift_end_time = EXCLUDED.shift_end_time, starting_cash = EXCLUDED.starting_cash, ending_cash_counted = EXCLUDED.ending_cash_counted,
    total_cash_received = EXCLUDED.total_cash_received, total_non_cash_received = EXCLUDED.total_non_cash_received, calculated_ending_cash = EXCLUDED.calculated_ending_cash,
    cash_discrepancy = EXCLUDED.cash_discrepancy, status = EXCLUDED.status, notes = EXCLUDED.notes, closed_by = EXCLUDED.closed_by, updated_at = EXCLUDED.updated_at;

-- SELECT setval('cashier_shifts_id_seq', (SELECT MAX(id) FROM cashier_shifts));

-- =====================================================================
-- 15. Bang REGISTRATIONS (Khong phu thuoc)
-- =====================================================================
INSERT INTO registrations (id, full_name, grade, school, student_phone, parent_phone, facebook_link, subject, note, created_at) VALUES
(1, 'Dang Ky Moi A', '10', 'THPT Alpha', '0901112233', '0905556677', 'fb.com/dkmoiA', 'math', 'Hoc sinh muon hoc lop nang cao', '2024-05-01 10:00:00'),
(2, 'Dang Ky Moi B', '9', 'THCS Beta', '0902223344', '0906667788', NULL, 'physic', NULL, '2024-05-02 14:30:00'),
(3, 'Dang Ky Moi C', '11', 'THPT Gamma', '0903334455', '0907778899', 'fb.com/dkmoiC', 'chemistry', 'Can tu van them ve lo trinh', '2024-05-03 09:15:00')
ON CONFLICT (id) DO NOTHING;
-- SELECT setval('registrations_id_seq', (SELECT MAX(id) FROM registrations));

-- =====================================================================
-- ==                  SCRIPT INSERT HOAN TAT                      ==
-- =====================================================================