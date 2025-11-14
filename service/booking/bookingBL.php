<?php
require_once 'bookingDAO.php';

function create_full_booking($user_id, $computer_id,  $config_id, $start_time, $total_duration_hours, $deposit, $notes)
{
    $booking_time = date('Y-m-d H:i:s');
    $status = 'pending';

    insert_reservation($user_id, $booking_time, $start_time, $total_duration_hours, $status, $deposit, $notes);

    //Lấy reservation_id vừa tạo
    $reservation_id = booking_db_query_value("SELECT LAST_INSERT_ID()");

    //Tạo bản ghi chi tiết
    insert_reservation_detail($reservation_id, $computer_id, $config_id);

    return $reservation_id;
}
