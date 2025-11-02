-- FILE: booking_reservation_service.sql

-- XÓA VÀ TẠO MỚI DATABASE
DROP DATABASE IF EXISTS booking_reservation;
CREATE DATABASE booking_reservation;
USE booking_reservation;

-- 1. Bảng reservations (Thông Tin Đặt Chỗ)
CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT, 
    user_id INT NOT NULL, -- Khóa Logic đến UMS
    booking_time DATETIME NOT NULL, 
    start_time DATETIME NOT NULL, 
    total_duration_minutes INT NOT NULL, 
    total_stations_booked INT NOT NULL, 
    status ENUM('pending', 'confirmed', 'cancelled', 'checked_in') NOT NULL, 
    source VARCHAR(50) DEFAULT 'website', 
    deposit DECIMAL(10, 2) DEFAULT 0.00, 
    deposit_transaction_id BIGINT, -- Khóa Logic đến Payment Service
    notes TEXT, 
    
    INDEX idx_user_id (user_id),
    INDEX idx_start_time (start_time)
);

-- 2. Bảng reservation_details (Chi Tiết Máy Đặt)
CREATE TABLE reservation_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT, 
    reservation_id INT NOT NULL, 
    station_id INT NOT NULL, -- Khóa Logic đến CSMS
    config_id INT NOT NULL, 
    assigned_at DATETIME, 
    checkin_status ENUM('no_show', 'checked_in', 'pending') DEFAULT 'pending', 

    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id),
    INDEX idx_station_id (station_id)
);

-- 3. Bảng waiting_queue (Quản Lý Hàng Đợi)
CREATE TABLE waiting_queue (
    queue_id INT PRIMARY KEY AUTO_INCREMENT, 
    user_id INT NOT NULL, -- Khóa Logic đến UMS
    desired_config_id INT NOT NULL, 
    queue_time DATETIME NOT NULL, 
    priority_level INT DEFAULT 1, 
    is_notified BOOLEAN DEFAULT 0, 
    fulfilled_time DATETIME, 

    INDEX idx_desired_config (desired_config_id),
    INDEX idx_user_id (user_id)
);