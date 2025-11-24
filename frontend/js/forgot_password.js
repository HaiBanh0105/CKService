document.addEventListener("DOMContentLoaded", () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm_password = document.getElementById("confirm-password");
  const submit = document.getElementById("submit");
  const confirm_otp = document.getElementById("confirm-otp");
  const passwordToggle = document.getElementById("passwordToggle");
  const passwordToggle2 = document.getElementById("passwordToggle2");

  if (passwordToggle && password) {
    passwordToggle.addEventListener("click", () => {
      const type =
        password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      passwordToggle.textContent = type === "text" ? "🙈" : "👁️";
    });
    passwordToggle2.addEventListener("click", () => {
      const type2 =
        confirm_password.getAttribute("type") === "password"
          ? "text"
          : "password";
      confirm_password.setAttribute("type", type2);
      passwordToggle2.textContent = type2 === "text" ? "🙈" : "👁️";
    });
  }

  submit.onclick = async () => {
    if (confirm_password.value != password.value) {
      alert("Mật khẩu xác nhận không đúng");
      return;
    }
    try {
      submit.textContent = "📨 Mã OTP đang được gửi đến bạn...";
      submit.style.backgroundColor = "orange";
      submit.style.color = "white";

      const otpRes = await callCreateOtp(
        0,
        email.value.trim(),
        "reset_password"
      );

      if (otpRes.status === "success") {
        alert(
          "📩 OTP đã được gửi đến email của bạn. Vui lòng nhập OTP để xác nhận đặt chỗ!"
        );

        submit.textContent = "🔄 Gửi lại OTP";
        submit.style.backgroundColor = "green";
        submit.style.color = "white";

        // Hiện nút nhập OTP
        confirm_otp.style.display = "block";
      } else {
        alert(otpRes.message || "❌ Không thể gửi OTP. Vui lòng thử lại.");
        submit.textContent = "Xác nhận";
        submit.style.backgroundColor = "#007bff"; // màu xanh mặc định
        submit.style.color = "white";
      }
    } catch (err) {
      console.error("Lỗi khi gửi OTP:", err);
      alert("❌ Đã xảy ra lỗi khi gửi OTP. Vui lòng thử lại.");
    }
  };

  confirm_otp.onclick = async () => {
    const otp_input = prompt("🔐 Nhập mã OTP đã nhận qua email:");

    if (!otp_input) {
      alert("⚠️ Bạn chưa nhập mã OTP.");
      return;
    }
    const confirmRes = await callConfirmOtp(0, otp_input, "reset_password");
    if (confirmRes.status === "success") {
      try {
        //Gọi hàm đổi password
        const response = await fetch(
          "http://localhost/NetMaster/getway/users/change_password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.value.trim(),
              new_password: confirm_password.value.trim(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }

        const result = await response.json();
        // Hiển thị thông báo dựa trên kết quả
        if (result.status === "success") {
          alert("✅ Đổi mật khẩu thành công!");
          setTimeout(() => {
            window.location.href = "./login.html";
          }, 500);
        } else {
          alert("❌ Lỗi: " + result.message);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API change_password:", error);
        return { status: "error", message: error.message };
      }
    } else {
      alert("❌ OTP không hợp lệ hoặc đã hết hạn.");
    }
  };
});

function cancel() {
  setTimeout(() => {
    window.location.href = "./login.html";
  }, 500);
}
