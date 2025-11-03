// TÊN FILE: frontend/js/register.js
// Mục đích: Xử lý logic nghiệp vụ CRUD Khách Hàng

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION ---
    const API_BASE_URL = '/NetMaster/getway/users/'; 
    
    // --- 2. HÀM TẢI DỮ LIỆU TOÀN CỤC (Giữ nguyên) ---
    window.fetchCustomers = async () => { 
        // ... (Logic API và cập nhật window.appData) ... 
    };
    
    // --- 3. LOGIC THÊM KHÁCH HÀNG (Logic nghiệp vụ chính) ---
    const addCustomerLogic = async (addBtn) => {
        // Tìm Form gần nhất (DÙNG CHO VIỆC RESET)
        const modalContent = addBtn.closest('.modal-content');
        const modalForm = modalContent ? modalContent.querySelector('form') : null;
        
        // Lấy dữ liệu
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
                
                if (modalForm) modalForm.reset(); // RESET FORM
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
    
    // --- 4. HÀM GẮN EVENT (Chạy sau khi tải động) ---
    const attachCustomerEvents = () => {
        const addBtn = document.getElementById('addCustomerSubmitBtn');
        
        if (addBtn) {
            // Lắng nghe sự kiện click trên nút
            addBtn.addEventListener('click', (e) => {
                 e.preventDefault(); 
                 addCustomerLogic(addBtn); // Chỉ truyền nút
            });
            
            // Ghi đè hàm placeholder cũ (để đảm bảo tính tương thích)
            window.addCustomer = (e) => {
                if(e) e.preventDefault();
                addCustomerLogic(addBtn);
            };

            // Khởi chạy tải dữ liệu lần đầu
            window.fetchCustomers();

        } else {
            console.warn("Lỗi DOM: Không tìm thấy #addCustomerSubmitBtn. Event listener không được gắn.");
        }
    };

    // Chạy logic gắn event sau một khoảng trễ an toàn
    setTimeout(attachCustomerEvents, 500); 
});
