

// function handleProfileTabClick() {
//   showSection('profile', () => {
//     loadUserInfo(localStorage.getItem('userID'));
//   });

// }
let currentBalance = 0;

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
        currentBalance = user.current_balance;
        const formattedBalance = new Intl.NumberFormat("vi-VN").format(user.current_balance);
        document.getElementById("userBalance").textContent = `Số dư: ${formattedBalance} đ`;

        // document.getElementById("userBalance").textContent = `Số dư: ${user.current_balance.toLocaleString()} VNĐ`;

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


let rechargeAmount = 0;

async function processRecharge() {
  const user_id = localStorage.getItem("customerID");
  const user_email = localStorage.getItem("customerEmail");
  const amountText = document.getElementById("rechargeAmount").value;
  rechargeAmount = parseInt(amountText.replace(/\D/g, "")) || 0;

  if (rechargeAmount < 10000) {
    alert("⚠️ Vui lòng nhập số tiền hợp lệ (tối thiểu 10.000đ).");
    return;
  }

  const submitBtn = document.getElementById("submitBtn");

  // Đổi text + màu khi đang gửi OTP
  submitBtn.textContent = "📨 Mã OTP đang được gửi đến bạn...";
  submitBtn.style.backgroundColor = "orange";
  submitBtn.style.color = "white";

  const res = await callCreateOtp(user_id, user_email, "recharge");

  if (res.status === "success") {
    alert("📩 OTP đã được gửi đến email của bạn. Vui lòng nhập OTP để xác nhận!");
    submitBtn.textContent = "🔄 Gửi lại OTP";
    submitBtn.style.backgroundColor = "green";
    submitBtn.style.color = "white";
    document.getElementById("enterOtpBtn").style.display = "block";
  } else {
    alert("❌ Không thể gửi OTP. Vui lòng thử lại.");
    submitBtn.textContent = "Xác nhận nạp tiền";
    submitBtn.style.backgroundColor = "#007bff"; // màu xanh mặc định
    submitBtn.style.color = "white";
  }
}



// async function handleOtpInput() {
//   const user_id = localStorage.getItem("customerID");
//   const otp_input = prompt("🔐 Nhập mã OTP đã nhận qua email:");

//   if (!otp_input) {
//     alert("⚠️ Bạn chưa nhập mã OTP.");
//     return;
//   }

//   const confirmRes = await callConfirmOtp(user_id, otp_input, "recharge");
//   if (confirmRes.status === "success") {
//     changeBalance(user_id, rechargeAmount);
//     alert(`✅ Nạp thành công ${new Intl.NumberFormat("vi-VN").format(rechargeAmount)} đ`);
//     closeModal('rechargeModal');
//     loadBalance(user_id);
//     document.getElementById("enterOtpBtn").style.display = "none";
//   } else {
//     alert("❌ OTP không hợp lệ hoặc đã hết hạn.");
//   }
// }

async function handleOtpInput(purpose) {
  const user_id = localStorage.getItem("customerID");
  const otp_input = prompt("🔐 Nhập mã OTP đã nhận qua email:");

  if (!otp_input) {
    alert("⚠️ Bạn chưa nhập mã OTP.");
    return;
  }

  const confirmRes = await callConfirmOtp(user_id, otp_input, purpose);
  if (confirmRes.status === "success") {
    if (purpose === "recharge") {
      changeBalance(user_id, rechargeAmount);
      alert(`✅ Nạp thành công ${new Intl.NumberFormat("vi-VN").format(rechargeAmount)} đ`);
      closeModal('rechargeModal');
      loadBalance(user_id);
    } else if (purpose === "booking") {
      // Sau khi OTP hợp lệ thì tiến hành tạo booking
      await finalizeBooking(user_id);
    }
  } else {
    alert("❌ OTP không hợp lệ hoặc đã hết hạn.");
  }
}



