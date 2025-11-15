<?php
// TÊN FILE: service/users/UserAPI.php
// Mục đích: Xử lý tất cả requests API liên quan đến USERS (Login, CRUD, GetInfo)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Đường dẫn DAO: Nằm cùng thư mục
require_once 'userDAO.php';
require_once 'UserBL.php';

// Xử lý OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    // Đọc input chỉ một lần
    $input_data = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? null;


    // Xử lý các action login
    if ($method === 'POST' && $action === 'login') {
        // --- ROUTE: /users?action=login (ĐĂNG NHẬP) ---
        $email = $input_data['email'] ?? '';
        $password = $input_data['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu email hoặc mật khẩu.']);
            exit;
        }

        // Kiểm tra đăng nhập
        $user = check_login($email, $password);

        if ($user) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Đăng nhập thành công!',
                'data' => $user
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Email hoặc mật khẩu không đúng.']);
        }
    } elseif ($method === 'GET' && $action === 'load_customers') {
        // --- ROUTE: /users?action=all (LẤY TẤT CẢ KHÁCH HÀNG) ---

        // Gọi hàm DAO đã join users và membership_accounts
        $customers = dao_select_all_membership_accounts();

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'data' => $customers
        ]);
    } elseif ($method === 'GET' && $action === 'load_staff') {
        $staff = dao_select_all_staff();

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'data' => $staff
        ]);
    } elseif ($method === 'GET' && $action === 'get_by_id') {
        $user_id = $_GET['user_id'] ?? ''; // Lấy từ query string, không phải body

        if (empty($user_id)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Thiếu user_id trong yêu cầu.'
            ]);
            exit;
        }

        $user = select_user_by_id($user_id);

        if (!$user) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng với ID đã cho.'
            ]);
            exit;
        }

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'data' => $user
        ]);
    } 
    elseif ($method === 'GET' && $action === 'get_customer_by_id') {
        $user_id = $_GET['user_id'] ?? ''; // Lấy từ query string, không phải body

        if (empty($user_id)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Thiếu user_id trong yêu cầu.'
            ]);
            exit;
        }

        $user = select_customer_by_id($user_id);

        if (!$user) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng với ID đã cho.'
            ]);
            exit;
        }

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'data' => $user
        ]);
    } 

    else if ($method === 'GET' && $action === 'get_by_name') {
        $full_name = $_GET['full_name'] ?? null;

        if ($full_name === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu tên người dùng.']);
            exit();
        }

        $result = get_user_by_full_name($full_name); // Hàm truy vấn DB
        if ($result) {
            echo json_encode(['status' => 'success', 'data' => $result]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy người dùng.']);
        }
    }

    elseif ($method === 'POST' && $action === 'update_by_id') {
        $user_id = $input_data['user_id'] ?? '';
        $full_name = $input_data['full_name'] ?? '';
        $phone_number = $input_data['phone_number'] ?? '';
        $email = $input_data['email'] ?? '';

        if (empty($user_id) || empty($full_name) || empty($phone_number) || empty($email)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Thiếu thông tin bắt buộc.'
            ]);
            exit;
        }

        try {
            update_user_info($user_id, $full_name, $phone_number, $email);

            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Cập nhật thông tin người dùng thành công.'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }

    }
    elseif ($method === 'POST' && $action === 'add_customer') {
        // --- ROUTE: /users?action=register (THÊM KHÁCH HÀNG MỚI) ---
        $full_name = $input_data['full_name'] ?? '';
        $phone_number = $input_data['phone_number'] ?? '';
        $email = $input_data['email'] ?? '';
        $password = $input_data['password'] ?? '';
        $initial_balance = $input_data['initial_balance'] ?? 0.00;

        // Kiểm tra dữ liệu đầu vào
        if (empty($full_name) || empty($phone_number) || empty($password)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu thông tin bắt buộc.']);
            exit;
        }

        try {
            $user_id = register_new_user($full_name, $phone_number, $email, $password, 'customer', $initial_balance);

            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'Khách hàng đã được tạo thành công.',
                'user_id' => $user_id
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } elseif ($method === 'POST' && $action === 'add_staff') {
        // --- ROUTE: /users?action=register (THÊM KHÁCH HÀNG MỚI) ---
        $full_name = $input_data['full_name'] ?? '';
        $phone_number = $input_data['phone_number'] ?? '';
        $email = $input_data['email'] ?? '';
        $password = $input_data['password'] ?? '';


        // Kiểm tra dữ liệu đầu vào
        if (empty($full_name) || empty($phone_number) || empty($password)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu thông tin bắt buộc.']);
            exit;
        }

        try {
            $user_id = register_new_user($full_name, $phone_number, $email, $password, 'staff', 0);

            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'Nhân viên đã được tạo thành công.',
                'user_id' => $user_id
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } elseif ($method === 'GET' && $action === 'transactions') {
        $user_id = $_GET['user_id'] ?? null;

        if (!$user_id || !is_numeric($user_id)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Thiếu hoặc sai user_id.'
            ]);
            exit;
        }

        try {
            // Lấy account_id từ user_id
            error_log("Gọi lịch sử giao dịch cho user_id = " . $user_id);
            $sql = "SELECT account_id FROM membership_accounts WHERE user_id = ?";
            $account = user_db_query_one($sql, $user_id);

            if (!$account) {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Không tìm thấy tài khoản thành viên cho user_id này.'
                ]);
                exit;
            }

            $account_id = $account['account_id'];

            // Gọi DAO để lấy lịch sử giao dịch
            $transactions = dao_get_transaction_history($account_id);

            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $transactions
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Lỗi khi lấy lịch sử giao dịch: ' . $e->getMessage()
            ]);
        }
    } 
    else if($method === 'POST' && $action === 'change_balance') {
        $user_id = $input_data['user_id'] ?? null;
        $amount = $input_data['amount'] ?? null;

        if (!$user_id || $amount === null) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Thiếu thông tin bắt buộc"]);
            exit();
        }

        $result = change_balance($user_id, $amount);
        echo json_encode($result);
        exit();
    }
    else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy action hợp lệ.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("API Error in UMS: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Lỗi hệ thống nội bộ.']);
}
