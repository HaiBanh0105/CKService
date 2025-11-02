-- FILE: notification_service.sql

-- XÓA VÀ TẠO MỚI DATABASE
DROP DATABASE IF EXISTS notification;
CREATE DATABASE notification;
USE notification;

-- 1. Bảng notifications (Thông Báo)
CREATE TABLE notifications (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    recipient_user_id INT NOT NULL, -- Khóa Logic đến UMS
    recipient_type ENUM('customer', 'staff', 'admin', 'all') NOT NULL, 
    message_title VARCHAR(255) NOT NULL, 
    message_body TEXT NOT NULL, 
    notification_type ENUM('session_alert', 'fnb_update', 'tech_issue', 'promotion') NOT NULL, 
    source_service VARCHAR(50) NOT NULL, 
    source_ref_id BIGINT, 
    status ENUM('sent', 'failed', 'read', 'archived') NOT NULL, 
    sent_at DATETIME NOT NULL, 
    read_at DATETIME, 
    delivery_channel ENUM('in_app', 'email', 'sms'), 
    
    INDEX idx_recipient (recipient_user_id, recipient_type),
    INDEX idx_source (source_service, source_ref_id)
);