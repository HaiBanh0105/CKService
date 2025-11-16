// Hàm lấy session theo computer_id
async function fetchByComputerId_Session(computerId) {
  const url = `http://localhost/NetMaster/getway/session/latest_by_computer_id?computer_id=${encodeURIComponent(computerId)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.status === "success" && result.session && result.session.user_id) {
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