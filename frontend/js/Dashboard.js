//Hàm hiển thị tổng máy tính trên dashboard
function loadComputerStats() {
  fetch("http://localhost/NetMaster/getway/computers/total_computers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const total = response.data.total_computers;
        document.getElementById("totalComputers").textContent = total;
      } else {
        console.warn("Không thể lấy tổng số máy:", response.message);
        document.getElementById("totalComputers").textContent = "0";
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
      document.getElementById("totalComputers").textContent = "0";
    });
}

//Hàm hiển thị tổng máy tính đang sử dụng trên dashboard
function loadComputerActive() {
  fetch("http://localhost/NetMaster/getway/computers/total_in_use", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const total = response.data.total_computers;
        document.getElementById("activeComputers").textContent = total;
      } else {
        console.warn("Không thể lấy tổng số máy:", response.message);
        document.getElementById("activeComputers").textContent = "0";
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
      document.getElementById("activeComputers").textContent = "0";
    });
}

//Hàm hiển thị tổng máy tính đang bảo trì trên dashboard
function loadMaintenanceComputers() {
  fetch("http://localhost/NetMaster/getway/computers/total_maintenance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const total = response.data.total_computers;
        document.getElementById("maintenanceComputers").textContent = total;
      } else {
        console.warn("Không thể lấy tổng số máy:", response.message);
        document.getElementById("maintenanceComputers").textContent = "0";
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
      document.getElementById("maintenanceComputers").textContent = "0";
    });
}

//Hiển thị tổng máy bị khóa từ xa trên dashboard
function loadLockedComputers() {
  fetch("http://localhost/NetMaster/getway/computers/total_locked", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        const total = response.data.total_computers;
        document.getElementById("lockedComputers").textContent = total;
      } else {
        console.warn("Không thể lấy tổng số máy:", response.message);
        document.getElementById("lockedComputers").textContent = "0";
      }
    })
    .catch((err) => {
      console.error("Lỗi khi gọi API:", err);
      document.getElementById("lockedComputerss").textContent = "0";
    });
}

//load tổng thu nhập
async function loadRevenueReport() {
  try {
    const res = await fetch(
      "http://localhost/NetMaster/getway/payment/revenue",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const response = await res.json();

    if (response.status === "success") {
      const data = response.data;

      // Cập nhật vào các thẻ báo cáo
      document.getElementById("today").textContent =
        data.today_revenue.toLocaleString("vi-VN") + "đ";
      document.getElementById("week").textContent =
        data.week_revenue.toLocaleString("vi-VN") + "đ";
      document.getElementById("month").textContent =
        data.month_revenue.toLocaleString("vi-VN") + "đ";
      document.getElementById("total").textContent =
        data.total_revenue.toLocaleString("vi-VN") + "đ";
    } else {
      alert(response.message || "Không thể tải báo cáo doanh thu.");
    }
  } catch (err) {
    console.error("Lỗi khi gọi API doanh thu:", err);
    alert("Đã xảy ra lỗi khi tải báo cáo doanh thu.");
  }
}
