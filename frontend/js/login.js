
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const passwordField = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    

    function showMessage(element, message, isError = true) {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        
        if (isError) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        } else {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
        }
    }


    // --- LOGIC ẨN/HIỆN MẬT KHẨU ---
    if (passwordToggle && passwordField) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);

            passwordToggle.textContent = (type === 'text') ? '🙈' : '👁️';
        });
    }


    // --- LOGIC GỌI API ĐĂNG NHẬP ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            // Lấy dữ liệu
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Kiểm tra rỗng cơ bản
            if (!email || !password) {
                showMessage(errorMessage, 'Vui lòng điền đầy đủ Email và Mật khẩu.');
                return;
            }

            // Bắt đầu trạng thái Loading
            loginBtn.disabled = true;
            loginBtnText.textContent = 'Đang đăng nhập...';
            showMessage(successMessage, '', false); 

            try {
                const API_LOGIN_URL = 'http://localhost/NetMaster/getway/users/login';
                const response = await fetch(API_LOGIN_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, password: password })
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    // Đăng nhập thành công
                    const userData = result.data;
                    
                    // Lưu Token và Role vào localStorage
                    localStorage.setItem('userName', userData.full_name);
                    localStorage.setItem('userRole', userData.role_name);
                    
                    showMessage(successMessage, `Chào mừng ${userData.full_name}!`, false);
                    
                    // Chuyển hướng đến trang Admin chính
                    if (userData.role_name === 'admin' || userData.role_name === 'staff') {
                        localStorage.setItem('userID', userData.user_id);
                        setTimeout(() => {
                            window.location.href = './index.html';
                        }, 1000);
                    } else if (userData.role_name === 'customer') {
                        localStorage.setItem('customerID', userData.user_id);
                        setTimeout(() => {
                            window.location.href = './userIndex.html';
                        }, 1000);
                    }


                } else {
                    // Đăng nhập thất bại (401 Unauthorized hoặc lỗi API)
                    const message = result.message || 'Lỗi kết nối hoặc thông tin đăng nhập không hợp lệ.';
                    showMessage(errorMessage, message, true);
                }

            } catch (error) {
                console.error('Lỗi Fetch API:', error);
                showMessage(errorMessage, 'Lỗi kết nối máy chủ. Vui lòng thử lại sau.', true);
            } finally {
                // Kết thúc trạng thái Loading
                loginBtn.disabled = false;
                loginBtnText.textContent = 'Đăng nhập';
            }
        });
    }
});