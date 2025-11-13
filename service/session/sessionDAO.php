<?php
// Điều chỉnh đường dẫn tương đối đến file pdo.php
require_once('../../core/pdo.php');

// Định nghĩa tên DB chính xác DỰA TRÊN CẤU TRÚC THỰC TẾ CỦA BẠN
const SESSION_DB_NAME = 'session_management';

// ------------------------------------
// Phần 1: WRAPPER PDO (DAO Adapter)
// ------------------------------------

/**
 * Wrapper cho pdo_execute, tự động truyền tên DB 
 */
function session_db_execute($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_execute(SESSION_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho pdo_query (truy vấn nhiều bản ghi), tự động truyền tên DB 
 */
function session_db_query($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query(SESSION_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một bản ghi, tự động truyền tên DB 
 */
function session_db_query_one($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_one(SESSION_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một giá trị, tự động truyền tên DB 
 */
function session_db_query_value($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_value(SESSION_DB_NAME, $sql, $args);
}


// ------------------------------------
// Phần 2: HÀM NGHIỆP VỤ (BUSINESS LOGIC)
// ------------------------------------

// Hàm lấy user_id từ computer_id trong session đang active
function get_user_id_by_computer_id($computer_id)
{
    $sql = "SELECT user_id 
            FROM sessions 
            WHERE computer_id = ? AND status = 'active' 
            ORDER BY start_time DESC 
            LIMIT 1";
    
    return session_db_query_value($sql, $computer_id);
}

//Hàm thêm phiên mới
function add_session($user_id, $computer_id, $start_time, $status)
{
    $sql = "INSERT INTO sessions (user_id, computer_id, start_time, status) 
            VALUES (?, ?, ?, ?)";
    return session_db_execute($sql, $user_id, $computer_id, $start_time, $status);
}

