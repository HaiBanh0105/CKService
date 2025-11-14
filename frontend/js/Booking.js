

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


function updateDeposit() {
  const type = document.getElementById("bookingType").value;
  const hours = parseInt(document.getElementById("bookingHours").value);
  let rate = 0;

  switch (type) {
    case "basic": rate = 20000; break;
    case "gaming": rate = 30000; break;
    case "workstation": rate = 35000; break;
  }

  const deposit = (rate * hours) / 2;
  document.getElementById("depositPreview").value = deposit.toLocaleString() + " VNĐ";
}


function createBooking(){
    const type = document.getElementById("bookingType").value;
    
    if (!type) {
    alert("Vui lòng chọn loại máy.");
    return;
  }

  // Gọi API lấy máy trống theo config_name
  fetch(`http://localhost/NetMaster/getway/computers/get_available_by_config?config_name=${type}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        const computer = data.data;
        
        // Bạn có thể tiếp tục gọi API tạo đơn đặt chỗ tại đây

        // hoặc lưu computer_id để dùng sau
        alert(`Đã đặt thành công! Máy của bạn là: ${computer.computer_name}`);
        
      } else {
        alert(data.message || "Không tìm thấy máy phù hợp.");
        
      }
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error);
      alert("Đã xảy ra lỗi khi tìm máy trống.");
    });

}