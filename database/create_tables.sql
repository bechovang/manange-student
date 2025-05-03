-- form đk
CREATE TABLE registrations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    facebook_link TEXT,
    full_name VARCHAR(255) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    note TEXT,
    parent_phone VARCHAR(20),
    school VARCHAR(255) NOT NULL,
    student_phone VARCHAR(20),
    subject VARCHAR(50) NOT NULL
);

COMMENT ON COLUMN registrations.grade IS 'Khối lớp từ 6-12';
COMMENT ON COLUMN registrations.subject IS 'Môn học đăng ký';

-- phân quản lí

-- Tạo extension nếu cần
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bảng users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN users.role IS 'admin|teacher|staff';

-- Bảng students
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    school VARCHAR(255) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    phone_student VARCHAR(20),
    phone_parent VARCHAR(20),
    facebook_link VARCHAR(255),
    note VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN students.grade IS 'khối lớp 6 - 12';

-- Bảng teachers
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(50) NOT NULL
);

-- Bảng classes
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teacher_id INTEGER NOT NULL,
    subject VARCHAR(10) NOT NULL,
    room VARCHAR(10) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE RESTRICT
);

COMMENT ON COLUMN classes.subject IS 'math|physic|chemistry|other';
COMMENT ON COLUMN classes.name IS 'VD: Toán 10 NC';

-- Bảng student_classes
CREATE TABLE student_classes (
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    PRIMARY KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

COMMENT ON COLUMN student_classes.status IS 'active|inactive|dropped';

-- Bảng schedule
CREATE TABLE schedule (
    class_id INTEGER NOT NULL,
    weekday VARCHAR(3) NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

COMMENT ON COLUMN schedule.weekday IS 'mon|tue|wed|thu|fri|sat|sun';

-- Bảng financial_accounts
CREATE TABLE financial_accounts (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL UNIQUE,
    current_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    credit_limit DECIMAL(12,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Bảng tuition_plans
CREATE TABLE tuition_plans (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Bảng invoices
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

COMMENT ON COLUMN invoices.status IS 'pending|partial|paid|overdue|cancelled';

-- Bảng invoice_items
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    description VARCHAR(255),
    amount DECIMAL(12,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Bảng transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    invoice_id INTEGER,
    amount DECIMAL(12,2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20),
    reference_number VARCHAR(50),
    description TEXT,
    receipt_image VARCHAR(255),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES financial_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

COMMENT ON COLUMN transactions.transaction_type IS 'payment|tuition|refund|adjustment|discount';

-- Bảng attendance_records
CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    recorded_by INTEGER,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

COMMENT ON COLUMN attendance_records.status IS 'present|absent|late|excused';

-- Bảng notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notification_type VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_rep BOOLEAN DEFAULT FALSE,
    rep_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN notifications.notification_type IS 'payment|attendance|system';

-- Bảng cashier_shifts
CREATE TABLE cashier_shifts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    shift_start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    shift_end_time TIMESTAMP,
    starting_cash DECIMAL(12,2) NOT NULL DEFAULT 0,
    ending_cash_counted DECIMAL(12,2),
    total_cash_received DECIMAL(12,2),
    total_non_cash_received DECIMAL(12,2),
    calculated_ending_cash DECIMAL(12,2),
    cash_discrepancy DECIMAL(12,2),
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    notes TEXT,
    closed_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- COMMENT ON COLUMN cashier_shifts.user_id IS 'ID của nhân viên thu ngân (từ bảng users)';
-- COMMENT ON COLUMN cashier_shifts.shift_start_time IS 'Thời gian bắt đầu nhận ca';
-- COMMENT ON COLUMN cashier_shifts.shift_end_time IS 'Thời gian kết thúc bàn giao ca (null nếu ca đang mở)';
-- COMMENT ON COLUMN cashier_shifts.starting_cash IS 'Số tiền mặt có trong ngăn kéo khi bắt đầu ca';
-- COMMENT ON COLUMN cashier_shifts.ending_cash_counted IS 'Số tiền mặt thực tế đếm được khi kết thúc ca';
-- COMMENT ON COLUMN cashier_shifts.total_cash_received IS 'Tổng tiền mặt thu vào trong ca (từ transactions)';
-- COMMENT ON COLUMN cashier_shifts.total_non_cash_received IS 'Tổng tiền không phải tiền mặt (chuyển khoản, thẻ) thu vào trong ca';
-- COMMENT ON COLUMN cashier_shifts.calculated_ending_cash IS 'Số tiền mặt LẼ RA phải có cuối ca (starting_cash + total_cash_received)';
-- COMMENT ON COLUMN cashier_shifts.cash_discrepancy IS 'Chênh lệch tiền mặt (ending_cash_counted - calculated_ending_cash). Âm là thiếu, dương là thừa';
-- COMMENT ON COLUMN cashier_shifts.status IS 'open|closed|reconciled';
-- COMMENT ON COLUMN cashier_shifts.notes IS 'Ghi chú về ca làm việc, ví dụ: lý do chênh lệch';
-- COMMENT ON COLUMN cashier_shifts.closed_by IS 'user_id người đóng ca (có thể là chính cashier hoặc quản lý)';