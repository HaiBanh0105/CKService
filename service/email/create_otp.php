<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

require __DIR__ . '/db.php';
require __DIR__ . '/../common/PHPmailer.php';

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);
if (!is_array($data)) {
    echo json_encode(['status' => 'error', 'message' => 'Payload JSON không hợp lệ']);
    exit;
}

$userId = (int)($data['userId'] ?? 0);
$studentId = trim($data['studentId'] ?? '');
$amount = (float)($data['amount'] ?? 0);
$userEmail = trim($data['userEmail'] ?? '');

if ($userId <= 0 || $studentId === '' || $amount <= 0 || $userEmail === '') {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu dữ liệu đầu vào']);
    exit;
}

try {

   
    $ch = curl_init($updateUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $updatePayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $updateResponse = curl_exec($ch);
    curl_close($ch);

    $updateResult = json_decode($updateResponse, true);
    if (!is_array($updateResult) || $updateResult['status'] !== 'success') {
        echo json_encode(['status' => 'error', 'message' => 'Không cập nhật được trạng thái học phí']);
        exit;
    }


    // Gửi email OTP
    $subject = 'Mã OTP xác nhận thanh toán học phí';
    $body = '<p>Xác nhận thanh toán cho sinh viên: <strong>' . htmlspecialchars($studentId) . '</strong></p>' .
        '<p>Mã OTP của bạn là: <strong>' . htmlspecialchars($otp) . '</strong></p>' .
        '<p>OTP có hiệu lực trong 5 phút.</p>';
    sendEmail($userEmail, $subject, $body);

    echo json_encode(['status' => 'success', 'paymentId' => $paymentId]);
} catch (Throwable $e) {
    if ($paymentPdo->inTransaction()) {
        $paymentPdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Lỗi server']);
}
