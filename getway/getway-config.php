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
        ],

        // endpoint lấy lịch sử giao dịch của khách hàng
        '/users/transactions' => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'transactions'],

        // Endpoint thêm máy tính mới
        '/computers/add' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'add'
        ]

        //Endpoint lấy tất cả máy tính
        ,
        '/computers/all' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'all'
        ],

        //Endpoint cập nhật máy tính
        '/computers/update_computer' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'update_computer'
        ],

        //Endpoint cập nhật config
        '/computers/update_config' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'update_config'
        ],

        //Endpoint lấy chi tiết config theo tên
        '/computers/config_detail' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'config_detail'
        ],

        //Endpoint lấy danh sách tên cấu hình
        '/computers/config_names' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'config_names'
        ],
        //Endpoint thêm tên cấu hình mới
        '/computers/add_config_name' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'add_config_name'
        ],

        // Endpoint lấy tổng số máy tính
        '/computers/total_computers' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'total_computers'
        ],

        // Endpoint lấy tổng số máy tính đang sử dụng
        '/computers/total_in_use' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'total_in_use'
        ],

        // End lấy tổng máy tính đang bảo trì
        '/computers/total_maintenance' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'total_maintenance'
        ],
        // Endpoint lấy tổng số máy tính đang bị khóa từ xa
        '/computers/total_locked' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'total_locked'
        ],

    ],
    'ports' => [
        // Chỉ cần định nghĩa port cho service 'users'
        'users'    => '8001',

        'computers' => '8002',
        // Loại bỏ 'auth' và 'user' cũ
        // 'auth' => '8001',
        // 'user' => '8001',
    ]
];
