// TÊN FILE: frontend/js/register.js
// Mục đích: Chứa toàn bộ logic API và nghiệp vụ cho phần Khách hàng (CRUD)

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION ---
    const API_BASE_URL = '/NetMaster/getway/users/'; 
    
    // --- 2. LOGIC TẢI DỮ LIỆU KHÁCH HÀNG THỰC TẾ (Ghi đè fetchCustomers) ---
    window.fetchCustomers = async () => {
        try {
            const response = await fetch(API_BASE_URL + 'all'); 
            
            if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status} khi tải danh sách.`);

            const result = await response.json();
            
            if (result.status === 'success' && window.appData && window.renderCustomers) {
                // CẬP NHẬT GLOBAL STATE
                window.appData.customers = result.data.map(user => ({
                    id: user.user_id,
                    code: 'KH' + String(user.user_id).padStart(3, '0'),
                    name: user.full_name,
                    phone: user.phone_number,
                    email: user.email,
                    balance: parseFloat(user.current_balance || 0), 
                    status: user.role_name === 'customer' ? 'offline' : user.role_name
                }));
                
                window.renderCustomers(); 
            }
        } catch (error) {
            console.error('Fetch Customers Error:', error);
            if(window.renderCustomers) window.renderCustomers();
        }
    };
    
    // --- 3. LOGIC THÊM KHÁCH HÀNG MỚI (Ghi đè addCustomer) ---
    window.addCustomer = async (e) => {
        if(e) e.preventDefault();
        
        const modalForm = document.getElementById('addCustomerForm');
        const addBtn = document.getElementById('addCustomerSubmitBtn');
        
        if (!modalForm || !addBtn) {
            console.error("Lỗi DOM: addCustomer được gọi nhưng Form hoặc Nút không tồn tại.");
            return;
        }
        
        const full_name = document.getElementById('customerName').value.trim();
        const phone_number = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const initial_balance = parseInt(document.getElementById('customerBalance').value) || 0;
        const temp_password = '123456'; 

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
                
                modalForm.reset();
                window.closeModal('customerModal'); 
                await window.fetchCustomers(); // Tải lại dữ liệu

            } else {
                alert("Lỗi: " + (result.message || 'Không thể thêm khách hàng.'));
            }

        } catch (error) {
            console.error('Add Customer API Error:', error);
            alert('Lỗi kết nối máy chủ khi thêm khách hàng.');
        } finally {
            addBtn.disabled = false;
            addBtn.textContent = 'Thêm Khách Hàng';
        }
    };
    
    // ----------------------------------------------------
    // LOGIC GẮN EVENT VÀ KHỞI ĐỘNG (FIX LỖI TIMING)
    // ----------------------------------------------------
    
    /**
     * Hàm đệ quy kiểm tra và gắn Event Listener sau khi modal được load bởi main.js
     */
    const attachRegisterEvents = () => {
        const modalForm = document.getElementById('addCustomerForm');

        if (modalForm) {
            // GẮN LISTENER LÊN FORM SUBMIT CHUẨN
            modalForm.addEventListener('submit', window.addCustomer);
            
            console.log("✅ Register Events Attached to addCustomerForm.");
            
            // 🚨 GỌI API LẦN ĐẦU (Chỉ gọi sau khi đảm bảo hàm đã được định nghĩa)
            window.fetchCustomers();
            
        } else {
            // Nếu chưa tìm thấy, chờ 100ms và thử lại
            setTimeout(attachRegisterEvents, 100); 
        }
    };

    // Khởi động quá trình gắn Listener
    attachRegisterEvents();
});