// 📁 Đặt file này tại: /public/assets/js/main.js hoặc đường dẫn bạn đang dùng

const sectionMap = {
  dashboard: "dashboard-container",
  computers: "computers-container",
  customers: "customers-container",
  staff: "staff-container",
  revenue: "revenue-container",
  payment: "payment-container"
};

const viewMap = {
  dashboard: "/NetMaster/frontend/html/sections/dashboard.html",
  computers: "/NetMaster/frontend/html/sections/computers.html",
  customers: "/NetMaster/frontend/html/sections/customers.html",
  staff: "/NetMaster/frontend/html/sections/staff.html",
  revenue: "/NetMaster/frontend/html/sections/revenue.html",
  payment: "/NetMaster/frontend/html/sections/payment.html"
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
      if (sectionName === "dashboard") {
        requestAnimationFrame(() => {
          loadComputerStats();
          loadComputerActive();
          loadMaintenanceComputers();
          loadLockedComputers();
        });
      }
      else if (sectionName === "customers") {
        requestAnimationFrame(() => {
          loadCustomerList();
        });  
      } else if(sectionName === "computers") {
        requestAnimationFrame(() => {
          loadComputers();
        });
      }
      else if(sectionName === "staff") {
        requestAnimationFrame(() => {
          loadStaffList()
        });
      }
      else if(sectionName === "payment") {
        requestAnimationFrame(() => {
          loadComputersToPayment()
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
    case "staff": return "Nhân viên";
    case "revenue": return "Doanh Thu";
    case "settings": return "Cài Đặt";
    case "payment": return "Thanh Toán";
    default: return "Cyber Gaming";
  }
}

// 🚀 Tải giao diện mặc định khi mở trang
document.addEventListener("DOMContentLoaded", () => {
  showSection("dashboard");
  // Hiển thị nút Quản lý nhân viên nếu là Admin
  
  const userRole = sessionStorage.getItem("userRole");
  const btnStaff = document.getElementById("BtnStaff");

  if (btnStaff) {
    btnStaff.style.display = userRole === "admin" ? "inline" : "none";
  }
  document.getElementById("userName").textContent = sessionStorage.getItem("userName");
  if(userRole == "admin"){
  document.getElementById("userRole").textContent = "Quản trị viên";
  }else if(userRole == "staff"){
    document.getElementById("userRole").textContent = "Nhân viên";
  }else{
    document.getElementById("userRole").textContent = "Khách hàng";
  }
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
    case "staffModal":
      modalPath = "/NetMaster/frontend/html/modals/staff-modal.html";
      break;
    case "transactionModal":
      modalPath = "/NetMaster/frontend/html/modals/customer-transaction.html";
      break;
    case "editComputerModal":
      modalPath = "/NetMaster/frontend/html/modals/edit-computer.html";
      break;  
    case "configModal":
      modalPath = "/NetMaster/frontend/html/modals/update-config.html";
      break;   
    case "addConfig":
      modalPath = "/NetMaster/frontend/html/modals/add-config.html";
      break;  
    case "updateUser":
      modalPath = "/NetMaster/frontend/html/modals/update-user.html";
      break;   
    case "guestName":
      modalPath = "/NetMaster/frontend/html/modals/guestName.html";
      break;    
    case "rechargeModal":
      modalPath = "/NetMaster/frontend/html/modals/rechargeModal.html";
      break;
    case "paymentModal":
      modalPath = "/NetMaster/frontend/html/modals/payment-modal.html";
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

