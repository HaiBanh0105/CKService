<?php
require __DIR__ . '../../email/common/PHPmailer.php';
require_once 'otpDAO.php';



// Sinh, lưu và gửi OTP
function bl_send_otp($user_id, $user_email, $purpose)
{
    // Xóa OTP cũ chưa dùng
    otp_delete_unused_by_user($user_id, $user_email);
    // Sinh OTP
    $otp_code = otp_generate();
    $expires_at = date("Y-m-d H:i:s", strtotime("+5 minutes"));

    // Lưu vào DB
    otp_insert($user_id, $user_email ,$otp_code, $purpose, $expires_at);

    // Gửi email
    $subject = "Mã OTP xác thực";
    $body = "<p>Xin chào,</p>
             <p>Mã OTP của bạn là: <strong>$otp_code</strong></p>
             <p>OTP có hiệu lực đến: $expires_at</p>";
    return sendEmail($user_email, $subject, $body);
}

// Xác nhận OTP
function bl_verify_otp($user_id, $otp_input, $purpose)
{
    if (otp_verify($user_id, $otp_input, $purpose)) {
        return ["status" => "success", "message" => "OTP hợp lệ"];
    }
    return ["status" => "error", "message" => "OTP không hợp lệ hoặc đã hết hạn"];
}

// Gửi thông báo thành công sau khi xác nhận OTP
function bl_send_success($user_email, $purpose, $data = [])
{
    switch ($purpose) {
        case 'booking':
            $subject = "Xác nhận đặt máy thành công";
            $body = "<p>Bạn đã đặt máy <strong>{$data['computer_name']}</strong> lúc {$data['start_time']} thành công.</p>";
            break;
        case 'recharge':
            $subject = "Nạp tiền thành công";
            $body = "<p>Bạn vừa nạp <strong>{$data['amount']} VNĐ</strong>. Số dư hiện tại: {$data['balance']} VNĐ.</p>";
            break;
        case 'reset_password':
            $subject = "Đổi mật khẩu thành công";
            $body = "<p>Mật khẩu của bạn đã được đổi thành công.</p>";
            break;
        default:
            $subject = "Thông báo hệ thống";
            $body = "<p>Thao tác của bạn đã được thực hiện thành công.</p>";
    }
    return sendEmail($user_email, $subject, $body);
}
