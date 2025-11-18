-- FILE: payment_billing_service.sql

-- XÓA VÀ TẠO MỚI DATABASE
DROP DATABASE IF EXISTS payment;
CREATE DATABASE payment;
USE payment;


    CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_if INT NOT NULL,
    user_id INT NULL,
    session_id INT NOT NULL,
    is_guest TINYINT(1) DEFAULT 0,
    guest_name VARCHAR(100),
    computer_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    total_duration_hours INT NOT NULL,
    deposit_amount INT DEFAULT 0,
    total_amount INT NOT NULL,
    payment_method ENUM('cash','card','momo','zalopay','account') NOT NULL,
    payment_status ENUM('pending','paid') DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


