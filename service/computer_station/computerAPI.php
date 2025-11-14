<?php
// TÊN FILE: service/computers/ComputerAPI.php
// Mục đích: Xử lý tất cả requests API liên quan đến MÁY TÍNH (Thêm, Lấy danh sách, Cập nhật...)

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// DAO và BL
require_once 'computerDAO.php';
require_once 'computerBL.php';

// Xử lý OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? null;
    $input_data = json_decode(file_get_contents('php://input'), true);

    // --- ROUTE: /computers?action=add ---
    if ($method === 'POST' && $action === 'add') {
        $computer_name = $input_data['computer_name'] ?? '';
        $config_name = $input_data['config_name'] ?? '';

        if (!$computer_name || !$config_name) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu tên máy hoặc cấu hình.']);
            exit;
        }

        $result = handle_add_computer($computer_name, $config_name);
        http_response_code($result['status'] === 'success' ? 201 : 400);
        echo json_encode($result);

        // --- ROUTE: /computers?action=all ---
    } elseif ($method === 'GET' && $action === 'all') {
        $computers = get_all_computers();
        http_response_code(200);
        echo json_encode(['status' => 'success', 'data' => $computers]);
    } elseif ($method === 'GET' && $action === 'active') {
        $computers = get_active_computers();
        http_response_code(200);
        echo json_encode(['status' => 'success', 'data' => $computers]);
    } elseif ($method === 'POST' && $action === 'update_computer') {
        // --- ROUTE: /computers/update ---
        $computer_id = $input_data['computer_id'] ?? null;
        $name = $input_data['computer_name'] ?? '';
        $config_name = $input_data['config_name'] ?? '';
        $status = $input_data['current_status'] ?? '';
        $locked = $input_data['remote_locked'] ?? false;

        try {
            handle_update_computer($computer_id, $name, $config_name, $status, $locked);
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Máy tính đã được cập nhật.'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    } 
    elseif ($method === 'GET' && $action === 'get_by_id') {
        // --- ROUTE: /computers/get_by_id ---
        $computer_id = $_GET['computer_id'] ?? null;

        if ($computer_id === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu computer_id.']);
            exit();
        }

        try {
            $computer = get_computer_by_id($computer_id);
            if ($computer) {
                echo json_encode(['status' => 'success', 'data' => $computer]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy máy tính với ID đã cho.']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Lỗi khi lấy thông tin máy tính: ' . $e->getMessage()]);
        }

    }


    //Lấy máy tính trống theo tên cấu hình
    elseif ($method === 'GET' && $action === 'get_available_by_config') {
    // --- ROUTE: /computers/get_available_by_config ---
    $config_name = $_GET['config_name'] ?? null;

    if ($config_name === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Thiếu config_name.']);
        exit();
    }

    try {
        $computer = get_available_by_config($config_name);

        if ($computer) {
            echo json_encode(['status' => 'success', 'data' => $computer]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy máy trống phù hợp với cấu hình "' . $config_name . '".']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Lỗi xử lý: ' . $e->getMessage()]);
    }
}
    elseif ($method === 'POST' && $action === 'update_status') {
        // --- ROUTE: /computers/update_status ---
        $computer_id = $input_data['computer_id'] ?? null;
        $status = $input_data['current_status'] ?? '';

        try {
            dao_update_computer_status($computer_id, $status);
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Trạng thái máy tính đã được cập nhật.'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    } elseif ($method === 'GET' && $action === 'config_detail') {
        $config_name = $_GET['name'] ?? '';

        try {
            $config = handle_get_config_detail($config_name);
            echo json_encode(['status' => 'success', 'data' => $config]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } elseif ($method === 'POST' && $action === 'update_config') {
        $input = json_decode(file_get_contents("php://input"), true);
        $config_name = $input['config_name'] ?? '';
        $cpu = $input['cpu_spec'] ?? '';
        $gpu = $input['gpu_spec'] ?? '';
        $ram = $input['ram_spec'] ?? '';

        try {
            handle_update_config($config_name, $cpu, $gpu, $ram);
            echo json_encode(['status' => 'success', 'message' => 'Cấu hình đã được cập nhật.']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } elseif ($method === 'GET' && $action === 'config_names') {
        try {
            $configs = get_all_config_names();
            echo json_encode(['status' => 'success', 'data' => $configs]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } elseif ($method === 'GET' && $action === 'config_names') {
        try {
            $configs = get_all_config_names();
            echo json_encode(['status' => 'success', 'data' => $configs]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } elseif ($method === 'POST' && $action === 'add_config_name') {
        $input = json_decode(file_get_contents("php://input"), true);
        $config_name = $input['config_name'] ?? '';

        if (!$config_name) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Thiếu tên cấu hình.']);
            exit;
        }

        try {
            dao_add_new_config($config_name);
            echo json_encode(['status' => 'success', 'message' => 'Cấu hình mới đã được thêm.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Lỗi khi thêm cấu hình: ' . $e->getMessage()]);
        }
    } elseif ($method === 'POST' && $action === 'total_computers') {
        try {
            $total = get_total_computers();
            echo json_encode(['status' => 'success', 'data' => ['total_computers' => $total]]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Lỗi khi lấy tổng số máy tính: ' . $e->getMessage()]);
        }
    } elseif ($method === 'POST' && $action === 'total_in_use') {
        try {
            $total = get_total_active_computers();
            echo json_encode(['status' => 'success', 'data' => ['total_computers' => $total]]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Lỗi khi lấy tổng số máy tính: ' . $e->getMessage()]);
        }
    } elseif ($method === 'POST' && $action === 'total_maintenance') {
        try {
            $total = get_total_maintenance_computers();
            echo json_encode(['status' => 'success', 'data' => ['total_computers' => $total]]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Lỗi khi lấy tổng số máy tính: ' . $e->getMessage()]);
        }
    } elseif ($method === 'POST' && $action === 'total_locked') {
        try {
            $total = get_total_remote_locked_computers();
            echo json_encode(['status' => 'success', 'data' => ['total_computers' => $total]]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Lỗi khi lấy tổng số máy tính: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy action hợp lệ.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("API Error in ComputerAPI: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Lỗi hệ thống nội bộ.']);
}
