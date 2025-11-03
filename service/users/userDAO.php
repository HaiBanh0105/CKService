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

// Hàm kiểm tra đăng nhập
function check_login($email, $password)
{
    $sql = "SELECT user_id, role_name, password_hash, full_name, email FROM users WHERE email = ?";
    $user = user_db_query_one($sql, $email);
    if ($user && password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']);
        return $user;
    }
    return false;
}

// Hàm lấy tất cả người dùng
function select_all_users()
{
    $sql = "SELECT user_id, role_name, full_name, phone_number, email 
            FROM users 
            ORDER BY user_id DESC";

    return user_db_query($sql);
}



//Thêm một bản ghi người dùng mới vào bảng users.
 
function dao_insert_user($role_name, $full_name, $phone_number, $email, $password_hash) {
    $sql = "INSERT INTO users (role_name, full_name, phone_number, email, password_hash) 
            VALUES (?, ?, ?, ?, ?)";
    user_db_execute($sql, $role_name, $full_name, $phone_number, $email, $password_hash);
    return user_db_query_value("SELECT LAST_INSERT_ID()");
}

//Thêm tài khoản thành viên.
 
function dao_insert_membership_account($user_id, $balance) {
    $sql = "INSERT INTO membership_accounts (user_id, current_balance) 
            VALUES (?, ?)";
    user_db_execute($sql, $user_id, $balance);
}

//Thêm giao dịch nạp tiền vào tài khoản thành viên.
function dao_insert_transaction($account_id, $amount, $type = 'topup') {
    $sql = "INSERT INTO transactions (account_id, amount, transaction_type, transaction_date)
            VALUES (?, ?, ?, NOW())";
    user_db_execute($sql, $account_id, $amount, $type);
}

//Hàm load tất cả user khách hàng
function dao_select_all_membership_accounts() {
    $sql = "SELECT * from users u
            JOIN membership_accounts ma ON u.user_id = ma.user_id
            WHERE u.role_name = 'customer'
            ORDER BY u.user_id DESC";
    return user_db_query($sql);
}

