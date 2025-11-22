<?php
require_once 'bookingDAO.php';

function create_full_booking($user_id, $computer_id,  $config_id, $start_time, $total_duration_hours, $deposit, $notes)
{
    // Kiểm tra máy đã được đặt chưa
    if (isComputerReserved($computer_id)) {
        // Nếu đã có booking pending/confirmed thì trả về lỗi
        throw new Exception("Máy tính này đã được đặt trước hoặc đang chờ xác nhận.");
    }
    
    $booking_time = date('Y-m-d H:i:s');
    $status = 'pending';

    insert_reservation($user_id, $booking_time, $start_time, $total_duration_hours, $status, $deposit, $notes);

    //Lấy reservation_id vừa tạo
    $reservation_id = booking_db_query_value("SELECT LAST_INSERT_ID()");

    //Tạo bản ghi chi tiết
    insert_reservation_detail($reservation_id, $computer_id, $config_id);

    return $reservation_id;
}

// BL: cập nhật trạng thái đặt chỗ
function bl_update_reservation_status($reservation_id, $status)
{
    // Kiểm tra trạng thái hợp lệ
    $validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!in_array($status, $validStatuses)) {
        return [
            "status" => "error",
            "message" => "Trạng thái không hợp lệ."
        ];
    }

    $result = dao_update_reservation_status($reservation_id, $status);

    if ($result) {
        return [
            "status" => "success",
            "message" => "Cập nhật trạng thái đặt chỗ thành công."
        ];
    } else {
        return [
            "status" => "error",
            "message" => "Không thể cập nhật trạng thái đặt chỗ."
        ];
    }
}
