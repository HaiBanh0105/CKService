<?php
return [
    'routes' => [
        // Endpoint Đăng nhập mới (trỏ về service: 'users')
        '/users/login'       => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'login'],

        // Endpoint Lấy thông tin (trỏ về service: 'users')
        '/users/info'        => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'info'],

        // Endpoint Lấy tất cả user
        '/users/all'         => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'all'],

        // Endpoint thêm khách hàng mới
        '/users/register' => [
            'service' => 'users',
            'path' => 'userAPI.php',
            'dir' => 'users',
            'action' => 'register'
        ]
    ],
    'ports' => [
        // Chỉ cần định nghĩa port cho service 'users'
        'users'    => '8001',
        // Loại bỏ 'auth' và 'user' cũ
        // 'auth' => '8001',
        // 'user' => '8001',
    ]
];