async function createBooking() {
  const user_id = localStorage.getItem("customerID");
  const user_email = localStorage.getItem("customerEmail");
  const type = document.getElementById("bookingType").value;
  const start_time = document.getElementById("bookingTime").value;
  const total_duration_hours = parseInt(document.getElementById("bookingHours").value);
  const depositText = document.getElementById("depositPreview").value;
  const deposit = parseInt(depositText.replace(/\D/g, "")) || 0;
  const notes = document.getElementById("bookingNotes").value;

  if (!type || !start_time || !total_duration_hours) {
    alert("⚠️ Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  // Kiểm tra số dư trước khi gửi OTP
  if (currentBalance < deposit) {
    alert("⚠️ Số dư không đủ để đặt chỗ. Vui lòng nạp thêm tiền.");
    return;
  }

  // 1) Gọi API lấy máy trống theo config
  let computer;
  try {
    const res = await fetch(`http://localhost/NetMaster/getway/computers/get_available_by_config?config_name=${type}`);
    const data = await res.json();

    if (data.status !== "success" || !data.data) {
      alert(data.message || "Không tìm thấy máy phù hợp.");
      return;
    }
    computer = data.data;
  } catch (err) {
    console.error("Lỗi khi lấy máy trống:", err);
    alert("❌ Không thể lấy danh sách máy trống.");
    return;
  }

  // 2) Gửi OTP cho mục đích booking
  try {
    const otpRes = await callCreateOtp(user_id, user_email, "booking");
    if (otpRes.status === "success") {
      alert("📩 OTP đã được gửi đến email của bạn. Vui lòng nhập OTP để xác nhận đặt chỗ!");

      // Hiện nút nhập OTP
      const btn = document.getElementById("enterBookingOtpBtn");
      btn.style.display = "block";

      // Lưu tạm payload để xác nhận sau khi OTP hợp lệ
      window.bookingPayload = {
        user_id,
        computer_id: computer.computer_id,
        config_id: computer.config_id,
        start_time,
        total_duration_hours,
        deposit,
        notes
      };
    } else {
      alert(otpRes.message || "❌ Không thể gửi OTP. Vui lòng thử lại.");
    }
  } catch (err) {
    console.error("Lỗi khi gửi OTP:", err);
    alert("❌ Đã xảy ra lỗi khi gửi OTP. Vui lòng thử lại.");
  }
}



async function finalizeBooking(user_id) {
  const payload = window.bookingPayload;
  if (!payload) {
    alert("⚠️ Không tìm thấy thông tin đặt chỗ.");
    return;
  }

  try {
    const res = await fetch("http://localhost/NetMaster/getway/booking/create_booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();

    if (result.status === "success" && result.data && result.data.computer_id) {
      alert(`✅ Đặt chỗ thành công! Máy của bạn là: ${result.data.computer_id}`);
      updateComputerStatus(result.data.computer_id, "reserved",result.data.reservation_id);
      changeBalance(user_id, -payload.deposit);
      loadBalance(user_id);
      loadBookingHistory(user_id);
      document.getElementById("bookingForm").reset();
      document.getElementById("enterBookingOtpBtn").style.display = "none";
    } else {
      alert(result.message || "Không thể tạo đơn đặt chỗ.");
    }
  } catch (err) {
    console.error("Lỗi khi gọi API booking:", err);
    alert("❌ Đã xảy ra lỗi khi tạo đơn đặt chỗ. Vui lòng thử lại.");
  }
}







async function loadBookingHistory(userId) {
  try {
    // Gọi API load_booking
    const response = await fetch(`http://localhost/NetMaster/getway/booking/load_booking?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    // Lấy phần tử hiển thị
    const bookingList = document.getElementById("bookingList");
    bookingList.innerHTML = "";

    // Kiểm tra kết quả
    if (result.status === "success" && result.data.length > 0) {
      result.data.forEach(b => {
        const item = document.createElement("div");
        item.classList.add("booking-item");
        item.innerHTML = `
          <p><strong>Mã đặt chỗ:</strong> ${b.reservation_id}</p>
          <p><strong>Bắt đầu:</strong> ${b.start_time}</p>
          <p><strong>Thời lượng:</strong> ${b.total_duration_hours} giờ</p>
          <p><strong>Trạng thái:</strong> ${b.status}</p>
          <p><strong>Đặt cọc:</strong> ${new Intl.NumberFormat("vi-VN").format(b.deposit)} VNĐ</p>
          <p><strong>Ghi chú:</strong> ${b.notes || ""}</p>
        `;
        bookingList.appendChild(item);
      });
    } else {
      bookingList.innerHTML = "<p>⚠️ Không có lịch sử đặt chỗ.</p>";
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error);
    document.getElementById("bookingList").innerHTML = "<p>❌ Không thể tải lịch sử đặt chỗ.</p>";
  }
}


