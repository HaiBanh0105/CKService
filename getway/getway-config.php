<?php
return [
    'routes' => [
        // Endpoint Đăng nhập mới (trỏ về service: 'users')
        '/users/login'       => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'login'],

        //Đổi mật khẩu
        '/users/change_password'       => ['service' => 'users', 'path' => 'userAPI.php', 'dir' => 'users', 'action' => 'change_password'],

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

        // Endpoint thay đổi số dư
        '/users/change_balance' => [
            'service' => 'users',
            'path' => 'userAPI.php',
            'dir' => 'users',
            'action' => 'change_balance'
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

        //Endpoit lấy máy tính trống theo tên cấu hình
        '/computers/get_available_by_config' => [
            'service' => 'computers',
            'path' => 'computerAPI.php',
            'dir' => 'computer_station',
            'action' => 'get_available_by_config'
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
        '/session/latest_by_computer_id' => [
            'service' => 'session',
            'path' => 'sessionAPI.php',
            'dir' => 'session',
            'action' => 'latest_by_computer_id'
        ],

        // Endpoint lấy danh sách session theo user_id
        '/session/get_session_by_user_id' => [
            'service' => 'session',
            'path' => 'sessionAPI.php',
            'dir' => 'session',
            'action' => 'get_session_by_user_id'
        ],

        // Endpoint thêm phiên mới
        '/session/add_session' => [
            'service' => 'session',
            'path' => 'sessionAPI.php',
            'dir' => 'session',
            'action' => 'add_session'
        ],

        // Endpoint cập nhật trạng thái phiên
        '/session/update_status' => [
            'service' => 'session',
            'path' => 'sessionAPI.php',
            'dir' => 'session',
            'action' => 'update_status'
        ],

        // Endpoint lấy user_id mới nhất từ computer_id trong booking  
        '/booking/latest_by_computer_id' => [
            'service' => 'booking',
            'path' => 'bookingAPI.php',
            'dir' => 'booking',
            'action' => 'latest_by_computer_id'
        ],

        '/booking/create_booking' => [
            'service' => 'booking',
            'path' => 'bookingAPI.php',
            'dir' => 'booking',
            'action' => 'create_booking'
        ],

        '/booking/load_booking' => [
            'service' => 'booking',
            'path' => 'bookingAPI.php',
            'dir' => 'booking',
            'action' => 'load_booking'
        ],

        '/booking/update_status' => [
            'service' => 'booking',
            'path' => 'bookingAPI.php',
            'dir' => 'booking',
            'action' => 'update_status'
        ],

        //tạo otp
        '/otp/create' => [
            'service' => 'email',
            'path'    => 'otpAPI.php',
            'dir'     => 'email',
            'action'  => 'create'
        ],
        //xác nhận otp
        '/otp/confirm' => [
            'service' => 'email',
            'path'    => 'otpAPI.php',
            'dir'     => 'email',
            'action'  => 'confirm'
        ],

        //thêm thanh toán cho khách hàng có account
        '/payment/add_to_customer' => [
            'service' => 'payment',
            'path'    => 'paymentAPI.php',
            'dir'     => 'payment',
            'action'  => 'add_to_customer'
        ],

        //thêm thanh toán cho khách vãng lai
        '/payment/add_to_guest' => [
            'service' => 'payment',
            'path'    => 'paymentAPI.php',
            'dir'     => 'payment',
            'action'  => 'add_to_guest'
        ],

        //Thống kê tổng thu nhập
        '/payment/revenue' => [
            'service' => 'payment',
            'path'    => 'paymentAPI.php',
            'dir'     => 'payment',
            'action'  => 'revenue'
        ],

        
    ],


    'ports' => [
        // Chỉ cần định nghĩa port cho service 'users'
        'users'    => '8001',

        'computers' => '8002',

        'session' => '8003',

        'booking' => '8004',

        'email' => '8005',

        'payment' => '8006'
    ]
];
