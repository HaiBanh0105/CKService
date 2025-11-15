// Hàm tải danh sách khách hàng từ API và hiển thị trong bảng
function loadCustomerList() {
  fetch("http://localhost/NetMaster/getway/users/load_customers")
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const customers = response.data;
        const tableBody = document.getElementById("customerTable");
        tableBody.innerHTML = "";

        customers.forEach(c => {
          const row = document.createElement("tr");
          const formattedBalance = new Intl.NumberFormat("vi-VN").format(c.current_balance);
          row.innerHTML = `
            <td>${c.user_id}</td>
            <td>${c.full_name}</td>
            <td>${c.phone_number}</td>
            <td>${c.email}</td>
            <td>${`${formattedBalance} đ`}</td>
            <td>${c.status}</td>
            <td>
            <button class="btn btn-sm btn-info view-history-btn" data-id="${c.user_id}">Xem lịch sử</button>
            <button class="btn btn-sm btn-info updateUser" data-id="${c.user_id}">Chỉnh sửa</button>
            <button class="btn btn-sm btn-info addBalance" data-id="${c.user_id}">Nạp tiền</button>
            </td> 
            ` 
          tableBody.appendChild(row);
        });

        document.querySelectorAll(".view-history-btn").forEach(button => {
          button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            console.log("Đã click nút xem lịch sử, userId =", userId);

            openModal('transactionModal', () => {
              openTransactionHistory(userId);
            });
          });
        });

        // Gắn sự kiện cho nút "Chỉnh sửa"
        document.querySelectorAll(".updateUser").forEach(button => {
          button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            // Gọi hàm mở modal và truyền userId nếu cần 
            openModal('updateUser', () => {
                loadUserInfo(userId);
              });
          });
        });
        // Gắn sự kiện cho nút "Nạp tiền"
        document.querySelectorAll(".addBalance").forEach(button => {
          button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            // Gọi hàm mở modal và truyền userId nếu cần 
            openModal('rechargeModal');
          });
        });


      } else {
        alert("Không thể tải danh sách khách hàng.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
    });
}

// Hàm tải danh sách nhân viên từ API và hiển thị trong bảng
function loadStaffList() {
  fetch("http://localhost/NetMaster/getway/users/load_staff")
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const staffs = response.data;
        const tableBody = document.getElementById("staffTable");
        tableBody.innerHTML = "";

        staffs.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${c.user_id}</td>
          <td>${c.full_name}</td>
          <td>${c.phone_number}</td>
          <td>${c.email}</td>
          <td>
            <button class="btn btn-sm btn-info updateUser" data-id="${c.user_id}">Chỉnh sửa</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // Gắn sự kiện cho nút "Chỉnh sửa"
      document.querySelectorAll(".updateUser").forEach(button => {
        button.addEventListener("click", function () {
          const userId = this.getAttribute("data-id");
          // Gọi hàm mở modal và truyền userId nếu cần 
          openModal('updateUser', () => {
              loadUserInfo(userId);
            });
        });
      });

      
      } else {
        alert("Không thể tải danh sách nhân viên.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
    });
}

let originalUserData = {};
//Hàm load thông tin người dùng vào form cập nhật
function loadUserInfo(userId) {
  fetch(`http://localhost/NetMaster/getway/users/get_by_id?user_id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Phản hồi không hợp lệ từ server");
      }
      return response.json();
    })
    .then(data => {
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
          email: user.email
        };

        // Lưu userId vào modal để dùng khi cập nhật
        document.getElementById("updateUserForm").dataset.userId = user.user_id;

      } else {
        alert("Không thể tải thông tin người dùng: " + data.message);
      }
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error);
      alert("Đã xảy ra lỗi khi tải thông tin người dùng.");
    });
}




// Hàm xử lý khi nhấn nút thêm khách hàng
function handleAddCustomer() {
  const data = {
    full_name: document.getElementById("customerName").value,
    phone_number: document.getElementById("customerPhone").value,
    email: document.getElementById("customerEmail").value,
    password: document.getElementById("customerPassword").value,
    initial_balance: parseFloat(document.getElementById("customerBalance").value || "0")
  };

  fetch("http://localhost/NetMaster/getway/users/add_customer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      console.log("Phản hồi từ API:", response);
      if (response.status === "success") {
        alert("Thêm khách hàng thành công!");
        loadCustomerList();
        closeModal("customerModal");
      } else {
        alert("Lỗi: " + response.message);
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
    });
}

// Hàm mở modal lịch sử giao dịch của khách hàng
function openTransactionHistory(userId) {
  console.log("Gọi API lịch sử cho user_id =", userId);

  const url = `http://localhost/NetMaster/getway/users/transactions?user_id=${userId}`;

  fetch(url)
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const transactions = response.data;
        const historyBody = document.getElementById("transactionHistoryBody");
        historyBody.innerHTML = "";

        if (transactions.length === 0) {
          historyBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Không có giao dịch nào.</td></tr>`;
          return;
        }

        transactions.forEach(t => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${t.transaction_id}</td>
            <td>${t.amount.toLocaleString()} đ</td>
            <td>${t.transaction_type}</td>
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
    .catch(err => {
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
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      console.log("Phản hồi từ API:", response);
      if (response.status === "success") {
        alert("Thêm nhân viên thành công!");
        loadStaffList();
        closeModal("staffModal");
      } else {
        alert("Lỗi: " + response.message);
      }
    })
    .catch(err => {
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
    email: email
  };

  fetch("http://localhost/NetMaster/getway/users/update_by_id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert("Cập nhật thành công!");
        closeModal("updateUser");
        loadCustomerList();
        loadStaffList();
      } else {
        alert("Cập nhật thất bại: " + data.message);
      }
    })
    .catch(error => {
      console.error("Lỗi khi cập nhật người dùng:", error);
      alert("Đã xảy ra lỗi khi gửi yêu cầu cập nhật.");
    });
}

//Hàm cập nhật số dư
async function changeBalance(userId, amount) {
  const response = await fetch("http://localhost/NetMaster/getway/users/change_balance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, amount: amount })
  });

  const result = await response.json();
  console.log(result);

}







