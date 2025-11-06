//Hàm hiển thị tổng máy tính trên dashboard
function loadComputerStats() {
  fetch("http://localhost/NetMaster/getway/computers/total_computers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const total = response.data.total_computers;
        document.getElementById("totalComputers").textContent = total;
      } else {
        console.warn("Không thể lấy tổng số máy:", response.message);
        document.getElementById("totalComputers").textContent = "0";
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
      document.getElementById("totalComputers").textContent = "0";
    });
}

//Hàm hiển thị tổng máy tính đang sử dụng trên dashboard
function loadComputerActive() {
  fetch("http://localhost/NetMaster/getway/computers/total_in_use", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const total = response.data.total_computers;
        document.getElementById("activeComputers").textContent = total;
      } else {
        console.warn("Không thể lấy tổng số máy:", response.message);
        document.getElementById("activeComputers").textContent = "0";
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
      document.getElementById("activeComputers").textContent = "0";
    });
}

//Hàm hiển thị tổng máy tính đang bảo trì trên dashboard
function loadMaintenanceComputers() {
    fetch("http://localhost/NetMaster/getway/computers/total_maintenance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const total = response.data.total_computers;
        document.getElementById("maintenanceComputers").textContent = total;
      } else {
        console.warn("Không thể lấy tổng số máy:", response.message);
        document.getElementById("maintenanceComputers").textContent = "0";
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
      document.getElementById("maintenanceComputers").textContent = "0";
    });
}

//Hiển thị tổng máy bị khóa từ xa trên dashboard
function loadLockedComputers() {
    fetch("http://localhost/NetMaster/getway/computers/total_locked", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const total = response.data.total_computers;
        document.getElementById("lockedComputers").textContent = total;
      } else {
        console.warn("Không thể lấy tổng số máy:", response.message);
        document.getElementById("lockedComputers").textContent = "0";
      }
    })
    .catch(err => {
      console.error("Lỗi khi gọi API:", err);
      document.getElementById("lockedComputerss").textContent = "0";
    });
}


