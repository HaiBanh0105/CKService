-- FILE: user.sql

-- XÓA VÀ TẠO MỚI DATABASE
DROP DATABASE IF EXISTS user_management;
CREATE DATABASE user_management;
USE user_management;

-- 1. Bảng users (Người Dùng)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name ENUM('admin', 'staff', 'customer') NOT NULL, 
    full_name VARCHAR(255) NOT NULL, 
    phone_number VARCHAR(20) UNIQUE NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL, 
    password_hash VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

-- 2. Bảng membership_accounts (Tài Khoản Thành Viên/Ví Nội Bộ)
CREATE TABLE membership_accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL, -- Khóa Logic đến users
    current_balance DECIMAL(10, 2) DEFAULT 0.00, 
    membership_level VARCHAR(50) DEFAULT 'Standard', 
    status VARCHAR(50) DEFAULT 'active', 
    last_topup_date DATETIME, 
    INDEX idx_user_id (user_id) 
);

-- 3. Bảng transactions (Giao Dịch Nạp Tiền)
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL, -- Khóa Logic đến membership_accounts
    amount DECIMAL(10, 2) NOT NULL, 
    staff_id INT, -- Khóa Logic đến users
    transaction_type ENUM('topup', 'adjustment') NOT NULL DEFAULT 'topup',
    transaction_date DATETIME NOT NULL, 

    INDEX idx_account_id (account_id),
    INDEX idx_staff_id (staff_id)
);


DELIMITER $$

CREATE PROCEDURE change_balance(
    IN p_user_id INT,
    IN p_amount DECIMAL(10,2)
)
BEGIN
    DECLARE v_balance DECIMAL(10,2);

    -- Lấy số dư hiện tại
    SELECT current_balance INTO v_balance
    FROM membership_accounts
    WHERE user_id = p_user_id;

    -- Nếu số dư hiện tại không tồn tại (user_id sai)
    IF v_balance IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Không tìm thấy tài khoản cho user_id này';
    END IF;

    -- Nếu số dư sau khi thay đổi < 0 thì báo lỗi
    IF v_balance + p_amount < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Số dư không đủ để thực hiện giao dịch';
    ELSE
        -- Cập nhật số dư
        UPDATE membership_accounts
        SET current_balance = current_balance + p_amount,
            last_topup_date = IF(p_amount > 0, NOW(), last_topup_date)
        WHERE user_id = p_user_id;
    END IF;
END$$

DELIMITER ;


INSERT INTO users (role_name, full_name, phone_number, email, password_hash)
VALUES (
  'admin',
  'Admin Chính',
  '0900000000',
  'vodathai91thcsduclap@gmail.com',
  '$2y$10$cmkRPvk2P6y1n4ZZpzOAmuTpajA.lqgOxWuE6dQTzD1EH128KFJBe'  // hai123456
);