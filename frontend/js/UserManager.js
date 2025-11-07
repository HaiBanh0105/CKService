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
          row.innerHTML = `
            <td>${c.user_id}</td>
            <td>${c.full_name}</td>
            <td>${c.phone_number}</td>
            <td>${c.email}</td>
            <td>${c.current_balance.toLocaleString()} đ</td>
            <td>${c.status}</td>
            <button class="btn btn-sm btn-info view-history-btn" data-id="${c.user_id}">Xem lịch sử</button>`;
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
            
            // <button class="btn btn-sm btn-info view-history-btn" data-id="${c.user_id}">Chỉnh sửa</button>`;
          tableBody.appendChild(row);
        });

      
      } else {
        alert("Không thể tải danh sách nhân viên.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
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





