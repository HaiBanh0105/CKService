<?php
require_once 'userDAO.php';

/**
 * Đăng ký người dùng mới (khách hàng)
 * @return int user_id
 * @throws Exception nếu có lỗi
 */
function register_new_user($full_name, $phone_number, $email, $password, $role_name, $initial_balance)
{
    // Kiểm tra trùng lặp trước khi insert
    if (is_phone_number_exists($phone_number)) {
        throw new Exception("Số điện thoại này đã được đăng ký.");
    }

    if (is_email_exists($email)) {
        throw new Exception("Địa chỉ email này đã được sử dụng.");
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Bắt đầu transaction
        user_db_execute("START TRANSACTION");

        // 1. Tạo người dùng
        $user_id = dao_insert_user($role_name, $full_name, $phone_number, $email, $password_hash);
        if (!$user_id) {
            throw new Exception("Không thể tạo người dùng.");
        }

        // 2. Nếu là khách hàng, tạo tài khoản thành viên
        if ($role_name === 'customer') {
            $account_id = dao_insert_membership_account($user_id, $initial_balance);
            if (!$account_id) {
                throw new Exception("Không thể tạo tài khoản thành viên.");
            }

            // 3. Nếu có số dư ban đầu, tạo giao dịch nạp tiền
            if ($initial_balance > 0) {
                dao_insert_transaction($account_id, $initial_balance, 'topup');
            }
        }

        // Commit nếu mọi thứ OK
        user_db_execute("COMMIT");
        return $user_id;
    } catch (Exception $e) {
        user_db_execute("ROLLBACK");
        throw $e;
    }
}


// Câp nhật thông tin người dùng
function update_user_info($user_id, $full_name, $phone_number, $email)
{
    if (is_email_exists($email, $user_id)) {
        throw new Exception("Email đã được sử dụng bởi người dùng khác.");
    }

    if (is_phone_number_exists($phone_number, $user_id)) {
        throw new Exception("Số điện thoại đã được sử dụng bởi người dùng khác.");
    }

    dao_update_user($user_id, $full_name, $phone_number, $email);
}

// thay đổi số dư
function change_balance($user_id, $amount)
{
    $current_balance = dao_get_balance($user_id);
    if ($current_balance === null) {
        return ["status" => "error", "message" => "Không tìm thấy tài khoản"];
    }

    $new_balance = $current_balance + $amount;
    if ($new_balance < 0) {
        return ["status" => "error", "message" => "Số dư không đủ để thực hiện giao dịch"];
    }

    // Cập nhật số dư
    dao_update_balance($user_id, $new_balance, $amount > 0);

    // Ghi giao dịch
    $account_id = dao_get_account_id($user_id);
    $type = $amount > 0 ? 'topup' : 'deduct';
    dao_insert_transaction($account_id, $amount, $type);

    return [
        "status" => "success",
        "message" => "Số dư đã được cập nhật",
        "new_balance" => $new_balance
    ];
}
