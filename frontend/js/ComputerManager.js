function handleAddComputer() {
  const name = document.getElementById("computerName").value.trim();
  const configName = document.getElementById("configName").value;

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


function loadComputers() {
  fetch("http://localhost/NetMaster/getway/computers/all")
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const computers = response.data;
        const grid = document.getElementById("computerGrid");
        grid.innerHTML = "";

        computers.forEach(pc => {
          const card = document.createElement("div");
          card.className = `computer-card ${pc.current_status}`;

          const statusClass =
            (Boolean(pc.is_remote_locked)) ? "offline" :
            pc.current_status === "available"
                ? "available"
                : pc.current_status === "in_use"
                ? "in-use"
                : pc.current_status === "offline"
                ? "offline"
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
              }
            }

          card.innerHTML = `
            <div class="computer-icon">
              <i class="fas fa-desktop"></i>
            </div>
            <div class="computer-name">${pc.computer_name}</div>
            <div class="computer-status">${statusText}</div>
          `;
          card.addEventListener("click", () => {
            openModal('editComputerModal', () => {
              openEditComputerModal(pc);
            });
            });
          grid.appendChild(card);
        });
      } else {
        alert("Không thể tải danh sách máy tính.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API máy tính:", err);
      alert("Đã xảy ra lỗi khi tải máy tính.");
    });
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

  fetch("http://localhost/NetMaster/getway/computers/update", {
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




