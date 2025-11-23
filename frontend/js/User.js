const sectionMap = {
  session: "session-container",
  booking: "booking-container",
  payment: "payment-container",
  profile: "profile-container",
};

const viewMap = {
  session: "/NetMaster/frontend/html/sections/session.html",
  booking: "/NetMaster/frontend/html/sections/booking.html",
  payment: "/NetMaster/frontend/html/sections/user_payment.html",
  profile: "/NetMaster/frontend/html/sections/profile.html",
};

function showSection(sectionName, callback) {
  // 1. Ẩn tất cả section
  Object.values(sectionMap).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  // 2. Hiển thị section được chọn
  const targetId = sectionMap[sectionName];
  const targetContainer = document.getElementById(targetId);
  if (targetContainer) targetContainer.classList.add("active");

  // 3. Tải nội dung HTML từ file tương ứng
  const viewPath = viewMap[sectionName];
  fetch(viewPath)
    .then((res) => res.text())
    .then((html) => {
      if (targetContainer) targetContainer.innerHTML = html;

      if (sectionName === "profile") {
        requestAnimationFrame(() => {
          loadCustomerInfo(sessionStorage.getItem("customerID"));
          loadBalance(sessionStorage.getItem("customerID"));
        });
      }

      if (sectionName === "booking") {
        requestAnimationFrame(() => {
          loadBookingHistory(sessionStorage.getItem("customerID"));
          loadOptionPrices();
          setBookingDateLimits();
          loadBalance(sessionStorage.getItem("customerID"));
        });
      }

      if (sectionName === "payment") {
        requestAnimationFrame(() => {
          openTransactionHistory(sessionStorage.getItem("customerID"));
        });
      }

      if (sectionName === "session") {
        requestAnimationFrame(() => {
          openSessionHistory(sessionStorage.getItem("customerID"));
        });
      }
      // 4. Gọi callback sau khi nội dung đã được gắn
      if (typeof callback === "function") {
        requestAnimationFrame(() => callback());
      }
    })
    .catch((err) => {
      if (targetContainer)
        targetContainer.innerHTML = `<p style="color:red;">Lỗi khi tải giao diện: ${err.message}</p>`;
    });

  // 5. Cập nhật trạng thái tab
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active");
    if (
      tab.getAttribute("onclick") &&
      tab.getAttribute("onclick").includes(`'${sectionName}'`)
    ) {
      tab.classList.add("active");
    }
  });
}

function openModal(modalId, callback) {
  const modalContainer = document.getElementById(modalId);
  if (!modalContainer) return;

  let modalPath = "";

  switch (modalId) {
    case "rechargeModal":
      modalPath = "/NetMaster/frontend/html/modals/rechargeModal.html";
      break;
    case "computerModal":
      modalPath = "/NetMaster/frontend/html/modals/computerModal.html";
      break;
    case "guestName":
      modalPath = "/NetMaster/frontend/html/modals/guestName.html";
      break;
    default:
      modalContainer.innerHTML = "<p>Không tìm thấy modal phù hợp.</p>";
      return;
  }

  fetch(modalPath)
    .then((res) => res.text())
    .then((html) => {
      modalContainer.innerHTML = html;
      modalContainer.classList.add("active");
      if (typeof callback === "function") callback();
    })
    .catch((err) => {
      modalContainer.innerHTML = `<p style="color:red;">Lỗi khi tải modal: ${err.message}</p>`;
    });
}

function closeModal(modalId) {
  const modalContainer = document.getElementById(modalId);
  if (modalContainer) {
    modalContainer.classList.remove("active");
    modalContainer.innerHTML = "";
  }
}

// 🚀 Khởi tạo khi trang tải
document.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("userRole")) {
    window.location.href = "./login.html";
  }

  showSection("session");
  loadBalance(sessionStorage.getItem("customerID"));

  //   const userName = sessionStorage.getItem("userName") || "Khách";
  //   const userRole = sessionStorage.getItem("userRole") || "customer";

  //   document.getElementById("userName").textContent = userName;
  //   document.getElementById("userRole").textContent =
  //     userRole === "admin" ? "Quản trị viên" :
  //     userRole === "staff" ? "Nhân viên" : "Khách hàng";
});
