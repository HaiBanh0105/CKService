

-- XÓA VÀ TẠO MỚI DATABASE
DROP DATABASE IF EXISTS computer_management;
CREATE DATABASE computer_management;
USE computer_management;

-- 1. Bảng computer_configs (Phân Loại Cấu Hình Máy)
CREATE TABLE computer_configs (
    config_id INT PRIMARY KEY AUTO_INCREMENT, 
    config_name ENUM('Basic', 'Gaming', 'Workstation') NOT NULL, 
    cpu_spec VARCHAR(100), 
    gpu_spec VARCHAR(100), 
    ram_spec VARCHAR(100), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng computers (Máy Trạm)
CREATE TABLE computers (
    computer_id INT PRIMARY KEY AUTO_INCREMENT, 
    computer_name VARCHAR(50) UNIQUE NOT NULL, 
    config_id INT NOT NULL, 
    current_status ENUM('available', 'in_use', 'maintenance', 'offline') NOT NULL, 
    maintenance_notes TEXT, 
    is_remote_locked BOOLEAN DEFAULT 0, 
    last_control_time DATETIME, 

    FOREIGN KEY (config_id) REFERENCES computer_configs(config_id)
);

-- 3. Bảng computer_prices (Giá Dịch Vụ)
CREATE TABLE computer_prices (
    price_id INT PRIMARY KEY AUTO_INCREMENT, 
    config_id INT UNIQUE, 
    price_per_hour DECIMAL(10, 2) NOT NULL, 
    vip_discount_rate DECIMAL(5, 2) DEFAULT 0.00, 
    effective_date DATE NOT NULL, 
    notes VARCHAR(255), 

    FOREIGN KEY (config_id) REFERENCES computer_configs(config_id)
);

INSERT INTO computer_configs (config_name, cpu_spec, gpu_spec, ram_spec)
VALUES 
  ('Basic', 'Intel Core i3-10100', 'Intel UHD 630', '8GB DDR4'),
  ('Gaming', 'Intel Core i7-12700K', 'NVIDIA RTX 3060', '16GB DDR4'),
  ('Workstation', 'AMD Ryzen 9 7950X', 'NVIDIA Quadro RTX 4000', '32GB DDR5');