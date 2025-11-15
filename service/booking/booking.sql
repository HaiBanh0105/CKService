-- FILE: booking_reservation_service.sql

-- XÓA VÀ TẠO MỚI DATABASE
DROP DATABASE IF EXISTS booking_reservation;
CREATE DATABASE booking_reservation;
USE booking_reservation;

-- 1. Bảng reservations (Thông Tin Đặt Chỗ)
CREATE TABLE reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  booking_time DATETIME NOT NULL,
  start_time DATETIME NOT NULL,
  total_duration_hours DOUBLE NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') NOT NULL,
  deposit DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT
);


-- 2. Bảng reservation_details (Chi Tiết Máy Đặt)
CREATE TABLE reservation_details (
  detail_id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL,
  computer_id INT NOT NULL,
  config_id INT NOT NULL,
  FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);



