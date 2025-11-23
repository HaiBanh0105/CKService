// Hàm tải danh sách khách hàng từ API và hiển thị trong bảng
function loadCustomerList() {
  fetch("http://localhost/NetMaster/getway/users/load_customers")
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const customers = response.data;
        const tableBody = document.getElementById("customerTable");
        tableBody.innerHTML = "";

        customers.forEach((c) => {
          const row = document.createElement("tr");
          const formattedBalance = new Intl.NumberFormat("vi-VN").format(
            c.current_balance
          );
          row.innerHTML = `
            <td>${c.full_name}</td>
            <td>${c.phone_number}</td>
            <td>${c.email}</td>
            <td>${`${formattedBalance} đ`}</td>
            <td>${c.status}</td>
            <td>
            <!-- Xem lịch sử -->
            <button class="btn btn-sm btn-info view-history-btn" data-id="${
              c.user_id
            }" title="Xem lịch sử">
              <i class="fas fa-history"></i>
            </button>

            <!-- Chỉnh sửa -->
            <button class="btn btn-sm btn-warning updateUser" data-id="${
              c.user_id
            }" title="Chỉnh sửa">
              <i class="fas fa-edit"></i>
            </button>

            <!-- Nạp tiền -->
            <button class="btn btn-sm btn-success addBalance" 
                    data-id="${c.user_id}" 
                    data-email="${c.email}" 
                    title="Nạp tiền">
              <i class="fas fa-wallet"></i>
            </button>
          </td>

            `;
          tableBody.appendChild(row);
        });

        document.querySelectorAll(".view-history-btn").forEach((button) => {
          button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            console.log("Đã click nút xem lịch sử, userId =", userId);

            openModal("transactionModal", () => {
              openTransactionHistory(userId);
            });
          });
        });

        // Gắn sự kiện cho nút "Chỉnh sửa"
        document.querySelectorAll(".updateUser").forEach((button) => {
          button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            // Gọi hàm mở modal và truyền userId nếu cần
            openModal("updateUser", () => {
              loadUserInfo(userId);
            });
          });
        });
        // Gắn sự kiện cho nút "Nạp tiền"
        document.querySelectorAll(".addBalance").forEach((button) => {
          button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            const email = this.getAttribute("data-email");
            // Gọi hàm mở modal và truyền userId nếu cần

            openModal("rechargeModal", () => {
              sessionStorage.setItem("userId_recharge", userId);
              sessionStorage.setItem("email_recharge", email);
            });
          });
        });
      } else {
        alert("Không thể tải danh sách khách hàng.");
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
    });
}

// Hàm tải danh sách nhân viên từ API và hiển thị trong bảng
function loadStaffList() {
  fetch("http://localhost/NetMaster/getway/users/load_staff")
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const staffs = response.data;
        const tableBody = document.getElementById("staffTable");
        tableBody.innerHTML = "";

        staffs.forEach((c) => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td>${c.full_name}</td>
          <td>${c.phone_number}</td>
          <td>${c.email}</td>
          <td>
            <!-- Chỉnh sửa -->
            <button class="btn btn-sm btn-warning updateUser" data-id="${c.user_id}" title="Chỉnh sửa">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        `;
          tableBody.appendChild(row);
        });

        // Gắn sự kiện cho nút "Chỉnh sửa"
        document.querySelectorAll(".updateUser").forEach((button) => {
          button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            // Gọi hàm mở modal và truyền userId nếu cần
            openModal("updateUser", () => {
              loadUserInfo(userId);
            });
          });
        });
      } else {
        alert("Không thể tải danh sách nhân viên.");
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
    });
}

let originalUserData = {};
//Hàm load thông tin người dùng vào form cập nhật
function loadUserInfo(userId) {
  fetch(`http://localhost/NetMaster/getway/users/get_by_id?user_id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Phản hồi không hợp lệ từ server");
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        const user = data.data;
        document.getElementById("fullname").value = user.full_name || "";
        document.getElementById("phone").value = user.phone_number || "";
        document.getElementById("email").value = user.email || "";

        // Lưu dữ liệu gốc để so sánh sau
        originalUserData = {
          user_id: user.user_id,
          full_name: user.full_name,
          phone_number: user.phone_number,
          email: user.email,
        };

        // Lưu userId vào modal để dùng khi cập nhật
        document.getElementById("updateUserForm").dataset.userId = user.user_id;
      } else {
        alert("Không thể tải thông tin người dùng: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API:", error);
      alert("Đã xảy ra lỗi khi tải thông tin người dùng.");
    });
}

// let selectedMethod = document.getElementById("selectedPaymentMethod").value;

