-- FILE: payment_billing_service.sql

-- XÓA VÀ TẠO MỚI DATABASE
DROP DATABASE IF EXISTS payment;
CREATE DATABASE payment;
USE payment;

-- 1. Bảng invoices (Hóa Đơn)
CREATE TABLE invoices (
    invoice_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    user_id INT NOT NULL, -- Khóa Logic đến UMS
    issue_date DATETIME NOT NULL, 
    due_date DATETIME, 
    subtotal DECIMAL(10, 2) NOT NULL, 
    total_discount DECIMAL(10, 2) NOT NULL, 
    final_amount DECIMAL(10, 2) NOT NULL, 
    total_paid DECIMAL(10, 2) NOT NULL, 
    status ENUM('paid', 'pending', 'cancelled', 'overdue'), 
    billing_period VARCHAR(50), 
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- 2. Bảng billing_items (Mục Tính Cước)
CREATE TABLE billing_items (
    billing_item_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    session_id BIGINT NOT NULL, -- Khóa Logic đến Session Service
    user_id INT NOT NULL, -- Khóa Logic đến UMS
    invoice_id BIGINT, -- Khóa Logic đến invoices
    item_type ENUM('session', 'fnb_order', 'deposit') NOT NULL, 
    reference_id BIGINT, 
    description VARCHAR(255), 
    quantity DECIMAL(10, 2) DEFAULT 1.00, 
    unit_price DECIMAL(10, 2) NOT NULL, 
    total_amount DECIMAL(10, 2) NOT NULL, 
    discount_amount DECIMAL(10, 2) DEFAULT 0.00, 
    net_amount DECIMAL(10, 2) NOT NULL, 
    created_at DATETIME NOT NULL, 

    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id),
    INDEX idx_session_id (session_id)
);

-- 3. Bảng transactions (Lịch Sử Giao Dịch Tài Chính)
CREATE TABLE transactions (
    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    user_id INT NOT NULL, -- Khóa Logic đến UMS
    transaction_type ENUM('topup', 'payment', 'refund', 'adjustment') NOT NULL, 
    payment_method VARCHAR(50) NOT NULL, 
    amount DECIMAL(10, 2) NOT NULL, 
    status ENUM('success', 'failed', 'pending') NOT NULL, 
    reference_invoice_id BIGINT, 
    transaction_date DATETIME NOT NULL, 
    staff_id INT, -- Khóa Logic đến UMS
    
    FOREIGN KEY (reference_invoice_id) REFERENCES invoices(invoice_id),
    INDEX idx_user_id (user_id)


--     CREATE TABLE session_payments (
--     payment_id INT AUTO_INCREMENT PRIMARY KEY,
--     session_id INT NOT NULL,
--     user_id INT NULL,
--     is_guest TINYINT(1) DEFAULT 0,
--     guest_name VARCHAR(100),
--     computer_id INT NOT NULL,
--     start_time DATETIME NOT NULL,
--     end_time DATETIME,
--     total_duration_hours INT NOT NULL,
--     deposit_amount INT DEFAULT 0,
--     total_amount INT NOT NULL,
--     paid_amount INT DEFAULT 0,
--     payment_method ENUM('cash','card','momo','zalopay') NOT NULL,
--     payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
--     transaction_id VARCHAR(100),
--     notes TEXT,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
-- );

);