<?php
// TÊN FILE: service/users/UserAPI.php
// Mục đích: Xử lý tất cả requests API liên quan đến USERS (Login, CRUD, GetInfo)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Đường dẫn DAO: Nằm cùng thư mục
require_once 'paymentDAO.php';
// require_once 'paymentBL.php';

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
    if ($method === 'POST' && $action === 'add_to_customer') {
        // Lấy dữ liệu từ body
        $staff_id             = $input_data['staff_id'] ?? null;
        $user_id              = $input_data['user_id'] ?? null;
        $session_id           = $input_data['session_id'] ?? null;
        $computer_id          = $input_data['computer_id'] ?? null;
        $start_time           = $input_data['start_time'] ?? null;
        $end_time             = $input_data['end_time'] ?? null;
        $total_duration_minutes = $input_data['total_duration_minutes'] ?? null;
        $deposit_amount       = $input_data['deposit_amount'] ?? 0;
        $total_amount         = $input_data['total_amount'] ?? null;
        $payment_method       = $input_data['payment_method'] ?? null;
        $payment_status       = $input_data['payment_status'] ?? 'pending';
        $notes                = $input_data['notes'] ?? null;

        $result = add_customer_payment(
            $staff_id,
            $user_id,
            $session_id,
            $computer_id,
            $start_time,
            $end_time,
            $total_duration_minutes,
            $deposit_amount,
            $total_amount,
            $payment_method,
            $payment_status,
            0,    // is_guest
            null, // guest_name
            $notes
        );

        echo json_encode(['status' => 'success', 'data' => $result]); 
    }
    elseif ($method === 'POST' && $action === 'add_to_guest') {
        $staff_id             = $input_data['staff_id'] ?? null;
        $session_id           = $input_data['session_id'] ?? null;
        $computer_id          = $input_data['computer_id'] ?? null;
        $guest_name           = $input_data['guest_name'] ?? null;
        $start_time           = $input_data['start_time'] ?? null;
        $end_time             = $input_data['end_time'] ?? null;
        $total_duration_minutes = $input_data['total_duration_minutes'] ?? null;
        $total_amount         = $input_data['total_amount'] ?? null;
        $payment_method       = $input_data['payment_method'] ?? null;
        $payment_status       = $input_data['payment_status'] ?? 'pending';
        $notes                = $input_data['notes'] ?? null;

        $result = add_guest_payment(
            $staff_id,
            $session_id,
            $computer_id,
            $guest_name,
            $start_time,
            $end_time,
            $total_duration_minutes,
            $total_amount,
            $payment_method,
            $payment_status,
            $notes
        );

        echo json_encode(['status' => 'success', 'data' => $result]);
    }
    else if ($method === 'GET' && $action === 'revenue') {
    try {
        $report = getRevenueReport();

        echo json_encode([
            'status' => 'success',
            'data' => [
                'today_revenue' => intval($report['today_revenue']),
                'week_revenue'  => intval($report['week_revenue']),
                'month_revenue' => intval($report['month_revenue']),
                'total_revenue' => intval($report['total_revenue'])
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Không thể lấy báo cáo doanh thu',
            'error' => $e->getMessage()
        ]);
    }
    }
    else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy action hợp lệ.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
