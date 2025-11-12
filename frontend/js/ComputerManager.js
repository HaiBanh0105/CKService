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
        if (statusText === "Đang sử dụng" || statusText === "Đã đặt trước") {
          const userName = await fetchUserNameByComputerId(pc.computer_id);
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


async function fetchUserNameByComputerId(computerId) {
  try {
    // Bước 1: Lấy user_id từ computer_id
    const sessionUrl = `http://localhost/NetMaster/getway/session/user_id_by_computer?computer_id=${computerId}`;
    const sessionRes = await fetch(sessionUrl);
    const sessionData = await sessionRes.json();

    if (sessionData.status !== "success" || !sessionData.user_id) {
      console.warn("Không tìm thấy phiên hoạt động:", sessionData.message);
      return null;
    }

    const userId = sessionData.user_id;

    // Bước 2: Lấy thông tin người dùng từ user_id
    const userUrl = `http://localhost/NetMaster/getway/users/get_by_id?user_id=${userId}`;
    const userRes = await fetch(userUrl);
    const userData = await userRes.json();

    if (userData.status === "success" && userData.data && userData.data.full_name) {
      return userData.data.full_name;
    } else {
      console.warn("Không tìm thấy người dùng:", userData.message);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
}








