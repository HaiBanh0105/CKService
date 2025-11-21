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
async function updateSessionStatus(sessionId, status, end_time ,total_minutes_played, total_cost) {
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
          total_minutes_played:  total_minutes_played,
          total_cost: total_cost
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
