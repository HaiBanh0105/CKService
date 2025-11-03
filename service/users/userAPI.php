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
    } elseif ($method === 'GET' && $action === 'all') {
        // --- ROUTE: /users?action=all (LẤY TẤT CẢ KHÁCH HÀNG) ---

        // Gọi hàm DAO đã join users và membership_accounts
        $customers = dao_select_all_membership_accounts();

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'data' => $customers
        ]);
    } elseif ($method === 'POST' && $action === 'register') {
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
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy action hợp lệ.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("API Error in UMS: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Lỗi hệ thống nội bộ.']);
}
