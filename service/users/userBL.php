<?php
require_once 'userDAO.php';

/**
 * Đăng ký người dùng mới (khách hàng)
 * @return int user_id
 * @throws Exception nếu có lỗi
 */
function register_new_user($full_name, $phone_number, $email, $password, $role_name, $initial_balance)
{
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Bắt đầu transaction
        user_db_execute("START TRANSACTION");

        // 1. Tạo người dùng
        $user_id = dao_insert_user($role_name, $full_name, $phone_number, $email, $password_hash);
        error_log("user_id sau insert: " . var_export($user_id, true));
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
    } catch (PDOException $e) {
        user_db_execute("ROLLBACK");

        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            $msg = (strpos($e->getMessage(), 'phone_number') !== false)
                ? "Số điện thoại này đã được đăng ký."
                : "Địa chỉ email này đã được sử dụng.";
            throw new Exception($msg);
        }

        throw new Exception("Lỗi Database: " . $e->getMessage());
    } catch (Exception $e) {
        user_db_execute("ROLLBACK");
        throw $e;
    }
}
