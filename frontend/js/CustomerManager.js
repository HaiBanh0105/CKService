// Hàm tải danh sách khách hàng từ API và hiển thị trong bảng
function loadCustomerList() {
  fetch("http://localhost/NetMaster/getway/users/all")
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
            <td><button class="btn btn-sm btn-info">Chi tiết</button></td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        alert("Không thể tải danh sách khách hàng.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
    });
}


function handleAddCustomer() {
  const data = {
    full_name: document.getElementById("customerName").value,
    phone_number: document.getElementById("customerPhone").value,
    email: document.getElementById("customerEmail").value,
    password: document.getElementById("customerPassword").value,
    initial_balance: parseFloat(document.getElementById("customerBalance").value || "0")
  };

  fetch("http://localhost/NetMaster/getway/users/register", {
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





