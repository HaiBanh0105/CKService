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


    if ($method === 'GET' && $action === 'user_id_by_computer') {
        $computer_id = $_GET['computer_id'] ?? null;
        if ($computer_id === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu computer_id.']);
            exit();
        }

        $user_id = get_user_id_by_computer_id($computer_id);
        if ($user_id !== null) {
            echo json_encode(['status' => 'success', 'user_id' => $user_id]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy phiên hoạt động cho computer_id đã cho.']);
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
