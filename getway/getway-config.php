<?php
return [
    'routes' => [
        // Endpoint Đăng nhập mới (trỏ về service: 'users')
        '/users/login'       => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'login'],

        // Endpoint Lấy thông tin (trỏ về service: 'users')
        '/users/info'        => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'info'],

        // Endpoint lấy người dùng theo ID
        '/users/get_by_id'   => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'get_by_id'],

        // Endpoint lấy khách hàng theo ID
        '/users/get_customer_by_id'   => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'get_customer_by_id'],

        // Endpoint cập nhật người dùng theo ID
        '/users/update_by_id'   => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'update_by_id'],

        //Lấy người dùng theo tên
        '/users/get_by_name'   => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'get_by_name'],

        // Endpoint Lấy tất cả khách hàng
        '/users/load_customers'         => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'load_customers'],

        // Endpoint Lấy tất cả nhân viên
        '/users/load_staff'         => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'load_staff'],

        // Endpoint thêm khách hàng mới
        '/users/add_customer' => [
            'service' => 'users',
            'path' => 'userAPI.php',
            'dir' => 'users',
            'action' => 'add_customer'
        ],

        // Endpoint thêm nhân viên mới
        '/users/add_staff' => [
            'service' => 'users',
            'path' => 'userAPI.php',
            'dir' => 'users',
            'action' => 'add_staff'
        ],

        // Endpoint cập nhật người dùng
        '/users/update_user' => [
            'service' => 'users',
            'path' => 'userAPI.php',
            'dir' => 'users',
            'action' => 'update_user'
        ],

        // endpoint lấy lịch sử giao dịch của khách hàng
        '/users/transactions' => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'transactions'],


        //--COMPUTER STATION SERVICE ENDPOINTS--//


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

        // Endpoint lấy tất cả máy tính đang sử dụng
        '/computers/active' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'active'
        ],

        // Endpoint lấy thông tin máy tính theo ID
        '/computers/get_by_id' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'get_by_id'
        ],

        //Endpoint cập nhật máy tính
        '/computers/update_computer' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'update_computer'
        ],

        // Endpoint cập nhật trạng thái máy tính
        '/computers/update_status' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'update_status'
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

        // Endpoint lấy user_id từ computer_id trong session đang active
        '/session/user_id_by_computer' => [
            'service' => 'session',
            'path' => 'sessionAPI.php',
            'dir' => 'session',
            'action' => 'user_id_by_computer'
        ],

        // Endpoint thêm phiên mới
        '/session/add_session' => [
            'service' => 'session',
            'path' => 'sessionAPI.php',
            'dir' => 'session',
            'action' => 'add_session'
        ],

        // Endpoint lấy user_id mới nhất từ computer_id trong booking  
        '/booking/user_id_by_computer' => [
            'service' => 'booking',
            'path' => 'bookingAPI.php',
            'dir' => 'booking',
            'action' => 'user_id_by_computer'
        ],

    ],


    'ports' => [
        // Chỉ cần định nghĩa port cho service 'users'
        'users'    => '8001',

        'computers' => '8002',

        'session' => '8003',

        'booking' => '8004',

    ]
];
