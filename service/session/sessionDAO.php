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

// Hàm lấy session từ computer_id trong session đang active
function get_latest_session_by_computer_id($computer_id)
{
    $sql = "SELECT *
            FROM sessions 
            WHERE computer_id = ? AND status = 'actived'
            ORDER BY start_time DESC 
            LIMIT 1";

    return session_db_query_one($sql, $computer_id);
}


//Hàm thêm phiên mới
function add_session($user_id, $computer_id, $full_name, $start_time, $status, $reservation_id)
{
    $sql = "INSERT INTO sessions (user_id, computer_id, full_name ,start_time, status, reservation_id) 
            VALUES (?, ?, ? ,?, ?, ?)";
    return session_db_execute($sql, $user_id, $computer_id, $full_name, $start_time, 'actived', $reservation_id);
}

//Hàm cập nhật trạng thái phiên
function update_status($session_id, $status, $end_time, $total_minutes_played, $total_cost){
    $sql = "UPDATE sessions
            SET status = ?, end_time = ?, total_minutes_played = ?, total_cost = ?
            WHERE session_id = ?";
    return session_db_execute($sql, $status, $end_time, $total_minutes_played, $total_cost ,$session_id);
}

// Hàm lấy danh sách tất cả các phiên theo userID
function get_session_by_user_id($user_id)
{
    $sql = "SELECT * 
            FROM sessions 
            WHERE user_id = ? 
            ORDER BY 
              CASE WHEN status = 'actived' THEN 0 ELSE 1 END,
              start_time DESC";
    return session_db_query($sql, $user_id);
}



