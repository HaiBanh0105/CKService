<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Đường dẫn DAO: Nằm cùng thư mục
require_once 'sessionDAO.php';
// require_once 'sessionrBL.php';

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


    if ($method === 'GET' && $action === 'latest_by_computer_id') {
        $computer_id = $_GET['computer_id'] ?? null;
        if ($computer_id === null) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Thiếu computer_id.'
            ]);
            exit();
        }

        $session = get_latest_session_by_computer_id($computer_id);
        if ($session !== null) {
            echo json_encode([
                'status' => 'success',
                'session' => $session
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Không tìm thấy phiên hoạt động cho computer_id đã cho.'
            ]);
        }
    } else if ($method === 'POST' && $action === 'add_session') {
        $user_id = $input_data['user_id'] ?? null;
        $computer_id = $input_data['computer_id'] ?? null;
        $full_name = $input_data['full_name'] ?? null;
        $start_time = $input_data['start_time'] ?? null;
        $status = $input_data['status'] ?? null;
        $reservation_id = $input_data['reservation_id'] ?? null;

        if ($computer_id === null || $start_time === null || $status === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu thông tin cần thiết để thêm phiên.']);
            exit();
        }

        $result = add_session($user_id, $computer_id, $full_name, $start_time, $status, $reservation_id);
        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'Phiên mới đã được thêm thành công.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Không thể thêm phiên mới.']);
        }
    } 
    else if ($method === 'POST' && $action === 'update_status') {
        $session_id = $input_data['session_id'] ?? null;
        $status     = $input_data['status'] ?? null;
        $end_time    = $input_data['end_time'] ?? null;
        $$total_minutes_played    = $input_data['$total_minutes_played'] ?? 0;
        $total_cost     = $input_data['total_cost'] ?? 0;

        if (!$session_id || !$status) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu tham số session_id hoặc status']);
            exit();
        }

        $result = update_status($session_id, $status, $end_time, $total_minutes_played, $total_cost);

        if ($result > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Cập nhật trạng thái thành công']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy session hoặc không có thay đổi']);
        }
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
