<?php
require_once 'computerDAO.php';

/**
 * Xử lý nghiệp vụ thêm máy tính mới
 * @param string $computer_name
 * @param string $config_name
 * @return array status + message
 */
function handle_add_computer($computer_name, $config_name)
{
    // Kiểm tra tên máy đã tồn tại
    if (is_computer_name_exists($computer_name)) {
        return [
            "status" => "error",
            "message" => "Tên máy '" . $computer_name . "' đã tồn tại trong hệ thống."
        ];
    }

    // Lấy config_id từ tên cấu hình
    $config_id = get_config_id_by_name($config_name);
    if (!$config_id) {
        return [
            "status" => "error",
            "message" => "Cấu hình '" . $config_name . "' không hợp lệ."
        ];
    }

    // Thêm máy tính
    try {
        add_computer($computer_name, $config_id);
        return [
            "status" => "success",
            "message" => "Máy tính đã được thêm thành công."
        ];
    } catch (Exception $e) {
        return [
            "status" => "error",
            "message" => "Lỗi khi thêm máy: " . $e->getMessage()
        ];
    }
}