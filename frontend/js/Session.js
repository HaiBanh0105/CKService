async function addSession(
  user_id,
  computer_id,
  full_name,
  start_time,
  status,
  reservation_id
) {
  const url = "http://localhost/NetMaster/getway/session/add_session";

  const payload = {
    user_id,
    computer_id,
    full_name,
    start_time,
    status,
    reservation_id,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      console.log("✅ Phiên mới đã được thêm:", result.message);
      return true;
    } else {
      console.warn("❌ Không thể thêm phiên:", result.message);
      return false;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API add_session:", error);
    return false;
  }
}

// Hàm lấy UserId theo computer_id
async function fetchUserIdByComputerId(computerId) {
  const url = `http://localhost/NetMaster/getway/session/user_id_by_computer?computer_id=${computerId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success") {
      return data.user_id;
    } else {
      console.warn("Không tìm thấy phiên hoạt động:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
}

// Hàm lấy danh sách session theo user_id
async function fetchUserIdByComputerId(user_id) {
  const url = `http://localhost/NetMaster/getway/session/get_session_by_user_id?user_id=${user_id}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success") {
      return data;
    } else {
      console.warn("Không tìm thấy phiên hoạt động:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
}

// Hàm lấy session theo computer_id
async function fetchByComputerId_Session(computerId) {
  const url = `http://localhost/NetMaster/getway/session/latest_by_computer_id?computer_id=${encodeURIComponent(
    computerId
  )}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.status === "success" && result.session) {
      return result.session;
    } else {
      console.warn("Không tìm thấy phiên hoạt động:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy session:", error);
    return null;
  }
}

//Cập nhật trạng thái
async function updateSessionStatus(
  sessionId,
  status,
  end_time,
  total_minutes_played,
  total_cost
) {
  try {
    const response = await fetch(
      "http://localhost/NetMaster/getway/session/update_status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          status: status,
          end_time: end_time,
          total_minutes_played: total_minutes_played,
          total_cost: total_cost,
        }),
      }
    );

    const result = await response.json();
    console.log("Kết quả cập nhật cho session:", sessionId);
    return result;
  } catch (error) {
    console.error("Lỗi khi gọi API update_status:", error);
    return { status: "error", message: error.message };
  }
}

// Hàm mở modal lịch sử giao dịch của khách hàng
function openSessionHistory(userId) {
  console.log("Gọi API lịch sử cho user_id =", userId);

  const url = `http://localhost/NetMaster/getway/session/get_session_by_user_id?user_id=${userId}`;

  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const sessions = response.session;
        const historyBody = document.getElementById("sessionHistoryBody");
        historyBody.innerHTML = "";

        if (sessions.length === 0) {
          historyBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Không có phiên hoạt động nào.</td></tr>`;
          return;
        }

        sessions.forEach((t) => {
          let end_time, total_cost;
          if (t.status == "actived") {
            text = "đang hoạt động";
            end_time = "chưa kết thúc";
            total_cost = 0;
          } else {
            text = "kết thúc";
            end_time = new Date(t.end_time).toLocaleString();
            total_cost = t.total_cost.toLocaleString();
          }
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${t.computer_id}</td>
            <td>${new Date(t.start_time).toLocaleString()}</td>
            <td>${end_time}</td>
            <td>${total_cost}đ</td>
            <td>${text}</td>
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
