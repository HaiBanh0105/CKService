<?php
require_once 'bookingDAO.php';

function create_full_booking($user_id, $computer_id, $start_time, $total_duration_hours, $deposit = 0, $notes = null)
{
    // 1. Chuẩn bị dữ liệu
    $booking_time = date('Y-m-d H:i:s');
    $status = 'pending';

    // 2. Tạo bản ghi đặt chỗ
    insert_reservation($user_id, $booking_time, $start_time, $total_duration_hours, $status, $deposit, $notes);

    // 3. Lấy reservation_id vừa tạo
    $reservation_id = booking_db_query_value("SELECT LAST_INSERT_ID()");

    // 4. Lấy config_id từ máy
    $config_id = booking_db_query_value("SELECT config_id FROM computers WHERE computer_id = ?", $computer_id);
    if (!$config_id) {
        throw new Exception("Không tìm thấy cấu hình máy.");
    }

    // 5. Tạo bản ghi chi tiết
    insert_reservation_detail($reservation_id, $computer_id, $config_id);

    return $reservation_id;
}
