<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Đường dẫn DAO: Nằm cùng thư mục
require_once 'bookingDAO.php';
require_once 'bookingBL.php';
// require_once 'sessionrBL.php';

// Xử lý OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $method = $_SERVER['REQUEST_METHOD'];

    // Đọc input chỉ một lần
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? null;


    if ($method === 'GET' && $action === 'user_id_by_computer') {
        $computer_id = $_GET['computer_id'] ?? null;
        if ($computer_id === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu computer_id.']);
            exit();
        }

        $user_id = get_user_id_by_computer_id_in_booking($computer_id);
        if ($user_id !== null) {
            echo json_encode(['status' => 'success', 'user_id' => $user_id]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy user cho computer_id đã cho.']);
        }
    } elseif ($method === 'POST' && $action === 'create_booking') {
        // --- ROUTE: /booking/create_full ---
        $user_id = $data['user_id'] ?? null;
        $computer_id = $data['computer_id'] ?? null;
        $config_id = $data['config_id'] ?? null;
        $start_time = $data['start_time'] ?? null;
        $total_duration_hours = $data['total_duration_hours'] ?? null;
        $deposit = $data['deposit'] ?? 0;
        $notes = $data['notes'] ?? null;

        if (!$user_id || !$computer_id || !$config_id || !$start_time || !$total_duration_hours) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Thiếu thông tin bắt buộc'
            ]);
            exit();
        }


        try {
            // Gọi hàm BL xử lý logic
            $reservation_id = create_full_booking(
                $user_id,
                $computer_id,
                $config_id,
                $start_time,
                $total_duration_hours,
                $deposit,
                $notes
            );

            echo json_encode([
                'status' => 'success',
                'message' => 'Đặt chỗ thành công!',
                'data' => [
                    'reservation_id' => $reservation_id,
                    'user_id' => $user_id,
                    'computer_id' => $computer_id,
                    'config_id' => $config_id,
                    'start_time' => $start_time,
                    'duration' => $total_duration_hours,
                    'deposit' => $deposit,
                    'notes' => $notes
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Lỗi xử lý: ' . $e->getMessage()
            ]);
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
