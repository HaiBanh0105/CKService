function handleAddComputer() {
  const name = document.getElementById("computerName").value.trim();
  const configName = document.getElementById("configSelector").value;

  if (!name || !configName) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const payload = {
    computer_name: name,
    config_name: configName
  };

  fetch("http://localhost/NetMaster/getway/computers/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(response => {
      console.log("Phản hồi từ API:", response);
      if (response.status === "success") {
        alert("✅ Máy tính đã được thêm thành công!");
        closeModal("computerModal");
        if (typeof loadComputers === "function") {
          loadComputers(); // hoặc renderComputers() nếu bạn có hàm hiển thị lại
        }
      } else {
        alert("❌ Lỗi: " + response.message);
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API thêm máy:", err);
      alert("❌ Đã xảy ra lỗi khi thêm máy.");
    });
}


async function loadComputers() {
  try {
    const res = await fetch("http://localhost/NetMaster/getway/computers/all");
    const response = await res.json();

    if (response.status === "success") {
      const computers = response.data;
      const grid = document.getElementById("computerGrid");
      grid.innerHTML = "";

      for (const pc of computers) {
        const card = document.createElement("div");

        const statusClass = Boolean(pc.is_remote_locked)
          ? "offline"
          : pc.current_status === "available"
          ? "available"
          : pc.current_status === "in_use"
          ? "in-use"
          : pc.current_status === "offline"
          ? "offline"
          : pc.current_status === "reserved"
          ? "reserved"
          : "maintenance";

        card.className = `computer-card ${statusClass}`;

        let statusText = "Bảo trì";
        if (Boolean(pc.is_remote_locked)) {
          statusText = "Bị khóa";
        } else {
          switch (pc.current_status) {
            case "available":
              statusText = "Trống";
              break;
            case "in_use":
              statusText = "Đang sử dụng";
              break;
            case "offline":
              statusText = "Tắt máy";
              break;
            case "reserved":
            statusText = "Đã đặt trước";
            break;
          }
        }

        // let userIdText = "";
        // if (statusText === "Đang sử dụng" || statusText === "Đã đặt trước") {
        //   const userId = await fetchUserIdByComputerId(pc.computer_id);
        //   userIdText = userId ? `User ID: ${userId}` : "Không có người dùng";
        // }
        let userText = "";
        if (statusText === "Đang sử dụng") {
          const userName = await fetchUserNameByComputerId_Session(pc.computer_id);
          userText = userName ? `${userName}` : "";
        }
        else if (statusText === "Đã đặt trước") {
          const userName = await fetchUserNameByComputerId_Booking(pc.computer_id);
          userText = userName ? `${userName}` : "";
        }
        // Tạo nội dung HTML
        let html = `
          <div class="computer-icon"><i class="fas fa-desktop"></i></div>
          <div class="computer-name">${pc.computer_name}</div>
          <div class="computer-status">${statusText}</div>
        `;

        if (userText) {
          html += `<div class="user-id" style="color: #666; font-weight: 500;">
                    Người dùng: <span style="color: #000; font-weight: normal;">${userText}</span>
                  </div>`;
        }

        card.innerHTML = html;
      

        card.addEventListener("click", () => {
          openModal("editComputerModal", () => {
            openEditComputerModal(pc);
          });
        });

        grid.appendChild(card);
      }
    } else {
      alert("Không thể tải danh sách máy tính.");
    }
  } catch (err) {
    console.error("Lỗi khi gọi API máy tính:", err);
    alert("Đã xảy ra lỗi khi tải máy tính.");
  }
}



function openEditComputerModal(pc) {
document.getElementById("editComputerName").value = pc.computer_name;
const configMap = {
  1: "Basic",
  2: "Gaming",
  3: "Workstation"
};

document.getElementById("editConfigName").value = configMap[pc.config_id];
document.getElementById("editStatus").value = pc.current_status;
document.getElementById("editRemoteLock").checked = Boolean(pc.is_remote_locked)

// Hiển thị nút "Bắt đầu" nếu máy tính đang ở trạng thái "Đã đặt trước"
if ((pc.current_status === "reserved" || pc.current_status === "available") && !pc.is_remote_locked ) {
  document.getElementById("btnStart").style.display = "inline";
}

  // Lưu ID máy để cập nhật
  document.getElementById("editComputerModal").dataset.computerId = pc.computer_id;
}

function submitComputerUpdate() {
  const id = document.getElementById("editComputerModal").dataset.computerId;
  const name = document.getElementById("editComputerName").value.trim();
  const config = document.getElementById("editConfigName").value;
  const status = document.getElementById("editStatus").value;
  const locked = document.getElementById("editRemoteLock").checked;

  const payload = {
    computer_id: id,
    computer_name: name,
    config_name: config,
    current_status: status,
    remote_locked: locked
  };

  fetch("http://localhost/NetMaster/getway/computers/update_computer", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        alert("Cập nhật thành công!");
        closeModal("editComputerModal");
        loadComputers();
      } else {
        alert("Lỗi: " + response.message);
      }
    })
    .catch(err => {
      console.error("Lỗi khi cập nhật máy:", err);
      alert("Đã xảy ra lỗi khi cập nhật.");
    });
}

