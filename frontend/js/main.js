// 📁 Đặt file này tại: /public/assets/js/main.js hoặc đường dẫn bạn đang dùng

const sectionMap = {
  dashboard: "dashboard-container",
  computers: "computers-container",
  customers: "customers-container",
  services: "services-container",
  revenue: "revenue-container",
  settings: "settings-container"
};

const viewMap = {
  dashboard: "/NetMaster/frontend/html/sections/dashboard.html",
  computers: "/NetMaster/frontend/html/sections/computers.html",
  customers: "/NetMaster/frontend/html/sections/customers.html",
  services: "/NetMaster/frontend/html/sections/services.html",
  revenue: "/NetMaster/frontend/html/sections/revenue.html",
  settings: "/NetMaster/frontend/html/sections/settings.html"
};

function showSection(sectionName) {
  // 1. Cập nhật tiêu đề
  const pageTitle = document.getElementById("pageTitle");
  pageTitle.textContent = getTitle(sectionName);

  // 2. Ẩn tất cả section
  Object.values(sectionMap).forEach(id => {
    document.getElementById(id).classList.remove("active");
  });

  // 3. Hiển thị section được chọn
  const targetId = sectionMap[sectionName];
  const targetContainer = document.getElementById(targetId);
  targetContainer.classList.add("active");

  // 4. Tải nội dung HTML từ file tương ứng
  const viewPath = viewMap[sectionName];
  fetch(viewPath)
    .then(res => res.text())
    .then(html => {
      targetContainer.innerHTML = html;
      if (sectionName === "customers") {
        requestAnimationFrame(() => {
          loadCustomerList();
        });
}

      
    })
    
    .catch(err => {
      targetContainer.innerHTML = `<p style="color:red;">Lỗi khi tải giao diện: ${err.message}</p>`;
    });

  // 5. Cập nhật trạng thái menu
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  });
  const activeLink = document.querySelector(`.nav-link[onclick*="${sectionName}"]`);
  if (activeLink) activeLink.classList.add("active");
}

function getTitle(sectionName) {
  switch (sectionName) {
    case "dashboard": return "Dashboard";
    case "computers": return "Quản Lý Máy";
    case "customers": return "Khách Hàng";
    case "services": return "Dịch Vụ";
    case "revenue": return "Doanh Thu";
    case "settings": return "Cài Đặt";
    default: return "Cyber Gaming";
  }
}

// 🚀 Tải giao diện mặc định khi mở trang
document.addEventListener("DOMContentLoaded", () => {
  showSection("dashboard");
});

function openModal(modalId, callback) {
  const modalContainer = document.getElementById(modalId);
  if (!modalContainer) return;

  let modalPath = "";

  switch (modalId) {
    case "customerModal":
      modalPath = "/NetMaster/frontend/html/modals/customer-modal.html";
      break;
    case "computerModal":
      modalPath = "/NetMaster/frontend/html/modals/computer-modal.html";
      break;
    case "serviceModal":
      modalPath = "/NetMaster/frontend/html/modals/service-modal.html";
      break;
    case "transactionModal":
      modalPath = "/NetMaster/frontend/html/modals/customer-transaction.html";
      break;
    default:
      modalContainer.innerHTML = "<p>Không tìm thấy modal phù hợp.</p>";
      return;
  }

  fetch(modalPath)
    .then(res => res.text())
    .then(html => {
      modalContainer.innerHTML = html;
      modalContainer.classList.add("active");
      if (typeof callback === "function") callback(); // Gọi sau khi modal đã gắn xong
    })
    .catch(err => {
      modalContainer.innerHTML = `<p style="color:red;">Lỗi khi tải modal: ${err.message}</p>`;
    });
}


function closeModal(modalId) {
  const modalContainer = document.getElementById(modalId);
  if (modalContainer) {
    modalContainer.classList.remove("active");
    modalContainer.innerHTML = ""; // Xóa nội dung modal
  }
}

