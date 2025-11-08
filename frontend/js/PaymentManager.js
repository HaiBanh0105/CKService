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

          card.innerHTML = `
            <div class="computer-icon">
              <i class="fas fa-desktop"></i>
            </div>
            <div class="computer-name">${pc.computer_name}</div>
            <div class="computer-status">Đang sử dụng</div>
          `;
          // card.addEventListener("click", () => {
          //   openModal('updateUser');
          //   });
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