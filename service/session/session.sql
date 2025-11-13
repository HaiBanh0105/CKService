DROP DATABASE IF EXISTS session_management;
CREATE DATABASE session_management;
USE session_management;

CREATE TABLE sessions (
  session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  computer_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL, 
  start_time DATETIME NOT NULL,
  end_time DATETIME DEFAULT NULL ,
  total_minutes_played INT DEFAULT 0 ,
  total_cost DECIMAL(10,2) DEFAULT 0.00, 
  status ENUM('actived','ended') DEFAULT 'actived')

  
  