// Hàm xử lý khi nhấn nút thêm khách hàng
function handleAddCustomer() {
  const data = {
    full_name: document.getElementById("customerName").value,
    phone_number: document.getElementById("customerPhone").value,
    email: document.getElementById("customerEmail").value,
    password: document.getElementById("customerPassword").value,
    initial_balance: parseFloat(
      document.getElementById("customerBalance").value || "0"
    ),
    payment_method: "cash",
  };

  fetch("http://localhost/NetMaster/getway/users/add_customer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      console.log("Phản hồi từ API:", response);
      if (response.status === "success") {
        alert("Thêm khách hàng thành công!");
        loadCustomerList();
        closeModal("customerModal");
      } else {
        alert("Lỗi: " + response.message);
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
    });
}

// Hàm mở modal lịch sử giao dịch của khách hàng
function openTransactionHistory(userId) {
  console.log("Gọi API lịch sử cho user_id =", userId);

  const url = `http://localhost/NetMaster/getway/users/transactions?user_id=${userId}`;

  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const transactions = response.data;
        const historyBody = document.getElementById("transactionHistoryBody");
        historyBody.innerHTML = "";

        if (transactions.length === 0) {
          historyBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Không có giao dịch nào.</td></tr>`;
          return;
        }

        transactions.forEach((t) => {
          if (t.transaction_type == "topup") {
            text = "Nạp tiền";
          } else {
            text = "Đặt máy";
          }
          if (t.payment_method == "cash") {
            method = "tiền mặt";
          } else if (t.payment_method == "card") {
            method = "thẻ ngân hàng";
          } else if (t.payment_method == "account") {
            method = "tài khoản cá nhân";
          } else {
            method = t.payment_method;
          }
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${t.amount.toLocaleString()} đ</td>
            <td>${text}</td>
            <td>${method}</td>
            <td>${new Date(t.transaction_date).toLocaleString()}</td>
          `;
          historyBody.appendChild(row);
        });

        // // Hiển thị modal
        // $("#transactionHistoryModal").modal("show");
      } else {
        alert("Không thể tải lịch sử giao dịch: " + response.message);
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API lịch sử giao dịch:", err);
      alert("Đã xảy ra lỗi khi tải lịch sử giao dịch.");
    });
}

// Hàm xử lý khi nhấn nút thêm nhân viên
function handleAddStaff() {
  const data = {
    full_name: document.getElementById("staffName").value,
    phone_number: document.getElementById("staffPhone").value,
    email: document.getElementById("staffEmail").value,
    password: document.getElementById("staffPassword").value,
  };

  fetch("http://localhost/NetMaster/getway/users/add_staff", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      console.log("Phản hồi từ API:", response);
      if (response.status === "success") {
        alert("Thêm nhân viên thành công!");
        loadStaffList();
        closeModal("staffModal");
      } else {
        alert("Lỗi: " + response.message);
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
    });
}

// // Hàm xử lý nút updateUser
function handleUpdateUser() {
  const modal = document.getElementById("updateUserForm");
  const userId = modal.dataset.userId;

  const fullName = document.getElementById("fullname").value.trim();
  const phoneNumber = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  // So sánh với dữ liệu gốc
  const isUnchanged =
    fullName === originalUserData.full_name &&
    phoneNumber === originalUserData.phone_number &&
    email === originalUserData.email;

  if (isUnchanged) {
    closeModal("updateUser");
    return;
  }

  // Kiểm tra dữ liệu đầu vào
  if (!fullName || !phoneNumber || !email) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const payload = {
    user_id: userId,
    full_name: fullName,
    phone_number: phoneNumber,
    email: email,
  };

  fetch("http://localhost/NetMaster/getway/users/update_by_id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Cập nhật thành công!");
        closeModal("updateUser");
        loadCustomerList();
        loadStaffList();
      } else {
        alert("Cập nhật thất bại: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật người dùng:", error);
      alert("Đã xảy ra lỗi khi gửi yêu cầu cập nhật.");
    });
}

//Hàm cập nhật số dư
async function changeBalance(userId, amount, payment_method) {
  const response = await fetch(
    "http://localhost/NetMaster/getway/users/change_balance",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        amount: amount,
        payment_method: payment_method,
      }),
    }
  );

  const result = await response.json();
  console.log(result);
}

async function getUserIdByFullName(fullName) {
  const url = `http://localhost/NetMaster/getway/users/get_by_name?full_name=${encodeURIComponent(
    fullName
  )}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (
      result.status === "success" &&
      Array.isArray(result.data) &&
      result.data.length > 0
    ) {
      return result.data[0].user_id;
    } else {
      console.warn(
        "Không tìm thấy người dùng:",
        result.message || "Không có dữ liệu."
      );
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API get_by_name:", error);
    return null;
  }
}

// Hàm lấy full_name từ user_id
async function fetchUserNameByUserId(userId) {
  const url = `http://localhost/NetMaster/getway/users/get_by_id?user_id=${encodeURIComponent(
    userId
  )}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.status === "success" && result.data?.full_name) {
      return result.data.full_name;
    } else {
      console.warn("Không tìm thấy người dùng:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
}

function logout() {
  // Xóa dữ liệu lưu trong localStorage hoặc sessionStorage
  sessionStorage.clear();

  // Chuyển hướng về trang login
  window.location.href = "./login.html";
}
