

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
    current_status ENUM('available', 'in_use', 'maintenance') NOT NULL, 
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
    effective_date DATE NOT NULL, 
    notes VARCHAR(255), 

    FOREIGN KEY (config_id) REFERENCES computer_configs(config_id)
);

INSERT INTO computer_configs (config_name, cpu_spec, gpu_spec, ram_spec)
VALUES 
  ('Basic', 'Intel Core i3-10100', 'Intel UHD 630', '8GB DDR4'),
  ('Gaming', 'Intel Core i7-12700K', 'NVIDIA RTX 3060', '16GB DDR4'),
  ('Workstation', 'AMD Ryzen 9 7950X', 'NVIDIA Quadro RTX 4000', '32GB DDR5');

INSERT INTO computers (computer_name, config_id, current_status)
VALUES 
('PC01', 1, 'available'),
('PC02', 2, 'available'),
('PC03', 3, 'available'),
('PC04', 1, 'available'),
('PC05', 2, 'available'),
('PC06', 3, 'available'),
('PC07', 1, 'available'),
('PC08', 2, 'available'),
('PC09', 3, 'available'),
('PC10', 1, 'available'),
('PC11', 2, 'available'),
('PC12', 3, 'available'),
('PC13', 1, 'available'),
('PC14', 2, 'available'),
('PC15', 3, 'available'),
('PC16', 1, 'available'),
('PC17', 2, 'available'),
('PC18', 3, 'available'),
('PC19', 1, 'available'),
('PC20', 2, 'available'),
('PC21', 3, 'available'),
('PC22', 1, 'available'),
('PC23', 2, 'available'),
('PC24', 3, 'available'),
('PC25', 1, 'available'),
('PC26', 2, 'available'),
('PC27', 3, 'available'),
('PC28', 1, 'available'),
('PC29', 2, 'available'),
('PC30', 3, 'available');


INSERT INTO computer_prices (config_id, price_per_hour, effective_date, notes)
VALUES
(1, 15000.00, NOW(), 'Giá cho cấu hình Basic'),
(2, 30000.00, NOW(), 'Giá cho cấu hình Gaming'),
(3, 50000.00, NOW(), 'Giá cho cấu hình Workstation');