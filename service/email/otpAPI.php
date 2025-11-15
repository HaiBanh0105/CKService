<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Đường dẫn DAO và BL
require_once 'otpDAO.php';
require_once 'otpBL.php';

// Xử lý OPTIONS (preflight request cho CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    // Đọc input JSON một lần
    $input_data = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? null;

    // -------------------------------
    // CREATE OTP
    // -------------------------------
    if ($method === 'POST' && $action === 'create') {
        $user_id    = $input_data['user_id'] ?? null;
        $user_email = $input_data['user_email'] ?? null;
        $purpose    = $input_data['purpose'] ?? null;

        if (!$user_id || !$user_email || !$purpose) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu tham số']);
            exit();
        }

        $result = bl_send_otp($user_id, $user_email, $purpose);

        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'OTP đã được gửi']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Không thể gửi OTP']);
        }
    }

    // -------------------------------
    // CONFIRM OTP
    // -------------------------------
    else if ($method === 'POST' && $action === 'confirm') {
        $user_id   = $input_data['user_id'] ?? null;
        $otp_code  = $input_data['otp_code'] ?? null;
        $purpose   = $input_data['purpose'] ?? null;

        if (!$user_id || !$otp_code || !$purpose) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu tham số']);
            exit();
        }

        $result = bl_verify_otp($user_id, $otp_code, $purpose);
        echo json_encode($result);
    }

    // -------------------------------
    // ACTION KHÔNG HỢP LỆ
    // -------------------------------
    else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy action hợp lệ.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("API Error in OTP: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Lỗi hệ thống nội bộ.']);
}
