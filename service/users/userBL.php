<?php
// TÊN FILE: service/users/UserBL.php (Business Logic)

require_once 'userDAO.php'; // Chứa các hàm DAO cơ bản

/**
 * [BL] Thực hiện toàn bộ quy trình Đăng ký Người Dùng.
 * (Tạo user, tạo account, tạo transaction ban đầu)
 * @throws Exception
 * @return int user_id mới được tạo
 */
function register_new_user($full_name, $phone_number, $email, $password, $role_name = 'customer', $initial_balance = 0.00) {
    
    // 1. Mã hóa mật khẩu (Đây là nghiệp vụ, KHÔNG PHẢI DAO)
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // 2. Chèn USER (Gọi DAO)
        $user_id = dao_insert_user($role_name, $full_name, $phone_number, $email, $password_hash);

        // 3. Nếu là khách hàng, tạo tài khoản thành viên (Logic nghiệp vụ)
        if ($user_id && $role_name === 'customer') {
            dao_insert_membership_account($user_id, $initial_balance);
            
            // 4. Tạo giao dịch ban đầu nếu có số dư
            if ($initial_balance > 0) {
                // Lấy ID tài khoản thành viên vừa tạo (vì nó là UNIQUE)
                $account_id = user_db_query_value("SELECT account_id FROM membership_accounts WHERE user_id = ?", $user_id);
                dao_insert_transaction($account_id, $initial_balance, 'topup');
            }
        }

        return $user_id;

    } catch (PDOException $e) {
        // Xử lý lỗi trùng lặp (Logic nghiệp vụ)
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            $msg = (strpos($e->getMessage(), 'phone_number') !== false) 
                ? "Số điện thoại này đã được đăng ký." 
                : "Địa chỉ email này đã được sử dụng.";
            throw new Exception($msg);
        }
        throw new Exception("Lỗi Database: Không thể đăng ký người dùng.");
    }
}
