async function callCreateOtp(user_id, user_email, purpose) {
  try {
    const res = await fetch("http://localhost/NetMaster/getway/otp/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user_id,
        user_email: user_email,
        purpose: purpose
      })
    });
    const data = await res.json();
    return data; // {status: "success", message: "..."} hoặc {status: "error", message: "..."}
  } catch (err) {
    console.error("API Create OTP Error:", err);
    return {status: "error", message: "Lỗi hệ thống khi tạo OTP"};
  }
}

async function callConfirmOtp(user_id, otp_code, purpose) {
  try {
    const res = await fetch("http://localhost/NetMaster/getway/otp/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user_id,
        otp_code: otp_code,
        purpose: purpose
      })
    });
    const data = await res.json();
    return data; // {status: "success", message: "..."} hoặc {status: "error", message: "..."}
  } catch (err) {
    console.error("API Confirm OTP Error:", err);
    return {status: "error", message: "Lỗi hệ thống khi xác nhận OTP"};
  }
}
