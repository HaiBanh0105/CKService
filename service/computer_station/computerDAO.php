<?php
// Điều chỉnh đường dẫn tương đối đến file pdo.php
require_once('../../core/pdo.php');

// Định nghĩa tên DB chính xác DỰA TRÊN CẤU TRÚC THỰC TẾ CỦA BẠN
const COMPUTER_DB_NAME = 'computer_management';

// ------------------------------------
// Phần 1: WRAPPER PDO (DAO Adapter)
// ------------------------------------

/**
 * Wrapper cho pdo_execute, tự động truyền tên DB 
 */
function computer_db_execute($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_execute(COMPUTER_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho pdo_query (truy vấn nhiều bản ghi), tự động truyền tên DB 
 */
function computer_db_query($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query(COMPUTER_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một bản ghi, tự động truyền tên DB 
 */
function computer_db_query_one($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_one(COMPUTER_DB_NAME, $sql, $args);
}

/**
 * Wrapper cho truy vấn một giá trị, tự động truyền tên DB 
 */
function computer_db_query_value($sql)
{
    $args = array_slice(func_get_args(), 1);
    return pdo_query_value(COMPUTER_DB_NAME, $sql, $args);
}


// ------------------------------------
// Phần 2: HÀM NGHIỆP VỤ (BUSINESS LOGIC)
// ------------------------------------
// Hàm lấy danh sách tất cả các máy tính
function get_all_computers()
{
    $sql = "SELECT * FROM computers";
    return computer_db_query($sql);
}

//Hàm lấy thông tin máy tính đang sử dụng
function get_active_computers()
{
    $sql = "SELECT * FROM computers WHERE current_status = 'in_use' AND is_remote_locked = 0";
    return computer_db_query($sql);
}

//Hàm lấy kiểm tra tên máy tính đã tồn tại
function is_computer_name_exists($computer_name)
{
    $sql = "SELECT COUNT(*) FROM computers WHERE computer_name = ?";
    $count = computer_db_query_value($sql, $computer_name);
    return $count > 0;
}

//Hàm thêm máy tính mới
function add_computer($computer_name, $config_id)
{
    $sql = "INSERT INTO computers (computer_name, config_id, current_status) VALUES (?, ?, 'available')";
    return computer_db_execute($sql, $computer_name, $config_id);
}

//Hàm lấy config_id theo config_name
function get_config_id_by_name($config_name)
{
    $sql = "SELECT config_id FROM computer_configs WHERE config_name = ?";
    $config_id = computer_db_query_value($sql, $config_name);

    if (!$config_id) {
        throw new Exception("Không tìm thấy cấu hình: " . $config_name);
    }

    return $config_id;
}



//Hàm cập nhật máy tính
function dao_update_computer($computer_id, $name, $config_id, $status, $locked)
{
    $sql = "UPDATE computers 
            SET computer_name = ?, config_id = ?, current_status = ?, is_remote_locked = ?
            WHERE computer_id = ?";
    return computer_db_execute($sql, $name, $config_id, $status, $locked ? 1 : 0, $computer_id);
}

//Cập nhật trạng thái máy tính
function dao_update_computer_status($computer_id, $status)
{
    $sql = "UPDATE computers 
            SET current_status = ?
            WHERE computer_id = ?";
    return computer_db_execute($sql, $status, $computer_id);
}

//lấy thông tin cấu hình theo tên
function dao_get_config_by_name($config_name)
{
    $sql = "SELECT config_id, config_name, cpu_spec, gpu_spec, ram_spec 
            FROM computer_configs 
            WHERE config_name = ?";
    return computer_db_query_one($sql, $config_name);
}

//Cập nhật cấu hình theo tên
function dao_update_config_by_name($config_name, $cpu, $gpu, $ram)
{
    $sql = "UPDATE computer_configs 
            SET cpu_spec = ?, gpu_spec = ?, ram_spec = ?
            WHERE config_name = ?";
    return computer_db_execute($sql, $cpu, $gpu, $ram, $config_name);
}

//lấy danh sách config name 
function get_all_config_names()
{
    $sql = "SELECT config_name FROM computer_configs ORDER BY config_id ASC";
    return computer_db_query($sql);
}

//Thêm tên cấu hình mới
function dao_add_new_config($config_name)
{
    $sql = "INSERT INTO computer_configs (config_name)
            VALUES (?)";
    return computer_db_execute($sql, $config_name);
}

// Kiểm tra tên cấu hình đã tồn tại
function is_config_name_exists($config_name)
{
    $sql = "SELECT COUNT(*) FROM computer_configs WHERE config_name = ?";
    $count = computer_db_query_value($sql, $config_name);
    return $count > 0;
}

// Tính tổng số máy tính
function get_total_computers()
{
    $sql = "SELECT COUNT(*) FROM computers";
    return computer_db_query_value($sql);
}

// Tính tổng máy đang sử dụng
function get_total_active_computers()
{
    $sql = "SELECT COUNT(*) FROM computers WHERE current_status = 'in_use' and is_remote_locked = 0";
    return computer_db_query_value($sql);
}

//Tính tổng máy đang bảo trì
function get_total_maintenance_computers()
{
    $sql = "SELECT COUNT(*) FROM computers WHERE current_status = 'maintenance'";
    return computer_db_query_value($sql);
}

//Tính tổng mấy bị khóa từ xa
function get_total_remote_locked_computers()
{
    $sql = "SELECT COUNT(*) FROM computers WHERE is_remote_locked = 1";
    return computer_db_query_value($sql);
}
