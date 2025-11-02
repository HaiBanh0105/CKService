// js/main.js

// --- 1. HÀM TẢI ĐỘNG GIAO DIỆN ---
/**
 * Tải nội dung HTML từ file và chèn vào một container trong DOM.
 * @param {string} elementId - ID của phần tử container (ví dụ: 'dashboard-container').
 * @param {string} filePath - Đường dẫn đến file HTML (ví dụ: 'sections/dashboard.html').
 */
async function loadComponent(elementId, filePath) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.error(`Container ID không tồn tại: ${elementId}`);
        return;
    }

    try {
        // Đường dẫn tương đối (filePath) đã đủ, vì các thư mục sections/ và modals/
        // nằm ngang hàng với index.html trong thư mục html/.
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status} khi tải ${filePath}`);
        }
        const html = await response.text();
        container.innerHTML = html;
    } catch (error) {
        console.error(`Không thể tải component:`, error);
        container.innerHTML = `<div style="padding: 20px; color: red;">LỖI TẢI GIAO DIỆN: Vui lòng kiểm tra console.</div>`;
    }
}


// --- 2. HÀM KHỞI TẠO CHÍNH (INIT) ---
async function init() {
    // 1. Tải tất cả các Sections (Tải đồng thời)
    await Promise.all([
        loadComponent('dashboard-container', 'sections/dashboard.html'),
        loadComponent('computers-container', 'sections/computers.html'),
        loadComponent('customers-container', 'sections/customers.html'),
        loadComponent('services-container', 'sections/services.html'),
        loadComponent('revenue-container', 'sections/revenue.html'),
        loadComponent('settings-container', 'sections/settings.html')
    ]);

    // 2. Tải tất cả các Modals (Tải đồng thời)
    await Promise.all([
        loadComponent('computerModal', 'modals/computer-modal.html'),
        loadComponent('customerModal', 'modals/customer-modal.html'),
        loadComponent('serviceModal', 'modals/service-modal.html')
    ]);

    // 3. Thiết lập các hàm tương tác DOM toàn cục
    setupGlobalFunctions();

    // 4. Hiển thị Dashboard mặc định sau khi mọi thứ đã được tải
    window.showSection('dashboard');
    
    // Tải dữ liệu mẫu (chỉ để giao diện trông đầy đủ)
    loadSampleData();
    renderAllData(); 
}


// --- 3. CÁC HÀM TƯƠNG TÁC DOM TOÀN CỤC ---
function setupGlobalFunctions() {
    // Hàm hiển thị Section và Active Sidebar
    window.showSection = (sectionName) => {
        const containerId = `${sectionName}-container`;
        
        // Ẩn tất cả Sections
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        
        // Hiển thị Section được chọn
        const targetSection = document.getElementById(containerId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Cập nhật Active Link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[onclick*='showSection(\\'${sectionName}\\')']`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Cập nhật tiêu đề trang
        const titles = {
            dashboard: 'Dashboard', computers: 'Quản Lý Máy', customers: 'Khách Hàng',
            services: 'Dịch Vụ', revenue: 'Doanh Thu', settings: 'Cài Đặt'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName];
    };

    // Hàm mở Modal
    window.openModal = (id) => {
        document.getElementById(id).classList.add('active');
    };

    // Hàm đóng Modal
    window.closeModal = (id) => {
        document.getElementById(id).classList.remove('active');
    };
    
    // Placeholder cho các hàm CRUD (Đảm bảo HTML không lỗi khi gọi)
    window.addComputer = () => alert('Tính năng Thêm Máy chưa được kết nối API.');
    window.addCustomer = () => alert('Tính năng Thêm Khách Hàng chưa được kết nối API.');
    window.addService = () => alert('Tính năng Thêm Dịch Vụ chưa được kết nối API.');
    window.deleteCustomer = (id) => console.log(`Xóa KH: ${id}`);
    window.deleteService = (id) => console.log(`Xóa DV: ${id}`);
}


// --- 4. DATA MẪU (TỪ FILE GỐC, CHỈ ĐỂ RENDER) ---
let computers = [];
let customers = [];
let services = [];

function loadSampleData() {
    // Logic tạo dữ liệu mẫu
    for (let i = 1; i <= 30; i++) {
        const statuses = ['online', 'offline', 'busy'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        computers.push({
            id: i, code: `PC-${String(i).padStart(3, '0')}`, type: i <= 10 ? 'VIP' : 'Thường', status: status, spec: 'Core i5, RAM 16GB, GTX 1660'
        });
    }
    customers = [
        { id: 1, code: 'KH001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'a@email.com', balance: 100000, status: 'online' },
        { id: 2, code: 'KH002', name: 'Trần Thị B', phone: '0907654321', email: 'b@email.com', balance: 50000, status: 'offline' }
    ];
    services = [
        { id: 1, code: 'DV001', name: 'Coca Cola', price: 15000, category: 'Đồ uống', status: 'Còn hàng' },
        { id: 2, code: 'DV002', name: 'Mì tôm', price: 10000, category: 'Đồ ăn', status: 'Còn hàng' }
    ];
}

function renderComputers() {
    const grid = document.getElementById('computerGrid');
    if (!grid) return; 
    grid.innerHTML = computers.map(pc => `
        <div class="computer-card ${pc.status}">
            <div class="computer-icon"><i class="fas fa-desktop"></i></div>
            <div class="computer-name">${pc.code}</div>
            ${pc.status === 'online' ? 'Trống' : pc.status === 'busy' ? 'Đang sử dụng' : 'Tắt máy'}
        </div>
    `).join('');
}

function renderCustomers() {
    const table = document.getElementById('customerTable');
    if (!table) return;
    table.innerHTML = customers.map(c => `
        <tr>
            <td>${c.code}</td>
            <td>${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td>${c.balance.toLocaleString()}đ</td>
            <td><span class="status ${c.status}">${c.status}</span></td>
            <td>
                <button class="btn btn-success btn-sm" onclick="editCustomer(${c.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderServices() {
    const table = document.getElementById('serviceTable');
    if (!table) return;
    table.innerHTML = services.map(s => `
        <tr>
            <td>${s.code}</td>
            <td>${s.name}</td>
            <td>${s.price.toLocaleString()}đ</td>
            <td>${s.category}</td>
            <td>${s.status}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="editService(${s.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteService(${s.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderAllData() {
    // Gọi các hàm render sau khi các container HTML đã được tải động vào DOM
    setTimeout(() => {
        renderComputers();
        renderCustomers();
        renderServices();
    }, 100); // Độ trễ nhỏ đảm bảo các thẻ ID đã xuất hiện
}


// --- 5. KHỞI ĐỘNG ---
document.addEventListener('DOMContentLoaded', init);