function loadComputersToPayment() {
  fetch("http://localhost/NetMaster/getway/computers/active")
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        const computers = response.data;
        const grid = document.getElementById("paymentGrid");
        grid.innerHTML = "";
        
        
        computers.forEach(pc => {
          const card = document.createElement("div");
          card.className = `computer-card ${pc.current_status}`;

          let html = `
            <div class="computer-icon">
              <i class="fas fa-desktop"></i>
            </div>
            <div class="computer-name">${pc.computer_name}</div>
            <div class="computer-status">Đang sử dụng</div>`;

          let userText ="";
          fetchUserNameByComputerId_Session(pc.computer_id).then(data => {
            userText = data ? data : "";
            html += `
              <div class="user-id" style="color: #666; font-weight: 500;">
                Người dùng: <span style="color: #000; font-weight: normal;">${userText}</span>
              </div>
            `;
            card.innerHTML = html;
          });

          card.addEventListener("click", () => {
                openModal('paymentModal', () => {
                    loadDataToPayment(pc,userText);
                });
              //  openModal('paymentModal'); 
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

async function loadDataToPayment(pc, user_name) {
  const computerId = pc.computer_id;
  document.getElementById("paymentComputerName").value = pc.computer_name;
  document.getElementById("paymentUserName").value = user_name;

  const minutes = await calcSessionMinutes(computerId);
  const paymentTimeEl = document.getElementById("paymentTime");

  if (minutes !== null) {
    // format ra giờ + phút
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    paymentTimeEl.value =
      hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
  } else {
    paymentTimeEl.value = "Không có dữ liệu";
  }

}

async function calcSessionMinutes(computerId) {
  const session = await fetchByComputerId_Session(computerId);

  if (session && session.start_time) {
    const now = Date.now();
    const start = new Date(session.start_time.replace(" ", "T")).getTime();
    const diffMs = now - start;
    return Math.floor(diffMs / 60000);
  } else {
    console.warn("Không có session hoặc thiếu start_time");
    return null;
  }
}

