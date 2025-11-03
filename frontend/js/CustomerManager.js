// TÊN FILE: frontend/js/CustomerManager.js
// Mục đích: Quản lý toàn bộ logic nghiệp vụ (API Calls) cho phần Khách hàng.

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION ---
    // URL Root-Relative để gọi API Gateway
    const API_BASE_URL = '/NetMaster/getway/users/'; 
    
    // --- 2. LOGIC TẢI DỮ LIỆU TỪ API (Ghi đè hàm placeholder) ---
    /**
     * Gọi API GET /v1/users/all để tải danh sách khách hàng.
     */
    window.fetchCustomers = async () => {
        try {
            // Giả định API GET /v1/users/all trả về users và balance
            const response = await fetch(API_BASE_URL + 'all'); 
            
            if (!response.ok) throw new Error('Lỗi HTTP khi tải danh sách khách hàng.');

            const result = await response.json();
            
            if (result.status === 'success' && window.appData && window.renderCustomers) {
                // Cập nhật GLOBAL STATE (window.appData.customers)
                window.appData.customers = result.data.map(user => ({
                    id: user.user_id,
                    code: 'KH' + String(user.user_id).padStart(3, '0'),
                    name: user.full_name,
                    phone: user.phone_number,
                    email: user.email,
                    balance: parseFloat(user.current_balance || 0), 
                    // Tùy chỉnh trạng thái dựa trên role (hoặc dữ liệu từ Session Service)
                    status: user.role_name === 'customer' ? 'offline' : user.role_name 
                }));
                
                // GỌI HÀM RENDER TỪ main.js để vẽ lại bảng
                window.renderCustomers(); 
            }
        } catch (error) {
            console.error('Fetch Customers Error:', error);
            alert('Không thể tải danh sách khách hàng. Vui lòng kiểm tra Server/API Gateway.');
            // Hiển thị dữ liệu mẫu nếu API thất bại (fallback)
            if(window.renderCustomers) window.renderCustomers();
        }
    };
    
    // --- 3. LOGIC THÊM KHÁCH HÀNG MỚI (Ghi đè hàm placeholder) ---
    /**
     * Xử lý việc thêm khách hàng mới (POST API /v1/users/register).
     */
    window.addCustomer = async () => {
        // Lấy các phần tử cần thiết
        const modalElement = document.getElementById('customerModal');
        const modalForm = modalElement ? modalElement.querySelector('form') : null;
        const addBtn = modalElement ? modalElement.querySelector('#addCustomerSubmitBtn') : null;
        
        if (!modalForm || !addBtn) {
            console.error("Lỗi DOM: Không tìm thấy form/nút trong customerModal.");
            return;
        }

        const full_name = document.getElementById('customerName').value.trim();
        const phone_number = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        // Mật khẩu tạm thời (cần cho hàm insert_user() PHP)
        const temp_password = '123456'; 
        const initial_balance = parseInt(document.getElementById('customerBalance').value) || 0;

        if (!full_name || !phone_number || !email) {
             alert("Vui lòng nhập đầy đủ Tên, SĐT và Email.");
             return;
        }
        
        addBtn.disabled = true;
        addBtn.textContent = 'Đang thêm...';

        try {
            const response = await fetch(API_BASE_URL + 'register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    full_name: full_name, 
                    phone_number: phone_number,
                    email: email, 
                    password: temp_password,
                    initial_balance: initial_balance
                })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                alert(result.message || "Thêm khách hàng thành công!");
                
                // RESET FORM, ĐÓNG MODAL, và TẢI LẠI DỮ LIỆU
                modalForm.reset();
                window.closeModal('customerModal'); 
                await window.fetchCustomers(); 

            } else {
                alert("Lỗi: " + (result.message || 'Không thể thêm khách hàng.'));
            }

        } catch (error) {
            console.error('Add Customer API Error:', error);
            alert('Lỗi kết nối máy chủ khi thêm khách hàng.');
        } finally {
            addBtn.disabled = false;
            addBtn.textContent = 'Thêm';
        }
    };
    
    // --- 4. GẮN EVENT LISTENER VÀ GỌI FETCH LẦN ĐẦU ---
    // Sử dụng setTimeout ngắn để đảm bảo main.js đã tải modal và các ID
    setTimeout(() => {
        const addBtn = document.getElementById('addCustomerSubmitBtn');
        const modalForm = document.getElementById('customerModal').querySelector('form');
        
        if (addBtn && modalForm) {
            // Gắn event listener vào form submit
            modalForm.addEventListener('submit', (e) => {
                 e.preventDefault(); 
                 window.addCustomer(); // Gọi hàm toàn cục đã được ghi đè
            });
            
            // Khởi động tải dữ liệu khi component được nạp
            window.fetchCustomers();
        }
    }, 500); 
});