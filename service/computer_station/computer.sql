-- FILE: computer_station_management_service.sql

-- XÓA VÀ TẠO MỚI DATABASE
DROP DATABASE IF EXISTS computer_management;
CREATE DATABASE computer_management;
USE computer_management;

-- 1. Bảng station_configs (Phân Loại Cấu Hình Máy)
CREATE TABLE station_configs (
    config_id INT PRIMARY KEY AUTO_INCREMENT, 
    config_name VARCHAR(50) UNIQUE NOT NULL, 
    cpu_spec VARCHAR(100), 
    gpu_spec VARCHAR(100), 
    ram_spec VARCHAR(100), 
    created_at TIMESTAMP
);

-- 2. Bảng stations (Máy Trạm)
CREATE TABLE stations (
    station_id INT PRIMARY KEY AUTO_INCREMENT, 
    station_name VARCHAR(50) UNIQUE NOT NULL, 
    config_id INT NOT NULL, 
    current_status ENUM('available', 'in_use', 'maintenance', 'offline') NOT NULL, 
    maintenance_notes TEXT, 
    is_remote_locked BOOLEAN DEFAULT 0, 
    last_control_time DATETIME, 

    FOREIGN KEY (config_id) REFERENCES station_configs(config_id)
);

-- 3. Bảng station_prices (Giá Dịch Vụ)
CREATE TABLE station_prices (
    price_id INT PRIMARY KEY AUTO_INCREMENT, 
    config_id INT UNIQUE, 
    price_per_hour DECIMAL(10, 2) NOT NULL, 
    vip_discount_rate DECIMAL(5, 2) DEFAULT 0.00, 
    effective_date DATE NOT NULL, 
    notes VARCHAR(255), 

    FOREIGN KEY (config_id) REFERENCES station_configs(config_id)
);