async function startSession(){
  const computerId = document.getElementById("editComputerModal").dataset.computerId;
  if (!computerId) {
    alert("Không tìm thấy ID máy tính.");
    return;
  }
   try {
    const status = await getComputerStatus(computerId);

    if (status === null) {
      alert("Không thể lấy trạng thái máy tính. Vui lòng thử lại.");
      return;
    }

    if (status === "reserved") {
      const userName = await fetchUserNameByComputerId_Booking(computerId);
      const userId = await fetchUserIdByComputerId_Booking(computerId);
      
      const startTime = getCurrentTimeICT();

      const success = await addSession(userId, computerId, startTime, "active");

      if (success) {
        alert("Phiên đã được tạo thành công!");
        const update_status = await updateComputerStatus(computerId, "in_use");
        if (update_status) {
          closeModal("editComputerModal");
          loadComputers();
        }
      } else {
        alert("Tạo phiên thất bại. Vui lòng kiểm tra lại.");
      }
    }

  } catch (error) {
    console.error("Lỗi khi bắt đầu phiên:", error);
    alert("Đã xảy ra lỗi khi kiểm tra trạng thái máy tính.");
  }
}


async function updateComputerStatus(computerId, status) {
  const url = "http://localhost/NetMaster/getway/computers/update_status";

  const payload = {
    computer_id: computerId,
    current_status: status
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      console.log("✅ Trạng thái đã được cập nhật:", result.message);
      return true;
    } else {
      console.warn("⚠️ Lỗi cập nhật trạng thái:", result.message);
      return false;
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error);
    return false;
  }
}

function loadConfigDetails() {
  const configName = document.getElementById("configSelector").value;
  if (!configName) return;

  fetch("http://localhost/NetMaster/getway/computers/config_detail?name=" + encodeURIComponent(configName))
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const cfg = response.data;
        document.getElementById("cpuSpec").value = cfg.cpu_spec || "";
        document.getElementById("gpuSpec").value = cfg.gpu_spec || "";
        document.getElementById("ramSpec").value = cfg.ram_spec || "";
      } else {
        alert("❌ Không tìm thấy cấu hình.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API cấu hình:", err);
      alert("❌ Đã xảy ra lỗi khi tải cấu hình.");
    });
}


function submitConfigUpdate() {
  const configName = document.getElementById("configSelector").value;
  const cpu = document.getElementById("cpuSpec").value.trim();
  const gpu = document.getElementById("gpuSpec").value.trim();
  const ram = document.getElementById("ramSpec").value.trim();

  if (!configName || !cpu || !gpu || !ram) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const payload = {
    config_name: configName,
    cpu_spec: cpu,
    gpu_spec: gpu,
    ram_spec: ram
  };

  fetch("http://localhost/NetMaster/getway/computers/update_config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        alert("✅ Cấu hình đã được cập nhật!");
        closeModal("configModal");
      } else {
        alert("❌ Lỗi: " + response.message);
      }
    })
    .catch(err => {
      console.error("Lỗi khi cập nhật cấu hình:", err);
      alert("❌ Đã xảy ra lỗi khi cập nhật.");
    });
}

function loadConfigOptions() {
  const select = document.getElementById("configSelector");
  select.innerHTML = `<option value="">-- Chọn cấu hình --</option>`;

  fetch("http://localhost/NetMaster/getway/computers/config_names")
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        response.data.forEach(cfg => {
          const opt = document.createElement("option");
          opt.value = cfg.config_name;
          opt.textContent = cfg.config_name;
          select.appendChild(opt);
        });
      } else {
        alert("Không thể tải danh sách cấu hình.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi tải config_name:", err);
      alert("Đã xảy ra lỗi khi tải cấu hình.");
    });
}


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


// Hàm lấy user_id từ computer_id qua session
async function fetchUserIdByComputerId_Session(computerId) {
  const url = `http://localhost/NetMaster/getway/session/user_id_by_computer?computer_id=${encodeURIComponent(computerId)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.status === "success" && result.user_id) {
      return result.user_id;
    } else {
      console.warn("Không tìm thấy phiên hoạt động:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy user_id từ session:", error);
    return null;
  }
}

// Hàm lấy user_id từ computer_id qua booking
async function fetchUserIdByComputerId_Booking(computerId) {
  const url = `http://localhost/NetMaster/getway/booking/user_id_by_computer?computer_id=${encodeURIComponent(computerId)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.status === "success" && result.user_id) {
      return result.user_id;
    } else {
      console.warn("Không tìm thấy phiên hoạt động:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy user_id:", error);
    return null;
  }
}

// Hàm lấy full_name từ user_id
async function fetchUserNameByUserId(userId) {
  const url = `http://localhost/NetMaster/getway/users/get_by_id?user_id=${encodeURIComponent(userId)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.status === "success" && result.data?.full_name) {
      return result.data.full_name;
    } else {
      console.warn("Không tìm thấy người dùng:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
}

// Hàm lấy full_name từ computer_id qua session
async function fetchUserNameByComputerId_Session(computerId) {
  const userId = await fetchUserIdByComputerId_Session(computerId);
  if (!userId) return null;

  const fullName = await fetchUserNameByUserId(userId);
  return fullName;
}

// Hàm lấy full_name từ computer_id qua booking
async function fetchUserNameByComputerId_Booking(computerId) {
  const userId = await fetchUserIdByComputerId_Booking(computerId);
  if (!userId) return null;

  const fullName = await fetchUserNameByUserId(userId);
  return fullName;
}


// Hàm lấy trạng thái máy tính theo computer_id
async function getComputerStatus(computer_id) {
  const url = `http://localhost/NetMaster/getway/computers/get_by_id?computer_id=${encodeURIComponent(computer_id)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    if (result.status === 'success' && result.data?.current_status !== undefined) {
      return result.data.current_status; // ✅ Lấy đúng trường trạng thái
    } else {
      throw new Error(result.message || "Không tìm thấy trạng thái.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error.message);
    return null;
  }
}


async function addSession(user_id, computer_id, start_time, status) {
  const url = "http://localhost/NetMaster/getway/session/add_session";

  const payload = {
    user_id,
    computer_id,
    start_time,
    status
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
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







function getCurrentTimeICT() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const parts = formatter.formatToParts(now).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}
