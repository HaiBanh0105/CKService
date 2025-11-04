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
            pc.current_status === "available"
                ? "available"
                : pc.current_status === "in_use"
                ? "in-use"
                : pc.current_status === "offline"
                ? "offline"
                : "maintenance";

            card.className = `computer-card ${statusClass}`;

          card.innerHTML = `
            <div class="computer-icon">
              <i class="fas fa-desktop"></i>
            </div>
            <div class="computer-name">${pc.computer_name}</div>
            <div class="computer-status">
              ${
                pc.current_status === "available"
                  ? "Trống"
                  : pc.current_status === "in_use"
                  ? "Đang sử dụng"
                  : pc.current_status === "offline"
                  ? "Tắt máy"
                  : "Bảo trì"
              }
            </div>
          `;

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

