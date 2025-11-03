<?php
$config = require __DIR__ . '/getway-config.php';
require_once __DIR__ . '/utils/forward.php';

// Cấu hình Headers (CORS)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Thêm Authorization

// Xử lý Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 1. Phân tích URI để lấy route sau /getway/
$uri = strtok($_SERVER['REQUEST_URI'], '?');
// *** SỬA ĐỔI 1: Thay GKService bằng NetMaster trong đường dẫn base ***
$base = '/NetMaster/getway/'; 
$route = substr($uri, strpos($uri, $base) + strlen($base));
$route = '/' . trim($route, '/'); // Định dạng lại thành /users/login


$method = $_SERVER['REQUEST_METHOD'];
$body = file_get_contents('php://input');

// 2. Kiểm tra route có tồn tại trong config
if (!isset($config['routes'][$route])) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => "Route '{$route}' không tồn tại"]);
    exit;
}

$serviceInfo = $config['routes'][$route];
$serviceName = $serviceInfo['service'];
$dir = $serviceInfo['dir'] ?? $serviceName;


$port = $config['ports'][$serviceName];
$targetUrl = "http://localhost:$port/NetMaster/service/$dir/{$serviceInfo['path']}"; 


// 3. Xử lý logic Action (Gắn tham số action vào query string)
$query = $_SERVER['QUERY_STRING'];

if (isset($serviceInfo['action'])) {
    $internal_action_query = "action=" . $serviceInfo['action'];
    $query = $query ? $query . '&' . $internal_action_query : $internal_action_query;
}

// 4. Gửi request đến service đích
$fullUrl = $targetUrl . ($query ? "?$query" : '');

$data = $method === 'POST' || $method === 'PUT' ? json_decode($body, true) : [];

$response = forward($fullUrl, $method, $data);

// 5. Echo phản hồi và ghi log
echo $response;
error_log("Gateway gọi: $fullUrl với method $method");
error_log("Payload: " . json_encode($data));
error_log("Phản hồi: " . $response);