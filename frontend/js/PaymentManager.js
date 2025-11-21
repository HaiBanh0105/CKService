function loadComputersToPayment() {
  fetch("http://localhost/NetMaster/getway/computers/active")
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const computers = response.data;
        const grid = document.getElementById("paymentGrid");
        grid.innerHTML = "";

        computers.forEach((pc) => {
          const card = document.createElement("div");
          card.className = `computer-card ${pc.current_status}`;

          let html = `
            <div class="computer-icon"><i class="fas fa-desktop"></i></div>
            <div class="computer-name">${pc.computer_name}</div>
            <div class="computer-status">Đang sử dụng</div>`;

          let userText = "";
          fetchUserNameByComputerId_Session(pc.computer_id).then((data) => {
            userText = data ? data : "";
            html += `
              <div class="user-id" style="color: #666; font-weight: 500;">
                Người dùng: <span style="color: #000; font-weight: normal;">${userText}</span>
              </div>
            `;
            card.innerHTML = html;
          });

          card.addEventListener("click", () => {
            openModal("paymentModal", () => {
              loadDataToPayment(pc, userText);
            });
            //  openModal('paymentModal');
          });
          grid.appendChild(card);
        });
      } else {
        alert("Không thể tải danh sách máy tính.");
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API máy tính:", err);
      alert("Đã xảy ra lỗi khi tải máy tính.");
    });
}

let session;
let booking;
let deposit = 0;
let times;
let totalAmount;

async function loadDataToPayment(pc, user_name) {
  const computerId = pc.computer_id;
  document.getElementById("paymentComputerName").value = pc.computer_name;
  document.getElementById("paymentUserName").value = user_name;

  session = await fetchByComputerId_Session(computerId);
  if (pc.reservation_id != null || pc.reservation_id != 0) {
    booking = await fetchByComputerId_Booking(computerId);
    deposit = booking.deposit;
  }
  if (pc.reservation_id == null || pc.reservation_id == 0) {
    deposit = 0;
  }

  times = await calcSessionMinutes(computerId);
  const paymentTimeEl = document.getElementById("paymentTime");

  if (times !== null) {
    // format ra giờ + phút
    const hours = Math.floor(times / 60);
    const mins = times % 60;
    paymentTimeEl.value =
      hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
  } else {
    paymentTimeEl.value = "Không có dữ liệu";
  }

  const price = pc.price_per_hour;

  //Tối thiểu phải 1 giờ (do đặt cọc trước)
  if (deposit != 0) {
    totalAmount = deposit;
  }
  if ((times * price) / 60 > deposit) {
    totalAmount = (times * price) / 60 - deposit;
  }

  document.getElementById("paymentAmount").value =
    parseInt(totalAmount).toLocaleString("vi-VN") + " đ";
  // parseInt(totalAmount).toLocaleString("vi-VN") VND/giờ

  const subpayment = document.getElementById("btnSubPayment");
  subpayment.addEventListener("click", () => {
    confirmPayment(pc);
  });
}

async function calcSessionMinutes(computerId) {
  // const session = await fetchByComputerId_Session(computerId);

  if (session && session.start_time) {
    let now = Date.now();
    const start = new Date(session.start_time.replace(" ", "T")).getTime();
    const diffMs = now - start;
    return Math.floor(diffMs / 60000);
  } else {
    console.warn("Không có session hoặc thiếu start_time");
    return null;
  }
}

async function confirmPayment(pc) {
  let payload;
  let result;
  let selectedMethod = document.getElementById("selectedPaymentMethod").value;
  if (!selectedMethod) {
    alert("Vui lòng chọn phương thức thanh toán trước khi tiếp tục.");
  }

  const endtime = getCurrentTimeICT();

  //Trường hợp có đặt trước
  if (pc.reservation_id == 1) {
    payload = {
      staff_id: localStorage.getItem("userID"),
      user_id: session.user_id,
      session_id: session.session_id,
      computer_id: session.computer_id,
      start_time: session.start_time,
      end_time: endtime,
      total_duration_minutes: times,
      deposit_amount: deposit,
      total_amount: totalAmount,
      payment_method: selectedMethod,
      payment_status: "paid",
      notes: "Thanh toán qua " + selectedMethod,
    };

    result = await addToCustomerPayment(payload);
  } else {
    //Trường hợp không đặt trước nhưng có tài khoản
    if (session.user_id != null) {
      payload = {
        staff_id: localStorage.getItem("userID"),
        user_id: session.user_id,
        session_id: session.session_id,
        computer_id: session.computer_id,
        start_time: session.start_time,
        end_time: endtime,
        total_duration_minutes: times,
        deposit_amount: deposit,
        total_amount: totalAmount,
        payment_method: selectedMethod,
        payment_status: "paid",
        notes: "Thanh toán qua " + selectedMethod,
      };

      result = await addToCustomerPayment(payload);
    }
    //Trường hợp khách vãng lai
    else {
      if (selectedMethod === "account") {
        msgBox.textContent =
          "❌ Không có tài khoản vui lòng chọn lại phương thức";
        msgBox.style.color = "red";
        return;
      }

      payload = {
        staff_id: localStorage.getItem("userID"),
        session_id: session.session_id,
        computer_id: session.computer_id,
        guest_name: session.full_name,
        start_time: session.start_time,
        end_time: endtime,
        total_duration_minutes: times,
        total_amount: totalAmount,
        payment_method: selectedMethod,
        payment_status: "paid",
        notes: "Thanh toán qua " + selectedMethod,
      };

      result = await addToGuestPayment(payload);
    }
  }

  msgBox = document.getElementById("messageBox");

  // Hiển thị thông báo ngay trong giao diện
  if (result.status === "success") {
    msgBox.textContent = "✅ Thanh toán thành công!";
    msgBox.style.color = "green";

    // Cập nhật trạng thái máy tính và session
    await updateComputerStatus(session.computer_id, "available", 0);
    await updateSessionStatus(
      session.session_id,
      "ended",
      endtime,
      times,
      totalAmount
    );

    // Nếu phương thức là tài khoản thì trừ tiền tài khoản
    if (selectedMethod === "account") {
      changeBalance(session.user_id, -totalAmount, null);
    }
    closeModal("paymentModal");
  } else {
    msgBox.textContent = "❌ Có lỗi: " + result.message;
    msgBox.style.color = "red";
  }
}

async function addToCustomerPayment(payload) {
  try {
    const response = await fetch(
      "http://localhost/NetMaster/getway/payment/add_to_customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling add_to_customer API:", error);
    return { status: "error", message: error.message };
  }
}

async function addToGuestPayment(payload) {
  try {
    const response = await fetch(
      "http://localhost/NetMaster/getway/payment/add_to_guest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling add_to_guest API:", error);
    return { status: "error", message: error.message };
  }
}

function selectPaymentMethod(method) {
  // Xóa trạng thái "active" khỏi tất cả các phương thức
  const methods = document.querySelectorAll(".payment-method");
  methods.forEach((m) => m.classList.remove("active"));

  // Thêm trạng thái "active" cho phương thức được chọn
  const selected = document.querySelector(
    `.payment-method[data-method="${method}"]`
  );
  if (selected) {
    selected.classList.add("active");
  }

  // Lưu giá trị đã chọn vào một input hidden (nếu cần gửi form)
  let hiddenInput = document.getElementById("selectedPaymentMethod");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "selectedPaymentMethod";
    hiddenInput.name = "payment_method";
    document.querySelector(".form-group").appendChild(hiddenInput);
  }
  hiddenInput.value = method;

  // Debug/log ra console
  console.log("Phương thức thanh toán đã chọn:", method);
}
