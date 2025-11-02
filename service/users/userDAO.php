<?php
// Điều chỉnh đường dẫn tương đối đến file pdo.php
require_once('../../core/pdo.php');

// Định nghĩa tên DB chính xác DỰA TRÊN CẤU TRÚC THỰC TẾ CỦA BẠN
const USER_DB_NAME = 'user_management';

// ------------------------------------
// Phần 1: WRAPPER PDO (DAO Adapter)
// ------------------------------------

/**
 * Wrapper cho pdo_execute, tự động truyền tên DB 
 */
function user_db_execute($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_execute(USER_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho pdo_query (truy vấn nhiều bản ghi), tự động truyền tên DB 
 */
function user_db_query($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query(USER_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một bản ghi, tự động truyền tên DB 
 */
function user_db_query_one($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_one(USER_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một giá trị, tự động truyền tên DB 
 */
function user_db_query_value($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_value(USER_DB_NAME, $sql, $args);
}


// ------------------------------------
// Phần 2: HÀM NGHIỆP VỤ (BUSINESS LOGIC)
// ------------------------------------

/**
 * Lấy tất cả thông tin người dùng từ bảng 'users'.
 * @return array Mảng các bản ghi người dùng.
 */
function select_all_users()
{
    // Sửa tên bảng từ 'user_management' thành 'users' và chỉ chọn các cột cần thiết
    $sql = "SELECT user_id, role_name, full_name, phone_number, email 
            FROM users 
            ORDER BY user_id DESC";

    return user_db_query($sql);
}

// Bổ sung các hàm nghiệp vụ khác (Đăng ký, Đăng nhập,...)
// ...
