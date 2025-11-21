<?php
// Điều chỉnh đường dẫn tương đối đến file pdo.php
require_once('../../core/pdo.php');

// Định nghĩa tên DB chính xác DỰA TRÊN CẤU TRÚC THỰC TẾ CỦA BẠN
const PAYMENT_DB_NAME = 'payment';

// ------------------------------------
// Phần 1: WRAPPER PDO (DAO Adapter)
// ------------------------------------

/**
 * Wrapper cho pdo_execute, tự động truyền tên DB 
 */
function payment_db_execute($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_execute(PAYMENT_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho pdo_query (truy vấn nhiều bản ghi), tự động truyền tên DB 
 */
function payment_db_query($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query(PAYMENT_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một bản ghi, tự động truyền tên DB 
 */
function payment_db_query_one($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_one(PAYMENT_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một giá trị, tự động truyền tên DB 
 */
function payment_db_query_value($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_value(PAYMENT_DB_NAME, $sql, $args);
}


// ------------------------------------
// Phần 2: HÀM NGHIỆP VỤ (BUSINESS LOGIC)
// ------------------------------------


function add_customer_payment(
    $staff_id,
    $user_id,
    $session_id,
    $computer_id,
    $start_time,
    $end_time,
    $total_duration_minutes,
    $deposit_amount,
    $total_amount,
    $payment_method,
    $payment_status = "pending",
    $is_guest = 0,
    $guest_name = null,
    $notes = null
) {
    $sql = "INSERT INTO payments (
                staff_id,
                user_id,
                session_id,
                computer_id,
                start_time,
                end_time,
                total_duration_minutes,
                deposit_amount,
                total_amount,
                payment_method,
                payment_status,
                is_guest,
                guest_name,
                notes
            ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    return payment_db_execute(
        $sql,
        $staff_id,
        $user_id,
        $session_id,
        $computer_id,
        $start_time,
        $end_time,
        $total_duration_minutes,
        $deposit_amount,
        $total_amount,
        $payment_method,
        $payment_status,
        $is_guest,
        $guest_name,
        $notes
    );
}


function add_guest_payment(
    $staff_id,
    $session_id,
    $computer_id,
    $guest_name,
    $start_time,
    $end_time,
    $total_duration_minutes,
    $total_amount,
    $payment_method,
    $payment_status,
    $notes = null
) {
    $sql = "INSERT INTO payments (
                staff_id,
                user_id,
                session_id,
                computer_id,
                start_time,
                end_time,
                total_duration_minutes,
                deposit_amount,
                total_amount,
                payment_method,
                payment_status,
                is_guest,
                guest_name,
                notes
            ) VALUES (
                ?,NULL, ?, ?, ?, ?, ?, 0, ?, ?, ?, 1, ?, ?
            )";

    return payment_db_execute(
        $sql,
        $staff_id,
        $session_id,
        $computer_id,
        $start_time,
        $end_time,
        $total_duration_minutes,
        $total_amount,
        $payment_method,
        $payment_status,
        $guest_name,
        $notes
    );
}

