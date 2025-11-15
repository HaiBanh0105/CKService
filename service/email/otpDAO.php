<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Điều chỉnh đường dẫn tương đối đến file pdo.php
require_once('../../core/pdo.php');

// Định nghĩa tên DB chính xác DỰA TRÊN CẤU TRÚC THỰC TẾ CỦA BẠN
const OTP_DB_NAME = 'otps_management';

// ------------------------------------
// Phần 1: WRAPPER PDO (DAO Adapter)
// ------------------------------------

/**
 * Wrapper cho pdo_execute, tự động truyền tên DB 
 */
function otp_db_execute($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_execute(OTP_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho pdo_query (truy vấn nhiều bản ghi), tự động truyền tên DB 
 */
function otp_db_query($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query(OTP_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một bản ghi, tự động truyền tên DB 
 */
function otp_db_query_one($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_one(OTP_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một giá trị, tự động truyền tên DB 
 */
function otp_db_query_value($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_value(OTP_DB_NAME, $sql, $args);
}


// ------------------------------------
// Phần 2: HÀM NGHIỆP VỤ (BUSINESS LOGIC)
// ------------------------------------


// Thêm OTP mới
function otp_insert($user_id, $otp_code, $purpose, $expires_at)
{
    $sql = "INSERT INTO otp_codes (user_id, otp_code, purpose, expires_at) 
            VALUES (?, ?, ?, ?)";
    return otp_db_execute($sql, $user_id, $otp_code, $purpose, $expires_at);
}

// Kiểm tra OTP
function otp_verify($user_id, $otp_code, $purpose)
{
    $sql = "SELECT * FROM otp_codes 
            WHERE user_id = ? 
              AND otp_code = ? 
              AND purpose = ? 
              AND is_used = 0 
              AND expires_at > NOW()";
    $row = otp_db_query_one($sql, $user_id, $otp_code, $purpose);

    if ($row) {
        // Đánh dấu đã dùng
        $update = "UPDATE otp_codes SET is_used = 1 WHERE otp_id = ?";
        otp_db_execute($update, $row['otp_id']);
        return true;
    }
    return false;
}

// Sinh OTP ngẫu nhiên
function otp_generate($length = 6)
{
    return str_pad(random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
}
