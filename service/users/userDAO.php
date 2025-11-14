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

//Lấy thông tin người dùng theo user_id
function select_user_by_id($user_id)
{
    $sql = "SELECT user_id, role_name, full_name, phone_number, email 
            FROM users 
            WHERE user_id = ?";

    return user_db_query_one($sql, $user_id);
}

//Lấy thông tin khách hàng theo user_id
function select_customer_by_id($user_id)
{
    $sql = "SELECT 
                u.user_id, 
                u.role_name, 
                u.full_name, 
                u.phone_number, 
                u.email,
                m.current_balance,
                m.membership_level,
                m.status,
                m.last_topup_date
            FROM users u
            LEFT JOIN membership_accounts m ON u.user_id = m.user_id
            WHERE u.user_id = ?";

    return user_db_query_one($sql, $user_id);
}


//Lấy thông tin người dùng theo full_name
function get_user_by_full_name($full_name){
    $sql = "SELECT * FROM users WHERE full_name = ?";
    return user_db_query($sql, $full_name);
}


//Hàm load tất cả user khách hàng
function dao_select_all_membership_accounts()
{
    $sql = "SELECT * from users u
            JOIN membership_accounts ma ON u.user_id = ma.user_id
            WHERE u.role_name = 'customer'
            ORDER BY u.user_id DESC";
    return user_db_query($sql);
}

// Hàm load tất cả user nhân viên
function dao_select_all_staff()
{
    $sql = "SELECT user_id, role_name, full_name, phone_number, email 
            FROM users 
            WHERE role_name = 'staff'
            ORDER BY user_id DESC";

    return user_db_query($sql);
}

// Thêm một bản ghi người dùng mới vào bảng users.
function dao_insert_user($role_name, $full_name, $phone_number, $email, $password_hash)
{
    $sql = "INSERT INTO users (role_name, full_name, phone_number, email, password_hash) 
            VALUES (?, ?, ?, ?, ?)";
    user_db_execute($sql, $role_name, $full_name, $phone_number, $email, $password_hash);
    return user_db_query_value("SELECT LAST_INSERT_ID()");
}



// Thêm tài khoản thành viên và trả về account_id
function dao_insert_membership_account($user_id, $balance)
{
    $sql = "INSERT INTO membership_accounts (user_id, current_balance) 
            VALUES (?, ?)";
    user_db_execute($sql, $user_id, $balance);
    return user_db_query_value("SELECT LAST_INSERT_ID()");
}

// Thêm giao dịch nạp tiền vào tài khoản thành viên
function dao_insert_transaction($account_id, $amount, $type = 'topup')
{
    $sql = "INSERT INTO transactions (account_id, amount, transaction_type, transaction_date)
            VALUES (?, ?, ?, NOW())";
    user_db_execute($sql, $account_id, $amount, $type);
}

// Hàm lấy lịch sử giao dịch của một tài khoản thành viên
function dao_get_transaction_history($account_id)
{
    error_log("Truy vấn lịch sử cho account_id = " . $account_id);
    $sql = "SELECT transaction_id, amount, transaction_type, transaction_date
            FROM transactions
            WHERE account_id = ?
            ORDER BY transaction_date DESC";
    return user_db_query($sql, $account_id);
}

//Hàm cập nhật thông tin người dùng
function dao_update_user($user_id, $full_name, $phone_number, $email)
{
    $sql = "UPDATE users 
            SET full_name = ?, phone_number = ?, email = ? 
            WHERE user_id = ?";
    user_db_execute($sql, $full_name, $phone_number, $email, $user_id);
}

//Hàm kiểm tra email đã tồn tại
function is_email_exists($email, $exclude_user_id = null)
{
    $sql = "SELECT COUNT(*) FROM users WHERE email = ?";
    $params = [$email];

    if ($exclude_user_id !== null) {
        $sql .= " AND user_id != ?";
        $params[] = $exclude_user_id;
    }

    $count = user_db_query_value($sql, ...$params);
    return $count > 0;
}


//Hàm kiểm tra số điện thoại đã tồn tại
function is_phone_number_exists($phone_number, $exclude_user_id = null)
{
    $sql = "SELECT COUNT(*) FROM users WHERE phone_number = ?";
    $params = [$phone_number];

    if ($exclude_user_id !== null) {
        $sql .= " AND user_id != ?";
        $params[] = $exclude_user_id;
    }

    $count = user_db_query_value($sql, ...$params);
    return $count > 0;
}

