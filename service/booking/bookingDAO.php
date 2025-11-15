<?php
// Điều chỉnh đường dẫn tương đối đến file pdo.php
require_once('../../core/pdo.php');

// Định nghĩa tên DB chính xác DỰA TRÊN CẤU TRÚC THỰC TẾ CỦA BẠN
const BOOKING_DB_NAME = 'booking_reservation';

// ------------------------------------
// Phần 1: WRAPPER PDO (DAO Adapter)
// ------------------------------------

/**
 * Wrapper cho pdo_execute, tự động truyền tên DB 
 */
function booking_db_execute($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_execute(BOOKING_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho pdo_query (truy vấn nhiều bản ghi), tự động truyền tên DB 
 */
function booking_db_query($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query(BOOKING_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một bản ghi, tự động truyền tên DB 
 */
function booking_db_query_one($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_one(BOOKING_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một giá trị, tự động truyền tên DB 
 */
function booking_db_query_value($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_value(BOOKING_DB_NAME, $sql, $args);
}


// ------------------------------------
// Phần 2: HÀM NGHIỆP VỤ (BUSINESS LOGIC)
// ------------------------------------

// Hàm lấy user_id từ computer_id trong booking gần nhất
function get_user_id_by_computer_id_in_booking($computer_id)
{
    $sql = "
        SELECT r.user_id
        FROM reservation_details rd
        JOIN reservations r ON rd.reservation_id = r.reservation_id
        WHERE rd.computer_id = ?
        ORDER BY r.booking_time DESC
        LIMIT 1; ";

    return booking_db_query_value($sql, $computer_id);
}

// Hàm đặt chổ mới
function insert_reservation($user_id, $booking_time, $start_time, $total_duration_hours, $status, $deposit, $notes)
{
    $sql = "INSERT INTO reservations (user_id, booking_time, start_time, total_duration_hours, status, deposit, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    return booking_db_execute($sql, $user_id, $booking_time, $start_time, $total_duration_hours, $status, $deposit, $notes);
}

// Hàm thêm chi tiết đặt chổ mới
function insert_reservation_detail($reservation_id, $computer_id, $config_id)
{
    $sql = "INSERT INTO reservation_details (reservation_id, computer_id, config_id)
            VALUES (?, ?, ?)";
    return booking_db_execute($sql, $reservation_id, $computer_id, $config_id);
}

// Lấy lịch sử đặt chỗ theo user_id
function dao_get_reservations_by_user($user_id) {
    $sql = "SELECT reservation_id, user_id, booking_time, start_time, 
                   total_duration_hours, status, deposit, notes
            FROM reservations
            WHERE user_id = ?
            ORDER BY booking_time DESC";
    return booking_db_query($sql, $user_id);
}

