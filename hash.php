<?php
$plain_password = 'hai123456'; // Mật khẩu bạn muốn đặt
$hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);
echo $hashed_password . "\n";
?>