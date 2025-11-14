

// function handleProfileTabClick() {
//   showSection('profile', () => {
//     loadUserInfo(localStorage.getItem('userID'));
//   });

// }

function loadBalance(userId) {
  fetch(`http://localhost/NetMaster/getway/users/get_customer_by_id?user_id=${userId}`, {
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
        document.getElementById("userBalance").textContent = `Số dư: ${user.current_balance.toLocaleString()} VNĐ`;

      } else {
        alert("Không thể tải thông tin người dùng: " + data.message);
      }
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error);
      alert("Đã xảy ra lỗi khi tải thông tin người dùng.");
    });
}


function loadCustomerInfo(userId) {
  fetch(`http://localhost/NetMaster/getway/users/get_customer_by_id?user_id=${userId}`, {
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